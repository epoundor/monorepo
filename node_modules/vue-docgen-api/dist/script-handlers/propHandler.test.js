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
const dedent_1 = __importDefault(require("dedent"));
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const propHandler_1 = __importDefault(require("./propHandler"));
// vi.mock('../Documentation')
function removeWhitespaceForTest(defaultValue = { value: '' }) {
    return {
        func: defaultValue.func,
        value: defaultValue.value.replace(/\s|\n|\t/g, '')
    };
}
function parse(src, plugins) {
    const ast = (0, babel_parser_1.default)({ plugins }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('propHandler', () => {
    let documentation;
    let mockPropDescriptor;
    let defaultAST;
    const options = { filePath: '', validExtends: () => true };
    beforeAll(() => {
        defaultAST = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse('const a  = 1');
    });
    beforeEach(() => {
        mockPropDescriptor = {
            description: '',
            tags: {},
            name: ''
        };
        documentation = new Documentation_1.default('test/path');
        const mockGetPropDescriptor = vi.spyOn(documentation, 'getPropDescriptor');
        mockGetPropDescriptor.mockReturnValue(mockPropDescriptor);
    });
    function parserTest(src, plugins, ast = defaultAST) {
        return __awaiter(this, void 0, void 0, function* () {
            const def = parse(src, plugins);
            if (def) {
                yield (0, propHandler_1.default)(documentation, def, ast, options);
            }
            return mockPropDescriptor;
        });
    }
    describe('base', () => {
        it('should accept an array of string as props', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: ['testArray']
        }`;
            const def = parse(src);
            if (def) {
                yield (0, propHandler_1.default)(documentation, def, defaultAST, options);
            }
            (0, vitest_1.expect)(mockPropDescriptor.required).toBeFalsy();
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('testArray');
        }));
    });
    describe('type', () => {
        it('should return the right props type', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              type: Array
            }
          }
        }
		`;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'array' }
            });
        }));
        it('should return the right props type for lit Array', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            columns: [Array]
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'array' }
            });
        }));
        it('should return the right props composite type', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: {
              type: [String, Number]
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'string|number' }
            });
        }));
        it('should return the right props type for Array', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: Array
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'array' }
            });
        }));
        it('should not return required if prop only Type', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: String
          }
        }
        `;
            const def = parse(src);
            if (def) {
                (0, propHandler_1.default)(documentation, def, defaultAST, options);
            }
            (0, vitest_1.expect)(mockPropDescriptor.required).toBeUndefined();
        }));
        it('should return the right props type string', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: String
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'string' }
            });
        }));
        it('should return the right props composite string|number', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: [String, Number]
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'string|number' }
            });
        }));
        it('should deduce the prop type from the default value', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test:{
              default: false
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: { name: 'boolean' }
            });
        }));
        it('should still return props with vue-types', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: VueTypes.shape({
              line1: String,
              line2: String,
            })
          }
        }
      `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: {
                    func: true
                }
            });
        }));
        it('should still return props with prop-types', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
				  export default {
            props: {
				      test: PropTypes.oneOf(['News', 'Photos']),
				    }
          }`;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: {
                    func: true
                }
            });
        }));
        it('should still return props with delegated types', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = ['export default {', '  props: {', '    toto', '  }', '}'].join('\n');
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: {}
            });
        }));
    });
    describe('required', () => {
        it('should return the right required props', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              required: true
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                required: true
            });
        }));
    });
    describe('defaultValue', () => {
        it('should be ok with just the default', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: {
              default: 'normal'
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                defaultValue: { value: `"normal"` }
            });
        }));
        it('should be ok with the default as a method', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
				export default {
				  props: {
				    test: {
				      default() {
				        return ["normal"]
				      }
				    }
				  }
				}
      `;
            (0, vitest_1.expect)((yield parserTest(src)).defaultValue).toMatchInlineSnapshot(`
				{
				  "func": true,
				  "value": "function() {
				    return [\\"normal\\"];
				}",
				}
			`);
        }));
        it('should deal properly with multiple returns', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: {
              type: Array,
              default: function () {
                if (logger.mounted) {
                  return []
                } else {
                  return undefined
                }
              }
            }
          }
        }
        `;
            const testParsed = yield parserTest(src);
            const defaultValue = removeWhitespaceForTest(testParsed.defaultValue);
            (0, vitest_1.expect)(defaultValue).toMatchObject({
                func: true,
                value: `function(){if(logger.mounted){return[];}else{returnundefined;}}`
            });
        }));
        it('should deal properly with multiple returns in arrow functions', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: {
              type: Array,
              default: () => {
                if (logger.mounted) {
                  return []
                } else {
                  return undefined
                }
              }
            }
          }
        }
        `;
            const testParsed = yield parserTest(src);
            const defaultValue = removeWhitespaceForTest(testParsed.defaultValue);
            (0, vitest_1.expect)(defaultValue).toMatchObject({
                func: true,
                value: `()=>{if(logger.mounted){return[];}else{returnundefined;}}`
            });
        }));
        it('should not have parenthesis', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            test: {
              type: Object,
              default: () => ({ a: 1 })
            }
          }
        }`;
            const testParsed = yield parserTest(src);
            const defaultValue = removeWhitespaceForTest(testParsed.defaultValue);
            (0, vitest_1.expect)(defaultValue).toMatchObject({ value: '{a:1}' });
        }));
        // type, format of default input, result of parsing
        vitest_1.test.each([
            ['Object', 'default: () => ({ a: 1 })', '{a:1}', ''],
            ['Object', 'default: () => { return { a: 1 } }', '{a:1}', ''],
            ['Object', 'default () { return { a: 1 } }', '{a:1}', ''],
            ['Object', 'default: function () { return { a: 1 } }', '{a:1}', ''],
            ['Object', 'default: () => ({ a: 1 })', '{a:1}', '{{a: number}}'],
            ['Object', 'default: null', 'null', ''],
            ['Object', 'default: undefined', 'undefined', ''],
            ['Array', 'default: () => ([{a: 1}])', '[{a:1}]', ''],
            ['Array', 'default: () => [{a: 1}]', '[{a:1}]', ''],
            ['Array', 'default: () => { return [{a: 1}] }', '[{a:1}]', ''],
            ['Array', 'default () { return [{a: 1}] }', '[{a:1}]', ''],
            ['Array', 'default: function () { return [{a: 1}] }', '[{a:1}]', ''],
            ['Array', 'default: null', 'null', ''],
            ['Array', 'default: undefined', 'undefined', ''],
            ['Function', 'default: (a, b) => ({ a, b })', '(a,b)=>({a,b})', ''],
            ['Function', 'default (a, b) { return { a, b } }', 'function(a,b){return{a,b};}', ''],
            ['Function', 'default: (a, b) => { return { a, b } }', '(a,b)=>{return{a,b};}', ''],
            [
                'Function',
                'default: function (a, b) { return { a, b } }',
                'function(a,b){return{a,b};}',
                ''
            ]
        ])('if prop is of type %s, given %s as default, should parse as %s, comment types are %s', (propType, input, output, commentsBlockType) => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
                export default {
                  props: {
                    /**
                     * ${commentsBlockType.length ? `@type ${commentsBlockType}` : ''}
                     */
                    test: {
                      type: ${propType},
                      ${input}
                    }
                  }
                }
                `;
            const testParsed = yield parserTest(src);
            const defaultValue = removeWhitespaceForTest(testParsed.defaultValue);
            (0, vitest_1.expect)(defaultValue).toMatchObject({ value: output });
        }));
    });
    describe('description', () => {
        it('should return the right description', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            /**
             * test description
             */
            test: {
              required: true
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'test description'
            });
        }));
    });
    describe('v-model', () => {
        it('should set the @model property as v-model instead of test', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            /**
             * test description
             * @model
             */
            test: String
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'test description'
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).not.toHaveBeenCalledWith('test');
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model');
        }));
        it('should set the @model property as v-model instead of value even with a type', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            /**
             * Binding from v-model
             * @model
             */
            value: {
              required: true,
              type: undefined
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'Binding from v-model'
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).not.toHaveBeenCalledWith('value');
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model');
        }));
        it('should set the v-model instead of value with model property', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          model:{
            prop: 'value'
          },
          props: {
            /**
             * Value of the field
             */
            value: {
              required: true,
              type: undefined
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'Value of the field'
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).not.toHaveBeenCalledWith('value');
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model');
        }));
        it('should not set the v-model instead of value if model property has only event', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          model:{
            event: 'change'
          },
          props: {
            /**
             * Value of the field
             */
            value: {
              required: true,
              type: undefined
            }
          }
        }
        `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'Value of the field'
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).not.toHaveBeenCalledWith('v-model');
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('value');
        }));
    });
    describe('@values tag parsing', () => {
        it('should parse the @values tag as its own', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
          export default {
            props: {
                /**
                 * color of the component
                 * @values dark, light
                 * @values red, blue
                 * @author me
                 */
                color: {
                    type: String
                }
            }
          }
          `;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                description: 'color of the component',
                values: ['dark', 'light', 'red', 'blue'],
                tags: {
                    author: [
                        {
                            description: 'me',
                            title: 'author'
                        }
                    ]
                }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('color');
        }));
        it('should check the validator method for super standard values', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            color: {
              type: String,
              validator(va){
                return ['dark', 'light', 'red', 'blue'].indexOf(va) > -1
              }
            }
          }
        }
        `;
            (0, vitest_1.expect)((yield parserTest(src)).values).toMatchObject(['dark', 'light', 'red', 'blue']);
        }));
        it('should check the validator method for super standard values with the diff signs', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            color: {
            type: String,
              validator(va){
                return ['dark', 'light', 'red', 'blue'].indexOf(va) !== -1
              }
            }
          }
        }
      `;
            (0, vitest_1.expect)((yield parserTest(src)).values).toMatchObject(['dark', 'light', 'red', 'blue']);
        }));
        it('should check the validator function for super standard values with the diff signs', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
              color: {
                type: String,
                validator: function(va){
                  return ['dark', 'light', 'red', 'blue'].indexOf(va) !== -1
                }
              }
          }
        }
        `;
            (0, vitest_1.expect)((yield parserTest(src)).values).toMatchObject(['dark', 'light', 'red', 'blue']);
        }));
        it('should check the validator arrow function for inline values', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
          export default {
            props: {
              color: {
                type: String,
                validator: (va) =>
                  ['dark', 'light', 'red', 'blue'].indexOf(va) > -1
                }
              }
            }
          `;
            (0, vitest_1.expect)((yield parserTest(src)).values).toMatchObject(['dark', 'light', 'red', 'blue']);
        }));
        it('should check the validator method for identifiers', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
          const array = ['dark', 'light', 'red', 'blue']
          export default {
            props: {
              color: {
                type: String,
                validator(va){
                  return array.indexOf(va) > -1
                }
              }
            }
          }
          `;
            (0, vitest_1.expect)((yield parserTest(src, undefined, (0, babel_parser_1.default)().parse(src))).values).toMatchObject([
                'dark',
                'light',
                'red',
                'blue'
            ]);
        }));
    });
    describe('typescript Vue.extends', () => {
        it('should be ok with Prop', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default Vue.extend({
        props: {
          tsvalue: {
            type: [String, Number] as Prop<SelectOption['value']>,
            required: true
          }
        }
        });`;
            (0, vitest_1.expect)(yield parserTest(src, ['typescript'])).toMatchObject({
                type: {
                    name: 'SelectOption["value"]'
                },
                required: true
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('tsvalue');
        }));
        it('should parse values in TypeScript typings', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default Vue.extend({
          props: {
            tsvalue: String as Prop<('foo' | 'bar')>,
          }
        });`;
            (0, vitest_1.expect)(yield parserTest(src, ['typescript'])).toMatchObject({
                values: ['foo', 'bar'],
                type: {
                    name: 'string'
                }
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('tsvalue');
        }));
        it('should parse values in TypeScript typings with complete object', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default Vue.extend({
        props: {
          tsvalue: {
          	type: String as Prop<('foo' | 'bar')>,
        	  required: true
          }
        }
        });`;
            (0, vitest_1.expect)(yield parserTest(src, ['typescript'])).toMatchObject({
                values: ['foo', 'bar'],
                type: {
                    name: 'string'
                },
                required: true
            });
            (0, vitest_1.expect)(documentation.getPropDescriptor).toHaveBeenCalledWith('tsvalue');
        }));
        it('should understand As annotations at the end of a prop definition', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default Vue.extend({
          props: {
            blockData: {
              type: Array,
              default: () => [],
            } as PropOptions<SocialNetwork[]>,
          }
        });`;
            (0, vitest_1.expect)(yield parserTest(src, ['typescript'])).toMatchObject({
                type: {
                    name: 'SocialNetwork[]'
                },
                defaultValue: {
                    func: true,
                    value: '() => []'
                }
            });
        }));
        it('should understand "as const" in prop default values', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default Vue.extend({
          props: {
            backgroundSize: {
              default: "cover" as const,
              type: String as PropType<"contain" | "cover">,
            },
          }
        });`;
            (0, vitest_1.expect)(yield parserTest(src, ['typescript'])).toMatchObject({
                defaultValue: {
                    value: '"cover"'
                }
            });
        }));
    });
    describe('@type', () => {
        it('should use @type typings', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            /**
             * @type {{ bar: number, foo: string }}
             */
            blockData: {
              type: Object,
              default: () => {},
            },
          }
        };`;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                type: {
                    name: '{ bar: number, foo: string }'
                }
            });
        }));
        it('should extract values from @type typings', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = (0, dedent_1.default) `
        export default {
          props: {
            /**
             * @type { "bar + boo" | "foo & baz" }}
             */
            blockData: {
              type: String,
              default: () => {},
            },
          }
        };`;
            (0, vitest_1.expect)(yield parserTest(src)).toMatchObject({
                values: ['bar + boo', 'foo & baz'],
                type: {
                    name: 'string'
                }
            });
        }));
    });
});
