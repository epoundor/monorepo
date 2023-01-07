"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_dom_1 = require("@vue/compiler-dom");
const Documentation_1 = __importDefault(require("../Documentation"));
const parse_template_1 = require("../parse-template");
const eventHandler_1 = __importDefault(require("./eventHandler"));
describe('eventHandler', () => {
    let doc;
    beforeEach(() => {
        doc = new Documentation_1.default('dummy/path');
    });
    it('should match events calls in attributes expressions', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <!--',
            '    trigered on click',
            '    @event click',
            '  -->',
            `  <button @click="$emit('click', 23, 1)"></button>`,
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [eventHandler_1.default], ast.children, {
                functional: false
            });
            expect(doc.toObject().events).toMatchObject([
                {
                    name: 'click',
                    description: 'trigered on click'
                }
            ]);
        }
        else {
            throw Error('fail');
        }
    });
    it('should match events calls property', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <!--',
            '    trigered on click',
            '    @event click',
            '    @property {object} demo - example',
            '    @property {number} called - test called',
            '  -->',
            `  <button @click="$emit('click', test)"></button>`,
            '</div>'
        ].join('\n'));
        if (ast) {
            (0, parse_template_1.traverse)(ast.children[0], doc, [eventHandler_1.default], ast.children, {
                functional: false
            });
            expect(doc.toObject().events).toMatchObject([
                {
                    name: 'click',
                    description: 'trigered on click',
                    properties: [
                        {
                            description: 'example',
                            name: 'demo'
                        },
                        {
                            description: 'test called',
                            name: 'called'
                        }
                    ]
                }
            ]);
        }
        else {
            throw Error('fail');
        }
    });
});
