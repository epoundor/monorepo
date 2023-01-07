"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recast_1 = require("recast");
const babel_parser_1 = __importDefault(require("../babel-parser"));
const getDocblock_1 = __importDefault(require("./getDocblock"));
describe('getDocblock', () => {
    it('should resolve imported variables', () => {
        const ast = (0, babel_parser_1.default)().parse([
            '',
            '/**',
            ' * tested comment',
            ' * tested description',
            ' */',
            'var testedVariable = 8;',
            ''
        ].join('\n'));
        const varPath = getFirstVariablePath(ast);
        const docblock = (0, getDocblock_1.default)(varPath);
        expect(docblock).toEqual(['tested comment', 'tested description'].join('\n'));
    });
});
function getFirstVariablePath(ast) {
    const varPath = [];
    (0, recast_1.visit)(ast.program, {
        visitVariableDeclaration: (a) => {
            varPath.push(a);
            return false;
        }
    });
    return varPath[0];
}
