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
exports.setEventDescriptor = exports.eventHandlerMethods = exports.eventHandlerEmits = void 0;
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const resolveIdentifier_1 = __importDefault(require("../utils/resolveIdentifier"));
const getPropsFilter_1 = __importDefault(require("../utils/getPropsFilter"));
function getCommentBlockAndTags(p, { commentIndex } = { commentIndex: 1 }) {
    const docBlock = (0, getDocblock_1.default)(p, { commentIndex });
    return docBlock ? (0, getDoclets_1.default)(docBlock) : null;
}
/**
 * Extracts events information from a VueJs component
 * wether it's a class based component or an option based one
 *
 * @param documentation
 * @param path
 * @param astPath
 */
function eventHandler(documentation, path, astPath) {
    if (bt.isObjectExpression(path.node)) {
        eventHandlerMethods(documentation, path);
        eventHandlerEmits(documentation, path);
    }
    // browse the entirety of the code inside the component to look for this.$emit
    (0, recast_1.visit)(path.node, {
        visitCallExpression(pathExpression) {
            if (bt.isMemberExpression(pathExpression.node.callee) &&
                bt.isThisExpression(pathExpression.node.callee.object) &&
                bt.isIdentifier(pathExpression.node.callee.property) &&
                pathExpression.node.callee.property.name === '$emit') {
                const args = pathExpression.node.arguments;
                if (!args.length) {
                    return false;
                }
                // fetch the leading comments on the wrapping expression
                const docblock = (0, getDocblock_1.default)(pathExpression.parentPath);
                const doclets = (0, getDoclets_1.default)(docblock || '');
                let eventName;
                const eventTags = doclets.tags ? doclets.tags.filter(d => d.title === 'event') : [];
                // if someone wants to document it with anything else, they can force it
                if (eventTags.length) {
                    eventName = eventTags[0].content;
                }
                else {
                    let firstArg = pathExpression.get('arguments', 0);
                    if (bt.isIdentifier(firstArg.node)) {
                        firstArg = (0, resolveIdentifier_1.default)(astPath, firstArg);
                    }
                    if (!firstArg || !bt.isStringLiteral(firstArg.node)) {
                        return false;
                    }
                    eventName = firstArg.node.value;
                }
                // if this event is documented somewhere else leave it alone
                const evtDescriptor = documentation.getEventDescriptor(eventName);
                setEventDescriptor(evtDescriptor, doclets);
                if (args.length > 1 && !evtDescriptor.type) {
                    evtDescriptor.type = {
                        names: ['undefined']
                    };
                }
                if (args.length > 2 && !evtDescriptor.properties) {
                    evtDescriptor.properties = [];
                }
                if (evtDescriptor.properties && evtDescriptor.properties.length < args.length - 2) {
                    let i = args.length - 2 - evtDescriptor.properties.length;
                    while (i--) {
                        evtDescriptor.properties.push({
                            type: { names: ['undefined'] },
                            name: `<anonymous${args.length - i - 2}>`
                        });
                    }
                }
                return false;
            }
            this.traverse(pathExpression);
            return undefined;
        }
    });
    return Promise.resolve();
}
exports.default = eventHandler;
/**
 * Extracts events information from an
 * object-style VueJs component `emits` option
 *
 * @param documentation
 * @param path
 */
