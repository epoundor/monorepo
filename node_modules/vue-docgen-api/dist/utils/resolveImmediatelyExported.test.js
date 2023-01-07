"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const resolveImmediatelyExported_1 = __importDefault(require("./resolveImmediatelyExported"));
describe('resolveImmediatelyExported', () => {
    it('should immediately exported varibles', () => {
        const ast = (0, babel_parser_1.default)().parse('export { test } from "test/path";');
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['test']);
        expect(varNames).toMatchObject({
            test: { filePath: ['test/path'], exportName: 'test' }
        });
    });
    it('should immediately exported varibles with aliases', () => {
        const ast = (0, babel_parser_1.default)().parse('export { test as changedName } from "test/path";');
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['changedName']);
        expect(varNames).toMatchObject({
            changedName: { filePath: ['test/path'], exportName: 'test' }
        });
    });
    it('should resolve immediately exported varibles in two steps', () => {
        const ast = (0, babel_parser_1.default)().parse([
            'import { test as middleName } from "test/path";',
            'export { middleName as changedName };'
        ].join('\n'));
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['changedName']);
        expect(varNames).toMatchObject({
            changedName: { filePath: ['test/path'], exportName: 'test' }
        });
    });
    it('should return immediately exported varibles in two steps with default import', () => {
        const ast = (0, babel_parser_1.default)().parse(['import test from "test/path";', 'export { test as changedName };'].join('\n'));
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['changedName']);
        expect(varNames).toMatchObject({
            changedName: { filePath: ['test/path'], exportName: 'default' }
        });
    });
    it('should return immediately exported varibles in two steps with default export', () => {
        const ast = (0, babel_parser_1.default)().parse(['import { test } from "test/path";', 'export default test;'].join('\n'));
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['default']);
        expect(varNames).toMatchObject({
            default: { filePath: ['test/path'], exportName: 'test' }
        });
    });
    it('should resolve export all as all remaining variables', () => {
        const ast = (0, babel_parser_1.default)().parse([
            'export foo from "file/path"',
            'export * from "test/path";'
        ].join('\n'));
        const varNames = (0, resolveImmediatelyExported_1.default)(ast, ['foo', 'baz']);
        expect(varNames).toMatchObject({
            foo: { filePath: ['file/path'], exportName: 'foo' },
            baz: { filePath: ['test/path'], exportName: 'baz' }
        });
    });
});
