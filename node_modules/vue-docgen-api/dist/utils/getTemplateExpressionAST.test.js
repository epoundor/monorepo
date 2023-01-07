"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTemplateExpressionAST_1 = __importDefault(require("./getTemplateExpressionAST"));
describe('getTemplateExpressionAST', () => {
    it('should parse expression successfully', () => {
        expect((0, getTemplateExpressionAST_1.default)('{[t]:bobo}')).toBeDefined();
    });
    it('should parse multiline successfully', () => {
        expect((0, getTemplateExpressionAST_1.default)('click()\nconsole.log()')).toBeDefined();
    });
    it('should parse single line successfully', () => {
        expect((0, getTemplateExpressionAST_1.default)('console.log()')).toBeDefined();
    });
});
