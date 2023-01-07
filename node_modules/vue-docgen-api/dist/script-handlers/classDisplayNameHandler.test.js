"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const classDisplayNameHandler_1 = __importDefault(require("./classDisplayNameHandler"));
vitest_1.vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)().parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0];
}
describe('classDisplayNameHandler', () => {
    let documentation;
    beforeEach(() => {
        documentation = new Documentation_1.default('dummy/path');
        vitest_1.vi.spyOn(documentation, 'set');
    });
    it('should extract the name of the component from the classname', () => {
        const src = `
    @Component
    export default class Decorum extends Vue{
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, classDisplayNameHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'Decorum');
    });
    it('should extract the name of the component from the decorators', () => {
        const src = `
    @Component({name: 'decorum'})
    export default class Test extends Vue{
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, classDisplayNameHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'decorum');
    });
});
