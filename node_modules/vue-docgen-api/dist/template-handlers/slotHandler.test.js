"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_dom_1 = require("@vue/compiler-dom");
const Documentation_1 = __importDefault(require("../Documentation"));
const parse_template_1 = require("../parse-template");
const slotHandler_1 = __importDefault(require("./slotHandler"));
describe('slotHandler', () => {
    let doc;
    beforeEach(() => {
        doc = new Documentation_1.default('dummy/path');
    });
    it('should detect slots', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>title of the template</h1>',
            '  <!-- @slot a default slot -->',
            '  <slot></slot>',
            '</div>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
        expect(doc.toObject().slots).toMatchObject([
            {
                name: 'default',
                description: 'a default slot'
            }
        ]);
    });
    it('should detect slots in js comments', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>title of the template</h1>',
            '  {{ // @slot a default slot }}',
            '  <slot></slot>',
            '</div>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
        expect(doc.toObject().slots).toMatchObject([
            {
                name: 'default',
                description: 'a default slot'
            }
        ]);
    });
    it('detects slots also in js block comments', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>title of the template</h1>',
            '  {{ /**',
            '      * @slot a default slot ',
            '      */ }}',
            '  <slot></slot>',
            '</div>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
        expect(doc.toObject().slots).toMatchObject([
            {
                name: 'default',
                description: 'a default slot'
            }
        ]);
    });
    it('should pick comments at the beginning of templates', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<!-- @slot first slot found -->',
            '<slot name="first">',
            '  <div>',
            '    <h1>title of the template</h1>',
            '  </div>',
            '</slot>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[1], doc, [slotHandler_1.default], ast.children, {
            functional: false
        });
        expect(doc.toObject().slots).toMatchObject([{ name: 'first', description: 'first slot found' }]);
    });
    it('should parse dynamic slot names', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<!-- @slot first slot found -->',
            '<slot :name="`dynamicName`">',
            '  <div>',
            '    <h1>title of the template</h1>',
            '  </div>',
            '</slot>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[1], doc, [slotHandler_1.default], ast.children, {
            functional: false
        });
        expect(doc.toObject().slots).toMatchObject([
            { name: '`dynamicName`', description: 'first slot found' }
        ]);
    });
    it('should parse dynamic slot names but prefer a fixed name', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<!-- @slot theFixedName - first slot found -->',
            '<slot :name="`dynamicName`">',
            '  <div>',
            '    <h1>title of the template</h1>',
            '  </div>',
            '</slot>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[1], doc, [slotHandler_1.default], ast.children, {
            functional: false
        });
        expect(doc.toObject().slots).toMatchObject([
            { name: 'theFixedName', description: 'first slot found' }
        ]);
    });
    it('should pick up the name of a slot', () => {
        const ast = (0, compiler_dom_1.parse)([
            '<div>',
            '  <h1>title of the template</h1>',
            '  <!-- @slot a slot named woof -->',
            '  <slot name="woof"></slot>',
            '</div>'
        ].join('\n'));
        (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
        expect(doc.toObject().slots).toMatchObject([
            {
                name: 'woof',
                description: 'a slot named woof'
            }
        ]);
    });
    describe('bindings', () => {
        it('should detect scoped slots', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div title="a list of item with a scope" >',
                '  <!-- @slot a slot named woof -->',
                '  <slot name="woof" v-for="item in items" :item="itemValue"/>',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            expect(doc.toObject().slots).toMatchObject([
                {
                    name: 'woof',
                    scoped: true,
                    description: 'a slot named woof',
                    bindings: [
                        {
                            name: 'item'
                        }
                    ]
                }
            ]);
        });
        it('should detect explicit bindings using v-bind', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div title="a list of item with a scope" >',
                '  <slot name="bound" v-for="item in items" v-bind="{ ...keyNames }"/>',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
                {
                    name: 'v-bind'
                }
            ]);
        });
        it('should detect implicit bindings if it is simple enough', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div title="a list of item with a scope" >',
                '	<!-- @slot Menu Item footer -->',
                '	<slot name="bound" v-for="item in items" v-bind="{ item, otherItem: valueGiven }"/>',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
                {
                    name: 'item'
                },
                {
                    name: 'otherItem'
                }
            ]);
        });
        it('should detect explicit bindings and allow their documentation', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div title="a list of item with a scope" >',
                '	<!--',
                '		@slot Menu Item footer',
                '		@binding {object} item menu item',
                '		@binding {string} otherItem text of the menu item',
                '	-->',
                '  <slot name="bound" v-for="item in items" :item="item" :otherItem="valueGiven" />',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
                {
                    name: 'item',
                    description: 'menu item'
                },
                {
                    name: 'otherItem',
                    description: 'text of the menu item'
                }
            ]);
        });
        it('should not fail on slots', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div>',
                '  <!-- test -->',
                '  <slot />',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots.length).toBe(1);
        });
        it('should not fail on non-commented slots', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div>',
                '  <slot />',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots.length).toBe(1);
        });
        it('should extract tags from a slot', () => {
            const ast = (0, compiler_dom_1.parse)([
                '<div>',
                '	<!--',
                '		@slot',
                '		@ignore',
                '    -->',
                '  <slot />',
                '</div>'
            ].join('\n'));
            (0, parse_template_1.traverse)(ast.children[0], doc, [slotHandler_1.default], ast.children, { functional: false });
            const slots = doc.toObject().slots || [];
            expect(slots[0].tags).toMatchInlineSnapshot(`
				{
				  "ignore": [
				    {
				      "description": true,
				      "title": "ignore",
				    },
				  ],
				}
			`);
        });
    });
});
