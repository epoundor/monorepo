"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTypeFromAnnotation_1 = __importDefault(require("./getTypeFromAnnotation"));
const babel_parser_1 = __importDefault(require("../babel-parser"));
function parse(src) {
    return (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse(src);
}
function getAnnotation(code) {
    const ast = parse(`const a:${code};`);
    return ast.program.body[0].declarations[0].id.typeAnnotation;
}
describe('getTypeFromAnnotation', () => {
    it('should extract type string', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('string'))).toMatchInlineSnapshot(`
			{
			  "name": "string",
			}
		`);
    });
    it('should extract type array', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('string[]'))).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "name": "string",
			    },
			  ],
			  "name": "Array",
			}
		`);
    });
    it('should extract identified type', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('MetaType'))).toMatchInlineSnapshot(`
			{
			  "name": "MetaType",
			}
		`);
    });
    it('should extract composed type', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('MetaType<string>'))).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "name": "string",
			    },
			  ],
			  "name": "MetaType",
			}
		`);
    });
    it('should extract explicit Array type', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('Array<Book>'))).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "name": "Book",
			    },
			  ],
			  "name": "Array",
			}
		`);
    });
    it('should extract union type', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('"string literal" | 3 | Book | string[] | number[] | Book[] | Array<Book>'))).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "name": "\\"string literal\\"",
			    },
			    {
			      "name": "3",
			    },
			    {
			      "name": "Book",
			    },
			    {
			      "elements": [
			        {
			          "name": "string",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "number",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "Book",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "Book",
			        },
			      ],
			      "name": "Array",
			    },
			  ],
			  "name": "union",
			}
		`);
    });
    it('should extract intersection type', () => {
        expect((0, getTypeFromAnnotation_1.default)(getAnnotation('"string literal" & 3 & Book & string[] & number[] & Book[] & Array<Book>'))).toMatchInlineSnapshot(`
			{
			  "elements": [
			    {
			      "name": "\\"string literal\\"",
			    },
			    {
			      "name": "3",
			    },
			    {
			      "name": "Book",
			    },
			    {
			      "elements": [
			        {
			          "name": "string",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "number",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "Book",
			        },
			      ],
			      "name": "Array",
			    },
			    {
			      "elements": [
			        {
			          "name": "Book",
			        },
			      ],
			      "name": "Array",
			    },
			  ],
			  "name": "intersection",
			}
		`);
    });
});
