"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const classPropHandler_1 = __importDefault(require("./classPropHandler"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0];
}
describe('propHandler', () => {
    let documentation;
    let mockPropDescriptor;
    let ast;
    const options = { filePath: '', validExtends: () => true };
    beforeAll(() => {
        ast = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse('const a  = 1');
    });
    beforeEach(() => {
        mockPropDescriptor = {
            name: '',
            description: '',
            tags: {}
        };
        const MockDocumentation = Documentation_1.default;
        documentation = new MockDocumentation('test/path');
        const mockGetPropDescriptor = vi.spyOn(documentation, 'getPropDescriptor');
        mockGetPropDescriptor.mockReturnValue(mockPropDescriptor);
    });
    function tester(src, matchedObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const def = parse(src).get('default');
            yield (0, classPropHandler_1.default)(documentation, def, ast, options);
            (0, vitest_1.expect)(mockPropDescriptor).toMatchObject(matchedObj);
        });
    }
    describe('base', () => {
        it('should ignore data that does not have the prop decorator', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyComp {
          someData: boolean;
        }`;
            yield tester(src, {});
            (0, vitest_1.expect)(documentation.getPropDescriptor).not.toHaveBeenCalledWith('someData');
        }));
        it('should detect all data that have the prop decorator', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyComp {
          @Prop
          test: string;
        }`;
            yield tester(src, {
                type: { name: 'string' }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('test');
        }));
        it('should detect all data with composite types', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyComp {
          @Prop
          test: string | null;
        }`;
            yield tester(src, {
                type: { name: 'union', elements: [{ name: 'string' }, { name: 'null' }] }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('test');
        }));
        it('should get default expression from the prop decorator', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyTest {
          @Prop({default: 'hello'})
          testDefault: string;
        }`;
            yield tester(src, {
                type: { name: 'string' },
                defaultValue: {
                    value: '"hello"'
                }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testDefault');
        }));
        it('should get required from the prop decorator', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyTest {
          @Prop({required: true})
          testRequired: string;
        }`;
            yield tester(src, {
                type: { name: 'string' },
                required: true
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testRequired');
        }));
        it('should extract descriptions from leading comments', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyTest {
          /**
           * A described prop
           **/
          @Prop
          testDescribed: boolean;
        }`;
            yield tester(src, {
                description: 'A described prop'
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testDescribed');
        }));
        it('should parse the @values tag as its own', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
		@Component
		export default class MyTest {
		  /**
		   * color of the component
		   * @values dark, light
		   **/
		  @Prop
		  color: string;
		}`;
            yield tester(src, {
                description: 'color of the component',
                values: ['dark', 'light']
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('color');
        }));
        it('should parse get the values from TS type', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
		@Component
		export default class MyTest {
		  @Prop
		  color: "dark" | "light";
		}`;
            yield tester(src, {
                values: ['dark', 'light']
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('color');
        }));
        it('should extract type from decorator arguments', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyTest {
          @Prop({type:String})
          testTyped;
        }`;
            yield tester(src, {
                type: { name: 'string' }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testTyped');
        }));
        it('should extract type from decorator itself', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component
        export default class MyTest {
		  @Prop(String)
          testTyped;
        }`;
            yield tester(src, {
                type: { name: 'string' }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testTyped');
        }));
        it('should document props as decorator argument', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
        @Component({
			props: {
				testTyped: String
			}
		})
        export default class MyTest {
        }`;
            yield tester(src, {
                type: { name: 'string' }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testTyped');
        }));
        it('should parse union types properly', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
			import Vue from 'vue'
			import { Prop, Component } from 'vue-property-decorator'
			
			@Component({})
			export default class BaseCheckbox extends Vue {
			  @Prop({ default: '' }) id!: string | number
			  // [… more props here]
			}`;
            yield tester(src, {
                type: { name: 'union' }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('id');
            (0, vitest_1.expect)(mockPropDescriptor.type).toMatchInlineSnapshot(`
				{
				  "elements": [
				    {
				      "name": "string",
				    },
				    {
				      "name": "number",
				    },
				  ],
				  "name": "union",
				}
			`);
        }));
    });
});
