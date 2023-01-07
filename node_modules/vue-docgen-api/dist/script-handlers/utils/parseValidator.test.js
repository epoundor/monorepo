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
const recast_1 = require("recast");
const parseValidator_1 = __importDefault(require("./parseValidator"));
const babel_parser_1 = __importDefault(require("../../babel-parser"));
const parser = (0, babel_parser_1.default)({ plugins: ['jsx'] });
function getValidator(src) {
    const ast = parser.parse(`var a = {${src}}`);
    return ast.program.body[0].declarations[0].init.properties[0].value;
}
describe('parseValidatorForValues', () => {
    let ast;
    beforeAll(() => {
        ast = (0, recast_1.parse)('const a  = 1');
    });
    it('should allow indexOf > -1', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) > -1`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow -1 < indexOf', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => -1 < ['sm', 'md', 'lg'].indexOf(a)`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow indexOf !== -1', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) !== -1`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow -1 !== indexOf', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => -1 !== ['sm', 'md', 'lg'].indexOf(a)`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow indexOf != -1', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) != -1`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow -1 != indexOf', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => -1 != ['sm', 'md', 'lg'].indexOf(a)`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should allow use of includes', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].includes(a)`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'md', 'lg']);
    }));
    it('should not fail if a member of the array is an object', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: a => ['sm', {foo:'bar'}, 'lg'].includes(a)`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toEqual(['sm', 'lg']);
    }));
    it('should simply ignore references to functions', () => __awaiter(void 0, void 0, void 0, function* () {
        const validator = getValidator(`validator: isItAnEvenNumber`);
        expect(yield (0, parseValidator_1.default)(validator, ast, { filePath: '', validExtends: () => true })).toBeUndefined();
    }));
});