function eventHandlerEmits(documentation, path) {
    const emitsPath = path
        .get('properties')
        .filter((p) => bt.isObjectProperty(p.node) && (0, getPropsFilter_1.default)('emits')(p));
    // if no emits member return
    if (!emitsPath.length) {
        return;
    }
    const emitsObject = emitsPath[0].get('value');
    if (bt.isArrayExpression(emitsObject.node)) {
        emitsObject.get('elements').value.forEach((event, i) => {
            if (bt.isStringLiteral(event)) {
                const eventDescriptor = documentation.getEventDescriptor(event.value);
                const eventPath = emitsObject.get('elements', i);
                const docblock = (0, getDocblock_1.default)(eventPath);
                const doclets = (0, getDoclets_1.default)(docblock || '');
                setEventDescriptor(eventDescriptor, doclets);
            }
        });
    }
    else if (bt.isObjectExpression(emitsObject.node)) {
        emitsObject.get('properties').value.forEach((event, i) => {
            const eventName = bt.isStringLiteral(event.key)
                ? event.key.value
                : bt.isIdentifier(event.key)
                    ? event.key.name
                    : undefined;
            if (eventName) {
                const eventDescriptor = documentation.getEventDescriptor(eventName);
                const eventPath = emitsObject.get('properties', i);
                const docblock = (0, getDocblock_1.default)(eventPath);
                const doclets = (0, getDoclets_1.default)(docblock || '');
                setEventDescriptor(eventDescriptor, doclets);
            }
        });
    }
}
exports.eventHandlerEmits = eventHandlerEmits;
/**
 * Extracts events information from an
 * object-style VueJs component `methods` option
 *
 * @param documentation
 * @param path
 */
function eventHandlerMethods(documentation, path) {
    const methodsPath = path
        .get('properties')
        .filter((p) => bt.isObjectProperty(p.node) && (0, getPropsFilter_1.default)('methods')(p));
    // if no method return
    if (!methodsPath.length) {
        return;
    }
    const methodsObject = methodsPath[0].get('value');
    if (bt.isObjectExpression(methodsObject.node)) {
        methodsObject.get('properties').each((p) => {
            const commentedMethod = bt.isObjectMethod(p.node) ? p : p.parentPath;
            const { tags: jsDocTags } = getCommentBlockAndTags(commentedMethod) || {};
            if (!jsDocTags) {
                return;
            }
            const firesTags = jsDocTags.filter(tag => tag.title === 'fires');
            firesTags.forEach(tag => {
                const eventName = tag.content;
                const eventDescriptor = documentation.getEventDescriptor(eventName);
                let currentBlock;
                let foundEventDescriptor;
                let commentIndex = 1;
                do {
                    currentBlock = getCommentBlockAndTags(commentedMethod, { commentIndex: ++commentIndex });
                    if (currentBlock &&
                        currentBlock.tags &&
                        currentBlock.tags.some((tag) => tag.title === 'event' && tag.content === eventName)) {
                        foundEventDescriptor = currentBlock;
                    }
                } while (currentBlock && !foundEventDescriptor);
                if (foundEventDescriptor) {
                    setEventDescriptor(eventDescriptor, foundEventDescriptor);
                }
            });
        });
    }
}
exports.eventHandlerMethods = eventHandlerMethods;
/**
 * Accepted tags for conveying event properties
 */
const PROPERTY_TAGS = ['property', 'arg', 'arguments', 'param'];
function setEventDescriptor(eventDescriptor, jsDoc) {
    if (jsDoc.description && jsDoc.description.length) {
        eventDescriptor.description = jsDoc.description;
    }
    const nonNullTags = jsDoc.tags ? jsDoc.tags : [];
    const typeTags = nonNullTags.filter(tg => tg.title === 'type');
    eventDescriptor.type = typeTags.length
        ? { names: typeTags.map((t) => t.type.name) }
        : eventDescriptor.type;
    const propertyTags = nonNullTags.filter(tg => PROPERTY_TAGS.includes(tg.title));
    if (propertyTags.length) {
        eventDescriptor.properties = propertyTags.map((tg) => {
            return { type: { names: [tg.type.name] }, name: tg.name, description: tg.description };
        });
    }
    // remove the property an type tags from the tag array
    const tags = nonNullTags.filter((tg) => tg.title !== 'type' && tg.title !== 'property' && tg.title !== 'event');
    if (tags.length) {
        eventDescriptor.tags = tags;
    }
    else {
        delete eventDescriptor.tags;
    }
    return eventDescriptor;
}
exports.setEventDescriptor = setEventDescriptor;
