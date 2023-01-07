"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const displayNameHandler_1 = __importDefault(require("./displayNameHandler"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)().parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0].get('default');
}
describe('displayNameHandler', () => {
    let documentation;
    beforeEach(() => {
        documentation = new Documentation_1.default('dummy/path');
        vi.spyOn(documentation, 'set');
    });
    it('should return the right component name', () => {
        const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      }
    }
    `;
        const def = parse(src);
        if (def) {
            (0, displayNameHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123');
    });
    it('should return the right component name as a constant', () => {
        const src = `
    const NAME = 'name-123';
    export default {
      name: NAME,
      components: {
        testComp: {}
      }
    }
    `;
        const def = parse(src);
        if (def) {
            (0, displayNameHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123');
    });
    it('should return the right component name as a constant when it is exported', () => {
        const src = `
    export const NAME = 'name-123';
    export default {
      name: NAME,
      components: {
        testComp: {}
      }
    }
    `;
        const def = parse(src);
        if (def) {
            (0, displayNameHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123');
    });
});
