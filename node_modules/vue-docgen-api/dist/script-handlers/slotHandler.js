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
exports.parseSlotDocBlock = exports.getSlotComment = void 0;
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const getDocblock_1 = require("../utils/getDocblock");
const transformTagsIntoObject_1 = __importDefault(require("../utils/transformTagsIntoObject"));
const getProperties_1 = __importDefault(require("./utils/getProperties"));
/**
 * Extract slots information form the render function of an object-style VueJs component
 * @param documentation
 * @param path
 */
function slotHandler(documentation, path) {
    if (bt.isObjectExpression(path.node)) {
        const renderPath = (0, getProperties_1.default)(path, 'render');
        // if no prop return
        if (!renderPath.length) {
            return Promise.resolve();
        }
        const renderValuePath = bt.isObjectProperty(renderPath[0].node)
            ? renderPath[0].get('value')
            : renderPath[0];
        (0, recast_1.visit)(renderValuePath.node, {
            // this.$slots.default()
            visitCallExpression(pathCall) {
                if (bt.isMemberExpression(pathCall.node.callee) &&
                    bt.isMemberExpression(pathCall.node.callee.object) &&
                    bt.isThisExpression(pathCall.node.callee.object.object) &&
                    bt.isIdentifier(pathCall.node.callee.property) &&
                    bt.isIdentifier(pathCall.node.callee.object.property) &&
                    (pathCall.node.callee.object.property.name === '$slots' ||
                        pathCall.node.callee.object.property.name === '$scopedSlots')) {
                    const doc = documentation.getSlotDescriptor(pathCall.node.callee.property.name);
                    const comment = getSlotComment(pathCall, doc);
                    const bindings = pathCall.node.arguments[0];
                    if (bt.isObjectExpression(bindings) && bindings.properties.length) {
                        doc.bindings = getBindings(bindings, comment ? comment.bindings : undefined);
                    }
                    return false;
                }
                this.traverse(pathCall);
                return undefined;
            },
            // this.$slots.mySlot
            visitMemberExpression(pathMember) {
                if (bt.isMemberExpression(pathMember.node.object) &&
                    bt.isThisExpression(pathMember.node.object.object) &&
                    bt.isIdentifier(pathMember.node.object.property) &&
                    (pathMember.node.object.property.name === '$slots' ||
                        pathMember.node.object.property.name === '$scopedSlots') &&
                    bt.isIdentifier(pathMember.node.property)) {
                    const doc = documentation.getSlotDescriptor(pathMember.node.property.name);
                    getSlotComment(pathMember, doc);
                    return false;
                }
                this.traverse(pathMember);
                return undefined;
            },
            visitJSXElement(pathJSX) {
                const tagName = pathJSX.node.openingElement.name;
                const nodeJSX = pathJSX.node;
                if (bt.isJSXIdentifier(tagName) && tagName.name === 'slot') {
                    const doc = documentation.getSlotDescriptor(getName(nodeJSX));
                    const parentNode = pathJSX.parentPath.node;
                    let comment;
                    if (bt.isJSXElement(parentNode)) {
                        comment = getJSXDescription(nodeJSX, parentNode.children, doc);
                    }
                    const bindings = nodeJSX.openingElement.attributes;
                    if (bindings && bindings.length) {
                        doc.bindings = bindings.map((b) => getBindingsFromJSX(b, comment ? comment.bindings : undefined));
                    }
                    return false;
                }
                this.traverse(pathJSX);
                return undefined;
            }
        });
    }
    return Promise.resolve();
}
exports.default = slotHandler;
function isStatement(path) {
    return (path &&
        (bt.isDeclaration(path.node) || bt.isReturnStatement(path.node) || bt.isIfStatement(path.node)));
}
function getName(nodeJSX) {
    const oe = nodeJSX.openingElement;
    const names = oe.attributes.filter((a) => bt.isJSXAttribute(a) && a.name.name === 'name');
    const nameNode = names.length ? names[0].value : null;
    return nameNode && bt.isStringLiteral(nameNode) ? nameNode.value : 'default';
}
function getJSXDescription(nodeJSX, siblings, descriptor) {
    const indexInParent = siblings.indexOf(nodeJSX);
    let commentExpression = null;
    for (let i = indexInParent - 1; i > -1; i--) {
        const currentNode = siblings[i];
        if (bt.isJSXExpressionContainer(currentNode)) {
            commentExpression = currentNode;
            break;
        }
    }
    if (!commentExpression || !commentExpression.expression.innerComments) {
        return undefined;
    }
    const cmts = commentExpression.expression.innerComments;
    const lastComment = cmts[cmts.length - 1];
    return parseCommentNode(lastComment, descriptor);
}
function getSlotComment(path, descriptor) {
    const desc = getExpressionDescription(path, descriptor);
    if (desc) {
        return desc;
    }
    // in case we don't find a description on the expression,
    // look for it on the containing statement
    // 1: find the statement
    let i = 10;
    while (i-- && path && !isStatement(path)) {
        path = path.parentPath;
    }
    // 2: extract the description if it exists
    return path ? getExpressionDescription(path, descriptor) : undefined;
}
exports.getSlotComment = getSlotComment;
function getExpressionDescription(path, descriptor) {
    const node = path.node;
    if (!node || !node.leadingComments || node.leadingComments.length === 0) {
        return undefined;
    }
    return parseCommentNode(node.leadingComments[node.leadingComments.length - 1], descriptor);
}
function parseCommentNode(node, descriptor) {
    if (node.type !== 'CommentBlock') {
        return undefined;
    }
    return parseSlotDocBlock(node.value, descriptor);
}
function parseSlotDocBlock(str, descriptor) {
    var _a;
    const docBlock = (0, getDocblock_1.parseDocblock)(str).trim();
    const jsDoc = (0, getDoclets_1.default)(docBlock);
    if (!((_a = jsDoc.tags) === null || _a === void 0 ? void 0 : _a.length)) {
        return undefined;
    }
    const slotTags = jsDoc.tags.filter(t => t.title === 'slot');
    if (slotTags.length) {
        const tagContent = slotTags[0].content;
        const description = typeof tagContent === 'string' ? tagContent : undefined;
        if (description && (!descriptor.description || !descriptor.description.length)) {
            descriptor.description = description;
            const fixedNameMatch = description.match(/^(\S+) - (.*)$/);
            if (fixedNameMatch) {
                descriptor.name = fixedNameMatch[1];
                descriptor.description = fixedNameMatch[2];
            }
        }
        const tags = jsDoc.tags.filter(t => t.title !== 'slot' && t.title !== 'binding');
        if (tags.length) {
            descriptor.tags = (0, transformTagsIntoObject_1.default)(tags);
        }
        return {
            bindings: jsDoc.tags.filter(t => t.title === 'binding')
        };
    }
    return undefined;
}
exports.parseSlotDocBlock = parseSlotDocBlock;
function getBindings(node, bindingsFromComments) {
    return node.properties.reduce((bindings, prop) => {
        if (bt.isIdentifier(prop.key)) {
            const name = prop.key.name;
            const description = prop.leadingComments && prop.leadingComments.length
                ? (0, getDocblock_1.parseDocblock)(prop.leadingComments[prop.leadingComments.length - 1].value)
                : undefined;
            if (!description) {
                const descbinding = bindingsFromComments
                    ? bindingsFromComments.filter(b => b.name === name)[0]
                    : undefined;
                if (descbinding) {
                    bindings.push(descbinding);
                    return bindings;
                }
            }
            else {
                bindings.push({
                    title: 'binding',
                    name,
                    description
                });
            }
        }
        return bindings;
    }, []);
}
function getBindingsFromJSX(attr, bindings) {
    const name = attr.name.name;
    const descbinding = bindings ? bindings.filter(b => b.name === name)[0] : undefined;
    if (descbinding) {
        return descbinding;
    }
    return {
        title: 'binding',
        name
    };
}
