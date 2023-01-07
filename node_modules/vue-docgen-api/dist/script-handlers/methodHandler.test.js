"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const methodHandler_1 = __importDefault(require("./methodHandler"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['flow'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
function parseTS(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('methodHandler', () => {
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
        const def = parse(src);
        if (def) {
            (0, methodHandler_1.default)(documentation, def).catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
            });
        }
    }
    it('should ignore every method not tagged as @public', () => {
        const src = `
    export default {
      name: 'name-123',
      methods:{
        testIgnore(){
          return 1;
        }
      }
    }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: ''
        });
    });
    it('should return every methods not tagged as @public but in the "expose" option', () => {
        const src = `
    export default {
      expose: ['testExpose'],
      name: 'name-123',
      methods:{
        testExpose(){
          return 1;
        }
      }
    }`;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'testExpose'
        });
    });
    describe('formats', () => {
        it('should return the method if it is an anonymous function', () => {
            const src = `
    export default {
      methods: {
        /**
         * @public
         */
        testFunction: function(){
          return 1;
        }
      }
    }
    `;
            tester(src);
            expect(mockMethodDescriptor).toMatchObject({
                name: 'testFunction'
            });
        });
        it('should return the method if it is an object method', () => {
            const src = `
        export default {
          methods: {
            /**
             * @public
             */
            testMethod(){
              return 1;
            }
          }
        }
        `;
            tester(src);
            expect(mockMethodDescriptor).toMatchObject({
                name: 'testMethod'
            });
        });
        it('should return the method if it is an arrow function', () => {
            const src = `
      export default {
        methods: {
          /**
           * @public
           */
          testArrowFunction: () => {
            return 'test';
          },
        }
      }
      `;
            tester(src);
            expect(mockMethodDescriptor).toMatchObject({
                name: 'testArrowFunction'
            });
        });
        it('should return the method if it is a returned function', () => {
            const src = `
      export default {
        methods: {
          /**
           * @public
           */
          testHighFunction: waitFor('thingToWait', () => {
            return 'test';
          }),
        }
      }
      `;
            tester(src);
            expect(mockMethodDescriptor).toMatchObject({
                name: 'testHighFunction'
            });
        });
    });
    it('should return their parameters', () => {
        const src = `
    export default {
      methods: {
        /**
         * @public
         */
        testWithMultipleParams(param1, param2){
          return param2 + param1;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'testWithMultipleParams',
            params: [{ name: 'param1' }, { name: 'param2' }]
        });
    });
    it('should detect parameters even when es6 defaulted', () => {
        const src = `
    export default {
      methods: {
        /**
         * @public
         */
        testWithMultipleParamsDefaulted(param1, param2 = 3){
          return param2 + param1;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'testWithMultipleParamsDefaulted',
            params: [{ name: 'param1' }, { name: 'param2' }]
        });
    });
    it('should allow description of methods', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * it returns 2
         * @public
         */
        describedFunc(){
          return 2;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedFunc',
            description: 'it returns 2'
        });
    });
    it('should allow description of params', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} p2 - multiplier
         */
        describedParams(p1, p2){
          return p2 * 2;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedParams',
            params: [{ name: 'p1' }, { name: 'p2', description: 'multiplier', type: { name: 'string' } }]
        });
    });
    it('should allow description of args', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @arg {string} p2 - multiplier
         */
        describedParams(p1, p2){
          return p2 * 2;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedParams',
            params: [{ name: 'p1' }, { name: 'p2', description: 'multiplier', type: { name: 'string' } }]
        });
    });
    it('should allow description of arguments', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @argument {string} p2 - multiplier
         */
        describedParams(p1, p2){
          return p2 * 2;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedParams',
            params: [{ name: 'p1' }, { name: 'p2', description: 'multiplier', type: { name: 'string' } }]
        });
    });
    it('should allow description of params even if they are implicit', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} - unnamed param
         * @param {number} - another unnamed param
         */
        describedParams(){
          return arguments;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedParams',
            params: [
                { description: 'unnamed param', type: { name: 'string' } },
                { description: 'another unnamed param', type: { name: 'number' } }
            ]
        });
    });
    it('should allow description of params without naming them', () => {
        const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} - unnamed param
         * @param {number} - another unnamed param
         */
        describedParams(p, p2){
          return p * 2;
        }
      }
    }
    `;
        tester(src);
        expect(mockMethodDescriptor).toMatchObject({
            name: 'describedParams',
            params: [
                { name: 'p', description: 'unnamed param', type: { name: 'string' } },
                { name: 'p2', description: 'another unnamed param', type: { name: 'number' } }
            ]
        });
    });
    describe('flow', () => {
        it('should deduce the type of params from the param type', () => {
            const src = [
                '/* @flow */',
                'export default {',
                '  methods:{',
                '    /**',
                '     * @public',
                '     */',
                '    publicMethod(param: string, paramObscure: ObscureInterface) {',
                '      console.log("test", paramObscure)',
                '    }',
                '  }',
                '}'
            ].join('\n');
            const def = parse(src);
            if (def) {
                (0, methodHandler_1.default)(documentation, def);
            }
            expect(mockMethodDescriptor).toMatchObject({
                name: 'publicMethod',
                params: [
                    { name: 'param', type: { name: 'string' } },
                    { name: 'paramObscure', type: { name: 'ObscureInterface' } }
                ]
            });
        });
        it('should deduce the return type from method', () => {
            const src = [
                '/* @flow */',
                'export default {',
                '  methods:{',
                '    /**',
                '     * @public',
                '     */',
                '    publicMethod(): string {',
                '      console.log("test")',
                '    }',
                '  }',
                '}'
            ].join('\n');
            const def = parse(src);
            if (def) {
                (0, methodHandler_1.default)(documentation, def);
            }
            expect(mockMethodDescriptor).toMatchObject({
                name: 'publicMethod',
                returns: { type: { name: 'string' } }
            });
        });
    });
    describe('typescript', () => {
        it('should deduce the type of params from the param type', () => {
            const src = `
      export default {
        methods:{
          /**
           * @public
           */
          publicMethod(param: string, paramObscure: ObscureInterface) {
            console.log('test', test, param)
          }
        }
      }
      `;
            const def = parse(src);
            if (def) {
                (0, methodHandler_1.default)(documentation, def);
            }
            expect(mockMethodDescriptor).toMatchObject({
                name: 'publicMethod',
                params: [
                    { name: 'param', type: { name: 'string' } },
                    { name: 'paramObscure', type: { name: 'ObscureInterface' } }
                ]
            });
        });
        it('should deduce the return type from method decoration', () => {
            const src = `
      export default {
        methods: {
          /**
           * @public
           */
          twoMethod: (): number => {
            return 2;
          }
        }
      };
      `;
            const def = parseTS(src);
            if (def) {
                (0, methodHandler_1.default)(documentation, def);
            }
            expect(mockMethodDescriptor).toMatchObject({
                name: 'twoMethod',
                returns: { type: { name: 'number' } }
            });
        });
    });
});
