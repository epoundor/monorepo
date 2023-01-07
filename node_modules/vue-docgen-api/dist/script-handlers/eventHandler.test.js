"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const eventHandler_1 = __importStar(require("./eventHandler"));
vi.mock('../../Documentation');
function parse(src) {
    const ast = (0, babel_parser_1.default)().parse(src);
    return { component: (0, resolveExportedComponent_1.default)(ast)[0].get('default'), ast };
}
describe('eventHandler', () => {
    let documentation;
    let mockEventDescriptor;
    beforeEach(() => {
        mockEventDescriptor = { name: 'success' };
        documentation = new Documentation_1.default('dummy/path');
        vi.spyOn(documentation, 'getEventDescriptor');
        const mockGetEventDescriptor = documentation.getEventDescriptor;
        mockGetEventDescriptor.mockReturnValue(mockEventDescriptor);
    });
    it('should find events emmitted', () => {
        const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * Describe the event
             * @property {number} prop1
             * @param {number} prop2
             */
            this.$emit('success', 1, 2)
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
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
                },
                {
                    name: 'prop2',
                    type: {
                        names: ['number']
                    }
                }
            ]
        };
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success');
        expect(mockEventDescriptor).toMatchObject(eventComp);
    });
    it('should find simple events emmitted', () => {
        const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * Describe the event
             */
            this.$emit('success')
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
        }
        expect(mockEventDescriptor.properties).toBeUndefined();
    });
    it('should find events undocumented properties', () => {
        const src = `
    export default {
      methods: {
        testEmit() {
            this.$emit('success', 1, 2)
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
        }
        const eventComp = {
            name: 'success',
            type: {
                names: ['undefined']
            },
            properties: [
                {
                    name: '<anonymous1>',
                    type: {
                        names: ['undefined']
                    }
                }
            ]
        };
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success');
        expect(mockEventDescriptor).toMatchObject(eventComp);
    });
    it('should find events names stored in variables', () => {
        const src = `
    const successEventName = 'success';
    export default {
      methods: {
        testEmit() {
            this.$emit(successEventName, 1, 2)
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
        }
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success');
    });
    it('should allow the use of an event multiple times', () => {
        const src = `
    export default {
      methods: {
        testEmit() {
			/**
			 * Describe the event
			 * @property {number} prop1
			 * @property {string} msg
			 */
			this.$emit('success', 3, "hello")
			this.$emit('success', 1)
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
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
                },
                {
                    name: 'msg',
                    type: {
                        names: ['string']
                    }
                }
            ]
        };
        expect(mockEventDescriptor).toMatchObject(eventComp);
    });
    it('should find events whose names are only specified in the JSDoc', () => {
        const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * @event success
             */
            this.$emit(A.successEventName, 1, 2)
        }
      }
    }
    `;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
        }
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success');
    });
    it('should not fail when event name cannot be found', () => {
        const src = `
    export default {
      methods: {
        testEmit(success) {
            this.$emit(success, 1, 2)
        }
      }
    }
		`;
        const def = parse(src);
        expect(() => (0, eventHandler_1.default)(documentation, def.component, def.ast)).not.toThrow();
    });
    it('should allow forced events', () => {
        const src = `
	export default {
		methods: {
			/** 
			 * Define the event just before the function block
			 *
			 * @event updating
			 * @property { String } prop1 - first prop given by the event
			 */
      /** 
       * Define each event in its own block
       *
       * @event sending
       * @property { String } sendingProp - first prop given by the event
       */
			/** 
			 * @fires updating
       * @fires sending
       */
			onUpdate (name, newValue) {
				// some external method, for example from a method
				// (bind to the Vue instance) provided by a standard js class
			}
		}	
	}`;
        const def = parse(src);
        if (def.component) {
            (0, eventHandler_1.default)(documentation, def.component, def.ast);
        }
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('updating');
        expect(documentation.getEventDescriptor).toHaveBeenCalledWith('sending');
    });
    describe('vue 3 event descriptors', () => {
        it('should detect events as an array', () => {
            const src = `
	export default {
		emits: ['in-focus', 'submit']
	}
			`;
            const def = parse(src);
            if (def.component) {
                (0, eventHandler_1.eventHandlerEmits)(documentation, def.component);
            }
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('in-focus');
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit');
        });
        it('should detect event descriptors as an object', () => {
            const src = `
	export default {
		emits: {
			'in-focus': undefined, 
			submit: undefined
		}
	}
			`;
            const def = parse(src);
            if (def.component) {
                (0, eventHandler_1.eventHandlerEmits)(documentation, def.component);
            }
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('in-focus');
            expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit');
        });
        it('should extract desciptions (array)', () => {
            const src = `
	export default {
		emits: [
			/**
			 * The button has gathered focus
			 */
			'in-focus', 
			/**
			 * The form is being submitted
			 */
			'submit'
		]
	}
			`;
            const def = parse(src);
            if (def.component) {
                (0, eventHandler_1.eventHandlerEmits)(documentation, def.component);
            }
            const eventComp = {
                name: 'success',
                description: 'The form is being submitted'
            };
            expect(mockEventDescriptor).toMatchObject(eventComp);
        });
        it('should extract desciptions (object)', () => {
            const src = `
	export default {
		emits: {
			/**
			 * The button has gathered focus
			 */
			'in-focus': undefined, 
			/**
			 * The form is being submitted
			 */
			submit: undefined
		}
	}
			`;
            const def = parse(src);
            if (def.component) {
                (0, eventHandler_1.eventHandlerEmits)(documentation, def.component);
            }
            const eventComp = {
                name: 'success',
                description: 'The form is being submitted'
            };
            expect(mockEventDescriptor).toMatchObject(eventComp);
        });
        it('should extract arguments (array)', () => {
            const src = `
	export default {
		emits: [
			'click',
			/**
			 * The form is being submitted
			 * @arg {string} payload
			 */
			'submit'
		]
	}
			`;
            const def = parse(src);
            if (def.component) {
                (0, eventHandler_1.eventHandlerEmits)(documentation, def.component);
            }
            const eventComp = {
                name: 'success',
                description: 'The form is being submitted',
                properties: [
                    {
                        name: 'payload',
                        type: {
                            names: ['string']
                        }
                    }
                ]
            };
            expect(mockEventDescriptor).toMatchObject(eventComp);
        });
    });
});
