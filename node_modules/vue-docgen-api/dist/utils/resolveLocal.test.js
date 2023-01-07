"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolveLocal_1 = __importDefault(require("./resolveLocal"));
const babel_parser_1 = __importDefault(require("../babel-parser"));
describe('resolveLocal', () => {
    it('should resolve a variable local', () => {
        const ast = (0, babel_parser_1.default)().parse(`
		const mixin = {
			props: 'hello'
		}
		`);
        expect((0, resolveLocal_1.default)(ast, ['mixin']).keys()).toEqual(['mixin']);
    });
    it('should resolve a variable local exported', () => {
        const ast = (0, babel_parser_1.default)().parse(`
		export const mixin = {
			props: 'hello'
		}
		`);
        expect((0, resolveLocal_1.default)(ast, ['mixin']).keys()).toEqual(['mixin']);
    });
    it('should have pre-comment loaded', () => {
        var _a;
        const ast = (0, babel_parser_1.default)().parse(`
		/**
		 * Describe the current mixin
		 */
		const mixin = {
			props: 'hello'
		}
		`);
        const node = (_a = (0, resolveLocal_1.default)(ast, ['mixin']).get('mixin')) === null || _a === void 0 ? void 0 : _a.parent.parent.node;
        expect(node.leadingComments).toMatchObject([
            {
                type: 'CommentBlock',
                value: '*\n\t\t * Describe the current mixin\n\t\t '
            }
        ]);
    });
});
