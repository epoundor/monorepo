"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_dom_1 = require("@vue/compiler-dom");
const extractLeadingComment_1 = __importDefault(require("./extractLeadingComment"));
function isBaseElementNode(a) {
    return a.tag !== undefined;
}
function compileIt(src) {
    const [ast] = (0, compiler_dom_1.parse)(src).children;
    if (isBaseElementNode(ast)) {
        const firstHeader = ast.children.filter(a => isBaseElementNode(a) && a.tag === 'h1');
        if (firstHeader.length) {
            return { parent: ast, child: firstHeader[0] };
        }
    }
    return undefined;
}
describe('extractLeadingComment', () => {
    it('should not fail when no comment', () => {
        const elt = compileIt([
            '<div>',
            ' <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (!elt) {
            throw Error('fail');
        }
        else {
            expect((0, extractLeadingComment_1.default)([], elt.child).length).toBe(0);
        }
    });
    it('should extract single line comments', () => {
        const elt = compileIt([
            '<div>',
            ' <div>Hello World !!</div>',
            ' <div>Happy Day !!</div>',
            ' <!-- single line comment -->',
            ' <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (!elt) {
            throw Error('fail');
        }
        else {
            expect((0, extractLeadingComment_1.default)(elt.parent.children, elt.child)[0]).toBe('single line comment');
        }
    });
    it('should extract multi line comments', () => {
        const elt = compileIt([
            '<div>',
            '  <div>Hello World !!</div>',
            '  <!-- multi line comment -->',
            '  <!-- on 2 lines         -->',
            '  <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (elt) {
            expect((0, extractLeadingComment_1.default)(elt.parent.children, elt.child)).toEqual([
                'multi line comment',
                'on 2 lines'
            ]);
        }
        else {
            throw Error('fail');
        }
    });
    it('should extract multi line comment blocks', () => {
        const elt = compileIt([
            '<div>',
            '  <div>Hello World !!</div>',
            '  <!--',
            '	multi line comment',
            '   on 2 lines',
            '  -->',
            '  <!-- single line comment -->',
            '  <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (elt) {
            const comments = (0, extractLeadingComment_1.default)(elt.parent.children, elt.child);
            expect(comments[0]).toEqual(['multi line comment', '   on 2 lines'].join('\n'));
            expect(comments[1]).toEqual('single line comment');
        }
        else {
            throw Error('fail');
        }
    });
    it('should extract comment blocks when first sibling', () => {
        const elt = compileIt([
            '<div>',
            '  <!--',
            '	multi line comment',
            '   on 2 lines',
            '  -->',
            '  <!-- single line comment -->',
            '  <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (elt) {
            const comments = (0, extractLeadingComment_1.default)(elt.parent.children, elt.child);
            expect(comments[0]).toEqual(['multi line comment', '   on 2 lines'].join('\n'));
            expect(comments[1]).toEqual('single line comment');
        }
        else {
            throw Error('fail');
        }
    });
    it('extract comment from js too', () => {
        const elt = compileIt([
            '<div>',
            '  {{ //single line comment }}',
            '  <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (elt) {
            const comments = (0, extractLeadingComment_1.default)(elt.parent.children, elt.child);
            expect(comments[0]).toEqual('single line comment');
        }
        else {
            throw Error('fail');
        }
    });
    it('extract comment from js comment blocks as well', () => {
        const elt = compileIt([
            '<div>',
            '  {{ /*block comment*/ }}',
            '  <h1>title of the template</h1>',
            '</div>'
        ].join('\n'));
        if (elt) {
            const comments = (0, extractLeadingComment_1.default)(elt.parent.children, elt.child);
            expect(comments[0]).toEqual('block comment');
        }
        else {
            throw Error('fail');
        }
    });
});
