"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsUtils_1 = require("./tsUtils");
const babel_parser_1 = __importDefault(require("../../babel-parser"));
describe('getTypeDefinitionFromIdentifier', () => {
    it('resolves an interface in the global scope', () => {
        var _a;
        const parser = (0, babel_parser_1.default)({ plugins: ['typescript'] });
        expect((_a = (0, tsUtils_1.getTypeDefinitionFromIdentifier)(parser.parse(`
    interface Foo{

    }`), 'Foo')) === null || _a === void 0 ? void 0 : _a.node.loc).toBeDefined();
    });
});
