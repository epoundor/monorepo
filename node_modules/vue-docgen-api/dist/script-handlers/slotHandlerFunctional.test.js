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
const slotHandlerFunctional_1 = __importDefault(require("./slotHandlerFunctional"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['jsx'] }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('functional render function slotHandler', () => {
    let documentation;
    let mockSlotDescriptor;
    beforeEach(() => {
        mockSlotDescriptor = { name: 'default', description: '' };
        documentation = new Documentation_1.default('dummy/path');
        const mockGetSlotDescriptor = vi.spyOn(documentation, 'getSlotDescriptor');
        mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor);
    });
    it('should find slots in functional render function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
	  functional: true,
      render: function (createElement, ctx) {
		/* @slot describe default slot */
        return createElement('div', ctx.data, ctx.children)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandlerFunctional_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
        expect(mockSlotDescriptor.description).toBe('describe default slot');
    }));
    it('should find children default slots in destructured render function params', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
    export default {
	  functional: true,
      render: function (createElement, { data, children:cld }) {
		/* @slot describe destructured default */
        return createElement('div', data, cld)
      }
    }
    `;
        const def = parse(src);
        if (def) {
            yield (0, slotHandlerFunctional_1.default)(documentation, def);
        }
        expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default');
        expect(mockSlotDescriptor.description).toBe('describe destructured default');
    }));
    it('should parse functional components without context', () => {
        const src = `
    export default {
	  functional: true,
      render: function (createElement) {
        return createElement('div', {}, 'hello world')
      }
    }
    `;
        const def = parse(src);
        if (def) {
            expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, slotHandlerFunctional_1.default)(documentation, def);
            })).not.toThrow();
        }
        else {
            throw Error('fail');
        }
    });
});
