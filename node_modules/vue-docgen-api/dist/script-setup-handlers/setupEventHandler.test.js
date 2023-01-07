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
const babel_parser_1 = __importDefault(require("../babel-parser"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const Documentation_1 = __importDefault(require("../Documentation"));
const setupEventHandler_1 = __importDefault(require("./setupEventHandler"));
function parse(src, plugins) {
    return (0, babel_parser_1.default)({ plugins }).parse(src);
}
describe('setupEventHandler', () => {
    let documentation;
    let mockEventDescriptor;
    let stubNodePath;
    const options = { filePath: '', validExtends: () => true };
    beforeAll(() => {
        var _a;
        const defaultAST = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse('export default {}');
        stubNodePath = (_a = (0, resolveExportedComponent_1.default)(defaultAST)[0]) === null || _a === void 0 ? void 0 : _a.get('default');
    });
    beforeEach(() => {
        mockEventDescriptor = {
            description: '',
            name: 'mockEvent'
        };
        documentation = new Documentation_1.default('test/path');
        const mockGetEventDescriptor = vi.spyOn(documentation, 'getEventDescriptor');
        mockGetEventDescriptor.mockReturnValue(mockEventDescriptor);
    });
    function parserTest(src, plugins = ['typescript']) {
        return __awaiter(this, void 0, void 0, function* () {
            const ast = parse(src, plugins);
            yield (0, setupEventHandler_1.default)(documentation, stubNodePath, ast, options);
            return mockEventDescriptor;
        });
    }
    describe('JavaScript', () => {
        it('should resolve emit from defineEmits function: Array', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          const emit = defineEmits([
            /**
             * this is a test event
             */ 
            'test'
          ])
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('test');
            expect(event).toMatchObject({
                description: 'this is a test event',
                name: 'mockEvent'
            });
        }));
        it('should resolve emit from defineEmits function: Object', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          const emit = defineEmits({
            /**
             * no validation
             */
            test: null,
          })
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('test');
            expect(event).toMatchObject({
                description: 'no validation',
                name: 'mockEvent'
            });
        }));
        it('should resolve emit: Object with validation', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          const emit = defineEmits({
            /**
             * with validation
             */
            submit: payload => {
              if (payload.email && payload.password) {
                return true
              } else {
                console.warn('Invalid submit event payload!')
                return false
              }
            }
          })
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit');
            expect(event).toMatchObject({
                description: 'with validation',
                name: 'mockEvent'
            });
        }));
    });
    describe('TypeScript', () => {
        it('should resolve emit from defineEmits function types', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          const emit = defineEmits<{
            /**
             * Cancels everything
             */
            (event: 'cancel'): void
            /**
             * Save the world
             */
            (event: 'save'): void
          }>()
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('cancel');
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save');
            expect(event).toMatchObject({
                description: 'Save the world',
                name: 'mockEvent'
            });
        }));
        it('should resolve the types if they are local', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          interface EmitTypes {
            /**
             * Save the world
             */
            (event: 'save'): void
          }
          
          const emit = defineEmits<EmitTypes>()
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save');
            expect(event).toMatchObject({
                description: 'Save the world',
                name: 'mockEvent'
            });
        }));
        it('should deduce the type of event from the first arg', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          const emit = defineEmits<{
            (event: 'save', arg: number): void
          }>()
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save');
            expect(event).toMatchObject({
                type: { names: ['number'] }
            });
        }));
        it('should accept types that are complex', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
          interface Format{
            email: string
          }

          const emit = defineEmits<{
            /**
             * Save the world
             * @arg {{ email: string }} payload - The payload
             */
            (event: 'save', payload: Format): void
          }>()
          `;
            const event = yield parserTest(src);
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save');
            expect(event).toMatchObject({
                properties: [
                    {
                        description: 'The payload',
                        name: 'payload',
                        type: {
                            names: ['{ email: string }']
                        }
                    }
                ]
            });
        }));
    });
});
