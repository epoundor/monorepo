"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const componentHandler_1 = __importDefault(require("./componentHandler"));
vi.mock('../../Documentation');
function parse(src, plugins = []) {
    const ast = (0, babel_parser_1.default)({ plugins }).parse(src);
    return (0, resolveExportedComponent_1.default)(ast)[0];
}
describe('componentHandler', () => {
    let documentation;
    beforeEach(() => {
        documentation = new Documentation_1.default('dummy/path');
        vi.spyOn(documentation, 'set');
    });
    it('should return the right component name', () => {
        const src = `
    /**
     * An empty component #1
     */
    export default {
      name: 'name-123',
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component #1');
    });
    it('should return the right component description with import', () => {
        const src = `
	import { test } from 'vue-test'
		
    /**
     * An empty component #1.1
     */
    export default {
      name: 'name-123',
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component #1.1');
    });
    it('should return tags for normal components', () => {
        const src = `
    /**
     * An empty component #2
     * @version 12.5.7
     * @author [Rafael]
     */
    export default {
      name: 'name-123',
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('tags', {
            author: [{ description: '[Rafael]', title: 'author' }],
            version: [{ description: '12.5.7', title: 'version' }]
        });
    });
    it('should return tags for class style components', () => {
        const src = `
    /**
     * An empty component #3
     * @version 12.5.7
     */
    @Component
    export default class myComp {

    }
    `;
        const def = parse(src, ['typescript']).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('tags', {
            version: [{ description: '12.5.7', title: 'version' }]
        });
    });
    it('should detect functional flags', () => {
        const src = `
    export default {
      functional:true
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('functional', true);
    });
    it('should compile @example tags into one examples', () => {
        const src = `
		/**
		 * @example path/to/example.md
		 * @example path/to/otherexample.md
		 */
    export default {
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('tags', {
            examples: [
                {
                    content: 'path/to/example.md',
                    title: 'example'
                },
                {
                    content: 'path/to/otherexample.md',
                    title: 'example'
                }
            ]
        });
    });
    it('should extract the @displayName tag seperately', () => {
        const src = `
	/**
	 * @displayName Best Button Ever
	 */
    export default {
    }
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'Best Button Ever');
    });
    it('should extract the @displayName tag seperately if iev', () => {
        const src = `
	/**
	 * Best Button Ever
	 */
	const a = {}

    export default a
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('description', 'Best Button Ever');
    });
    it('should extract all info when Vue.extends is assigned to a const and exported later', () => {
        const src = `
	/**
	 * @displayName Best Button Ever
	 */
    const button = Vue.extends({
	})

	export default button
    `;
        const def = parse(src).get('default');
        if (def) {
            (0, componentHandler_1.default)(documentation, def);
        }
        expect(documentation.set).toHaveBeenCalledWith('displayName', 'Best Button Ever');
    });
    it('should not fail when no comments are on a Vue.extends', () => {
        const src = `export default Vue.extends({})`;
        const def = parse(src).get('default');
        expect(() => {
            if (def) {
                (0, componentHandler_1.default)(documentation, def);
            }
        }).not.toThrow();
    });
});
