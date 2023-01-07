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
const slotHandlerLiteral_1 = __importDefault(require("./slotHandlerLiteral"));
const Documentation_1 = __importDefault(require("../Documentation"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['jsx'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('render and setup function slotHandler', () => {
    let documentation;
    let mockSlotDescriptor;
    beforeEach(() => {
        mockSlotDescriptor = { name: 'default', description: '' };
        documentation = new Documentation_1.default('dummy/path');
        const mockGetSlotDescriptor = vi.spyOn(documentation, 'getSlotDescriptor');
        mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor);
    });
    describe('render functions', () => {
        it('should provide an escape hatch for unexpected slots', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot icon
   */
  render() {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('icon');
        }));
        it('should allow for multiple slots', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot one
   */
  /**
   * @slot two
   */
  render: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('one');
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('two');
        }));
        it('should use default is no name is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   */
  render: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
        }));
        it('should describe slot using the description', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   * describe the default slot
   */
  render: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.description).toBe('describe the default slot');
        }));
        it('should allow binding description', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  render: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.bindings).toMatchObject([{ name: 'index' }, { name: 'content' }]);
        }));
    });
    describe('setup functions', () => {
        it('should provide an escape hatch for unexpected slots', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot icon
   */
  setup() {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('icon');
        }));
        it('should allow for multiple slots', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot one
   */
  /**
   * @slot two
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('one');
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('two');
        }));
        it('should use default is no name is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
        }));
        it('should describe slot using the description', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   * describe the default slot
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.description).toBe('describe the default slot');
        }));
        it('should allow binding description', () => __awaiter(void 0, void 0, void 0, function* () {
            const src = `
export default {
  /**
   * @slot
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`;
            const def = parse(src);
            if (def) {
                yield (0, slotHandlerLiteral_1.default)(documentation, def);
            }
            expect(mockSlotDescriptor.bindings).toMatchObject([{ name: 'index' }, { name: 'content' }]);
        }));
    });
});
