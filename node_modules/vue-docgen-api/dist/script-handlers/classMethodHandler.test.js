"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const classMethodHandler_1 = __importDefault(require("./classMethodHandler"));
vi.mock('../../Documentation');
function parseTS(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0];
}
describe('classPropHandler', () => {
    let documentation;
    let mockMethodDescriptor;
    beforeEach(() => {
        mockMethodDescriptor = { name: '', description: '', modifiers: [] };
        const MockDocumentation = Documentation_1.default;
        documentation = new MockDocumentation('test/path');
        const mockGetMethodDescriptor = vi.spyOn(documentation, 'getMethodDescriptor');
        mockGetMethodDescriptor.mockImplementation((name) => {
            mockMethodDescriptor.name = name;
            return mockMethodDescriptor;
        });
    });
    function tester(src) {
        const def = parseTS(src).get('default');
        if (def) {
            (0, classMethodHandler_1.default)(documentation, def);
        }
    }
    it('should detect public methods', () => {
        const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(){

          }
        }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({ name: 'myMethod' });
    });
    it('should detect public methods params', () => {
        const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1){

          }
        }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({ name: 'myMethod', params: [{ name: 'param1' }] });
    });
    it('should detect public methods params with default values', () => {
        const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1 = 2){

          }
        }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({ name: 'myMethod', params: [{ name: 'param1' }] });
    });
    it('should detect public methods params types', () => {
        const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1: string){

          }
        }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'myMethod',
            params: [{ name: 'param1', type: { name: 'string' } }]
        });
    });
    it('should detect public methods return types', () => {
        const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(): number{
            return 1;
          }
        }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'myMethod',
            returns: { type: { name: 'number' } }
        });
    });
});
