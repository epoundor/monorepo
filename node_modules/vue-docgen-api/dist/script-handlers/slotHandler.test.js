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
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const slotHandler_1 = __importDefault(require("./slotHandler"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['jsx'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('render function slotHandler', () => {
    let documentation;
    let mockSlotDescriptor;
    beforeEach(() => {
        mockSlotDescriptor = { name: 'mySlot', description: '' };
        documentation = new Documentation_1.default('dummy/path');
        const mockGetSlotDescriptor = vi.spyOn(documentation, 'getSlotDescriptor');
        mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor);
    });
    it('should not return anything if no render function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = 'export default {}';
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).not.toHaveBeenCalled();
    }));
    it('should find slots in render function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement('div', this.$slots.mySlot)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('mySlot');
    }));
    it('should find scoped slots in render function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement('div', [
          this.$scopedSlots.myScopedSlot({
            text: this.message
          })
        ])
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myScopedSlot');
    }));
    it('should find scoped slots in render object method', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render(createElement) {
        return createElement('div', [
          this.$scopedSlots.myOtherScopedSlot({
            text: this.message
          })
        ])
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myOtherScopedSlot');
    }));
    it('should be fine with scoped slots iand a spread parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render(h) {
		const stuff = {
            foo: 'foo',
            bar: 'bar',
        };
        return h('div', [
          this.$scopedSlots.myOtherScopedSlot({
            ...stuff
          })
        ])
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myOtherScopedSlot');
    }));
    it('should find slots in jsx render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render(createElement) {
        return (<div>, 
          <slot name="myMain"/>
        </div>)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myMain');
    }));
    it('should find default slots in jsx render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render(createElement) {
        return (<div> 
          <slot />
        </div>)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
    }));
    it('should allow describing slots in jsx render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render(createElement) {
        return (<div>
          {/** @slot Use this slot header */}
          <slot/>
        </div>)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('Use this slot header');
    }));
    it('should allow describing slots in render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement(
        	'div', 
        	/** @slot Use this slot header */
        	this.$slots.mySlot
        )
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('Use this slot header');
    }));
    it('should not allow describing slots using double //', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement(
        	'div', 
        	// @slot Use this slot header
        	this.$slots.mySlot
        )
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('');
    }));
    it('should not allow describing slots without @slot tag', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement(
        	'div', 
        	/* Use this slot header */
        	this.$slots.mySlot
        )
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('');
    }));
    it('should allow describing scopedSlots in render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
      export default {
        render(h) {
          return h('div', [
            /** @slot It is the default slot */
            this.$scopedSlots.default(),
           ]);
         },
      };
  `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('It is the default slot');
    }));
    it('should not fail if forEach is following usage of the slot', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
      export default {
        render(h) {
			if (this.$slots.default) {
				this.$slots.default.forEach(() => {
				  console.log('foo');
				})
			}
			return h('hr');
		}
      };
  `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
    }));
    it('should detect scopedSlots in renderless components', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
      export default {
        render () {
			/**
			 * @slot Use this slot carefully 
			 */
			return this.$scopedSlots.default({
			  /**
			   * contains true while compiling
			   */ 
			  compiling: this.compiling,
			  /**
			   * will render the compiled item
			   */ 
			  compile: this.compile
			})
		  }
      };
  `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor).toMatchInlineSnapshot(`
			{
			  "bindings": [
			    {
			      "description": "contains true while compiling",
			      "name": "compiling",
			      "title": "binding",
			    },
			    {
			      "description": "will render the compiled item",
			      "name": "compile",
			      "title": "binding",
			    },
			  ],
			  "description": "Use this slot carefully",
			  "name": "mySlot",
			}
		`);
    }));
    it('should allow describing scoped slots in render', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
      render: function (createElement) {
        return createElement('div', {}, [/** @slot Use this slot header */this.$scopedSlots.mySlot])
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(mockSlotDescriptor.description).toEqual('Use this slot header');
    }));
    it('should allow to assign slots to variables', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
export default {
	render(h) {
	  const pending = this.pending
	  if (pending && this.$scopedSlots.pending) {
		/** @slot the content for the pending state */ 
		const pendingSlot = this.$scopedSlots.pending()
		return safeSlot(h, pendingSlot)
	  }
	  const error = this.error
	  if (!pending && error && this.$scopedSlots.rejected) {
		/** @slot the content for the pending state */ 
		const rejectSlot = this.$scopedSlots.rejected(error)
		return safeSlot(h, rejectSlot)
	  }
	  const results = this.results === undefined ? this.default : this.results
	  if (!pending && this.$scopedSlots.resolved) {
		/** @slot the content for the pending state */ 
		const resolveSlot = this.$scopedSlots.resolved(results)
		return safeSlot(h, resolveSlot)
	  }
	  if (!this.$scopedSlots.default) return
	  /** @slot the content for the pending state */ 
	  const defaultSlot = this.$scopedSlots.default({
		pending,
		results,
		error
	  })
	  return safeSlot(h, defaultSlot)
	}
}
	  `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandler_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledTimes(8);
        expect(mockSlotDescriptor.description).toEqual('the content for the pending state');
    }));
    describe('tags', () => {
        it('should extract tags from the description block', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
	export default {
	  render(createElement) {
		return createElement('div', [
			/**
			 * @slot 
			 * @ignore
			 */
			this.$scopedSlots.default
		])
	  }
	}
	`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandler_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.tags).not.toBeUndefined();
            expect(mockSlotDescriptor.tags).toMatchInlineSnapshot(`
				{
				  "ignore": [
				    {
				      "description": true,
				      "title": "ignore",
				    },
				  ],
				}
			`);
        }));
    });
    describe('bindings', () => {
        it('should describe slots bindings in render functions', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
		export default {
		  render(createElement) {
			return createElement('div', [
				/** 
				 * @slot The header 
				 * @binding {object} menuItem the menu item
				 */
				this.$scopedSlots.default({
					menuItem: this.message
				})
			])
		  }
		}
		`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandler_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.bindings).toMatchObject([
                {
                    name: 'menuItem',
                    description: 'the menu item'
                }
            ]);
        }));
        it('should describe slots bindings in JSX', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
		export default {
		  render(createElement) {
			return (
			<div> 
			  {/** 
				* @slot The header 
				* @binding {object} item the menu item
				*/}
			  <slot item={menuItem} />
			</div>)
		  }
		}
		`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandler_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.bindings).toMatchObject([
                {
                    name: 'item',
                    description: 'the menu item'
                }
            ]);
        }));
    });
});
