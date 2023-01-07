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
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const Documentation_1 = __importDefault(require("../Documentation"));
const setupPropHandler_1 = __importDefault(require("./setupPropHandler"));
function parse(src, plugins) {
    return (0, babel_parser_1.default)({ plugins }).parse(src);
}
describe('setupPropHandler', () => {
    let documentation;
    let mockPropDescriptor;
    let stubNodePath;
    const options = { filePath: '', validExtends: () => true };
    beforeAll(() => {
        var _a;
        const defaultAST = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse('export default {}');
        stubNodePath = (_a = (0, resolveExportedComponent_1.default)(defaultAST)[0]) === null || _a === void 0 ? void 0 : _a.get('default');
    });
    beforeEach(() => {
        mockPropDescriptor = {
            description: '',
            tags: {},
            name: 'mockProp'
        };
        documentation = new Documentation_1.default('test/path');
        const mockGetPropDescriptor = vi.spyOn(documentation, 'getPropDescriptor');
        mockGetPropDescriptor.mockReturnValue(mockPropDescriptor);
    });
    function parserTest(src, plugins = ['typescript']) {
        return __awaiter(this, void 0, void 0, function* () {
            const ast = parse(src, plugins);
            if (ast) {
                yield (0, setupPropHandler_1.default)(documentation, stubNodePath, ast, options);
            }
            return mockPropDescriptor;
        });
    }
    describe('JavaScript', () => {
        it('should resolve props in defineProps', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
				defineProps({
					testProps: Boolean
				})
				`;
            const prop = yield parserTest(src);
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testProps');
            (0, vitest_1.expect)(prop).toMatchInlineSnapshot(`
				{
				  "description": "",
				  "name": "mockProp",
				  "tags": {},
				  "type": {
				    "name": "boolean",
				  },
				}
			`);
        }));
        it('should resolve props comments in defineProps', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
				defineProps({
					/**
					 * Should the prop be tested?
					 */
					testProps: Boolean
				})
				`;
            const prop = yield parserTest(src);
            (0, vitest_1.expect)(prop).toMatchInlineSnapshot(`
				{
				  "description": "Should the prop be tested?",
				  "name": "mockProp",
				  "tags": {},
				  "type": {
				    "name": "boolean",
				  },
				}
			`);
        }));
        it('should resolve advanced props in defineProps', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
				defineProps({
					/**
					 * Should the prop be required?
					 */
					testProps: {
						type: Boolean,
						required: true
					}
				})
				`;
            const prop = yield parserTest(src);
            (0, vitest_1.expect)(prop).toMatchInlineSnapshot(`
				{
				  "description": "Should the prop be required?",
				  "name": "mockProp",
				  "required": true,
				  "tags": {},
				  "type": {
				    "name": "boolean",
				  },
				}
			`);
        }));
        it('matches defineProps inside of withDefaults', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
      withDefaults(defineProps({
					/**
					 * Should the prop be required?
					 */
					testProps: {
						type: Boolean,
						required: true
					}
				}), {})
				`;
            const prop = yield parserTest(src);
            (0, vitest_1.expect)(prop).toMatchInlineSnapshot(`
				{
				  "description": "Should the prop be required?",
				  "name": "mockProp",
				  "required": true,
				  "tags": {},
				  "type": {
				    "name": "boolean",
				  },
				}
			`);
        }));
    });
    describe('TypeScript', () => {
        describe('literal object', () => {
            it('should resolve props in defineProps type arguments', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						testProps: boolean,
						anotherTestProps: boolean
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testProps');
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('anotherTestProps');
                (0, vitest_1.expect)(prop.type).toMatchObject({
                    name: 'boolean'
                });
            }));
            it('should resolve comments in defineProps', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						/**
						 * A very nice prop
						 */
						anotherTestProps: boolean
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('anotherTestProps');
                (0, vitest_1.expect)(prop.description).toBe('A very nice prop');
            }));
            it('shows optional fields as non-required props', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						optional?: boolean
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('optional');
                (0, vitest_1.expect)(prop.required).toBe(false);
            }));
            it('shows non optional fields as required props', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						required: boolean
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('required');
                (0, vitest_1.expect)(prop.required).toBe(true);
            }));
            it('resolves arrays', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						arrays: number[]
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('arrays');
                (0, vitest_1.expect)(prop.type).toMatchInlineSnapshot(`
					{
					  "elements": [
					    {
					      "name": "number",
					    },
					  ],
					  "name": "Array",
					}
				`);
            }));
            it('returns complex types', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					defineProps<{
						complex: {
              /**
               * foo is one part of the prop
               */
							foo: number,
              /**
               * bar is the other part
               */
							bar: boolean
						}
					}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('complex');
                (0, vitest_1.expect)(prop.type).toMatchObject({
                    name: `{
    foo: number
    bar: boolean
}`
                });
            }));
        });
        describe('local interfaces and types', () => {
            it('resolves local interfaces', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					interface LocalType {
            /**
             * describe the local prop
             */
						inInterface: boolean
					}

					defineProps<LocalType>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('inInterface');
                (0, vitest_1.expect)(prop.required).toBe(true);
                (0, vitest_1.expect)(prop.description).toBe('describe the local prop');
            }));
            it('show prop type names when they are defined elsewhere', () => __awaiter(void 0, void 0, void 0, function* () {
                const src = `
					interface LocalType {
            /**
             * describe the local prop
             */
						inInterface: boolean
					}

					defineProps<{param:LocalType}>()
					`;
                const prop = yield parserTest(src);
                (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('param');
                (0, vitest_1.expect)(prop.type).toMatchObject({ name: 'LocalType' });
            }));
        });
        it('extracts defaults from withDefaults', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
      withDefaults(defineProps<{
					/**
					 * Should the prop be required?
					 */
					testProp?: { myValue: boolean }
				}>(), {
          testProp: { myValue: true }
        })
				`;
            const prop = yield parserTest(src);
            (0, vitest_1.expect)(prop.defaultValue && prop.defaultValue.value).toContain(`myValue: true`);
        }));
    });
});
