"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const classEventHandler_1 = __importDefault(require("./classEventHandler"));
const Documentation_1 = __importDefault(require("../Documentation"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse(src);
    return { component: (0, resolveExportedComponent_1.default)(ast)[0].get('default'), ast };
}
describe('classEventHandler', () => {
    let documentation;
    let mockEventDescriptor;
    beforeEach(() => {
        mockEventDescriptor = { name: 'success' };
        documentation = new Documentation_1.default('dummy/path');
        const mockGetEventDescriptor = vi.spyOn(documentation, 'getEventDescriptor');
        mockGetEventDescriptor.mockReturnValue(mockEventDescriptor);
    });
    it('should find events emmitted', () => {
        const src = `
	import { Vue, Component, Emit } from "vue-property-decorator";
	
	@Component
	export default class Demo extends Vue {
		/**
		 * Describe the event
		 * @property {number} prop1
		 */
		@Emit()
		success() {
			return 1;
		}
	}
    `;
        const def = parse(src);
        if (def.component) {
            (0, classEventHandler_1.default)(documentation, def.component, def.ast);
        }
        const eventComp = {
            name: 'success',
            description: 'Describe the event',
            properties: [
                {
                    name: 'prop1',
                    type: {
                        names: ['number']
                    }
                }
            ]
        };
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success');
        expect(mockEventDescriptor).toMatchObject(eventComp);
    });
    it('should find events emmitted whose name is specified', () => {
        const src = `
	import { Vue, Component, Emit } from "vue-property-decorator";
	
	@Component
	export default class Demo extends Vue {
		/**
		 * This is a demo event
		 * @property {number} demo
		 */
		@Emit("demoEvent")
		success() {
			return 1;
		}
	}
    `;
        const def = parse(src);
        if (def.component) {
            (0, classEventHandler_1.default)(documentation, def.component, def.ast);
        }
        const eventComp = {
            name: 'success',
            description: 'This is a demo event',
            properties: [
                {
                    name: 'demo',
                    type: {
                        names: ['number']
                    }
                }
            ]
        };
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('demoEvent');
        expect(mockEventDescriptor).toMatchObject(eventComp);
    });
});
