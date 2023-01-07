"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const resolveRequired_1 = __importDefault(require("./resolveRequired"));
describe('resolveRequired', () => {
    it('should resolve imported variables', () => {
        const ast = (0, babel_parser_1.default)().parse('import {test, bonjour} from "test/path";');
        const varNames = (0, resolveRequired_1.default)(ast);
        expect(varNames).toMatchObject({
            test: { filePath: ['test/path'], exportName: 'test' },
            bonjour: { filePath: ['test/path'], exportName: 'bonjour' }
        });
    });
    it('should resolve imported default', () => {
        const ast = (0, babel_parser_1.default)().parse('import bonjour from "test/path";');
        const varNames = (0, resolveRequired_1.default)(ast);
        expect(varNames).toMatchObject({
            bonjour: { filePath: ['test/path'], exportName: 'default' }
        });
    });
    it('should resolve imported variable as another name', () => {
        const ast = (0, babel_parser_1.default)().parse('import {bonjour as hello} from "test/path";');
        const varNames = (0, resolveRequired_1.default)(ast);
        expect(varNames).toMatchObject({
            hello: { filePath: ['test/path'], exportName: 'bonjour' }
        });
    });
    it('should resolve required variables', () => {
        const ast = (0, babel_parser_1.default)().parse([
            'const hello = require("test/pathEN");',
            'const { bonjour } = require("test/pathFR");',
            ''
        ].join('\n'));
        expect((0, resolveRequired_1.default)(ast)).toMatchObject({
            hello: { filePath: ['test/pathEN'], exportName: 'default' },
            bonjour: { filePath: ['test/pathFR'], exportName: 'default' }
        });
    });
    it('should require even default', () => {
        const ast = (0, babel_parser_1.default)().parse([
            'const { ciao, astaruego } = require("test/pathOther");',
            'const sayonara = require("test/pathJP").default;',
            ''
        ].join('\n'));
        expect((0, resolveRequired_1.default)(ast)).toMatchObject({
            ciao: { filePath: ['test/pathOther'], exportName: 'default' },
            astaruego: { filePath: ['test/pathOther'], exportName: 'default' },
            sayonara: { filePath: ['test/pathJP'], exportName: 'default' }
        });
    });
    it('should not return non required variables', () => {
        const ast = (0, babel_parser_1.default)().parse('const sayonara = "Japanese Hello";');
        expect((0, resolveRequired_1.default)(ast).sayonara).toBeUndefined();
    });
});
