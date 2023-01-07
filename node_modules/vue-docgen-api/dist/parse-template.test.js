"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_template_1 = __importDefault(require("./parse-template"));
const Documentation_1 = __importDefault(require("./Documentation"));
describe('parse-template', () => {
    let content = '';
    let doc;
    const path = 'file/path';
    beforeEach(() => {
        doc = new Documentation_1.default(path);
    });
    it('should parse components with multi head', () => {
        content = '<div></div><!-- comment -->';
        (0, parse_template_1.default)({ content, attrs: {} }, doc, [], { filePath: path, validExtends: () => true });
        expect(doc.toObject()).toMatchInlineSnapshot(`
			{
			  "description": "",
			  "displayName": undefined,
			  "events": undefined,
			  "exportName": undefined,
			  "expose": undefined,
			  "methods": undefined,
			  "props": undefined,
			  "slots": undefined,
			  "tags": {},
			}
		`);
    });
});
