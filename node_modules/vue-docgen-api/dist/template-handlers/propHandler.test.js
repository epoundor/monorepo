"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_dom_1 = require("@vue/compiler-dom");
const Documentation_1 = __importDefault(require("../Documentation"));
const parse_template_1 = require("../parse-template");
const propHandler_1 = __importDefault(require("./propHandler"));
describe('slotHandler', () => {
    let doc;
    beforeEach(() => {
        doc = new Documentation_1.default('dummy/path');
    });
    it('should match props in attributes expressions', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>titleof the template</h1>',
            '  <!--',
            '    @prop {number} size width of the button',
            '    @prop {string} value value in the form',
            '   -->',
            '  <!-- separative comment -->',
            '  <button :style="`width:${props.size}`" :value="props.value"></button>',
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [propHandler_1.default], ast.children, {
                functional: true
            });
            expect(doc.toObject().props).toMatchObject([
                { name: 'size', type: { name: 'number' }, description: 'width of the button' },
                { name: 'value', type: { name: 'string' }, description: 'value in the form' }
            ]);
        }
        else {
            throw Error('fail');
        }
    });
    it('should match props in interpolated text', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>titleof the template</h1>',
            '  <button style="width:200px">',
            '    <!-- @prop name Your Name -->',
            '    <!-- @prop {string} adress Your Adress -->',
            '    test {{props.name}} {{props.adress}}',
            '  </button>',
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [propHandler_1.default], ast.children, {
                functional: true
            });
            expect(doc.toObject().props).toMatchObject([
                { name: 'name', type: { name: 'mixed' }, description: 'Your Name' },
                { name: 'adress', type: { name: 'string' }, description: 'Your Adress' }
            ]);
        }
        else {
            throw Error('fail');
        }
    });
    it('should not match props if in a string litteral', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>titleof the template</h1>',
            '  <button :style="`width:props.size`"></button>',
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [propHandler_1.default], ast.children, {
                functional: true
            });
            expect(doc.toObject().props).toBeUndefined();
        }
        else {
            throw Error('fail');
        }
    });
    it('should not match props if in a non evaluated attribute', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>titleof the template</h1>',
            '  <button style="width:props.size"></button>',
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [propHandler_1.default], ast.children, {
                functional: true
            });
            expect(doc.toObject().props).toBeUndefined();
        }
        else {
            throw Error('fail');
        }
    });
    it('should find props in object defined', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>titleof the template</h1>',
            '  <button :class="{',
            '	[$style.root]: true,',
            '	[$style.error]: props.error',
            '  }"></button>',
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [propHandler_1.default], ast.children, {
                functional: true
            });
            expect(doc.toObject().props).toMatchObject([{ name: 'error', type: {} }]);
        }
        else {
            throw Error('fail');
        }
    });
});
