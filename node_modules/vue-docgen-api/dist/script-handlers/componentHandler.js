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
const bt = __importStar(require("@babel/types"));
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const transformTagsIntoObject_1 = __importDefault(require("../utils/transformTagsIntoObject"));
const getProperties_1 = __importDefault(require("./utils/getProperties"));
/**
 * Extracts prop information from an object-style VueJs component
 * @param documentation
 * @param path
 */
function componentHandler(documentation, path) {
    // deal with functional flag
    if (bt.isObjectExpression(path.node)) {
        const functionalPath = (0, getProperties_1.default)(path, 'functional');
        if (functionalPath.length) {
            const functionalValue = functionalPath[0].get('value').node;
            if (bt.isBooleanLiteral(functionalValue)) {
                documentation.set('functional', functionalValue.value);
            }
        }
    }
    let componentCommentedPath = path.parentPath;
    // in case of Vue.extend() structure
    if (bt.isCallExpression(componentCommentedPath.node)) {
        // look for leading comments in the parent structures
        let i = 5;
        while (i-- &&
            !componentCommentedPath.get('leadingComments').value &&
            componentCommentedPath.parentPath.node.type !== 'Program') {
            componentCommentedPath = componentCommentedPath.parentPath;
        }
    }
    else if (bt.isVariableDeclarator(componentCommentedPath.node)) {
        componentCommentedPath = componentCommentedPath.parentPath.parentPath;
        if (componentCommentedPath.parentPath.node.type !== 'Program') {
            componentCommentedPath = componentCommentedPath.parentPath;
        }
    }
    else if (bt.isDeclaration(componentCommentedPath.node)) {
        const classDeclaration = componentCommentedPath.get('declaration');
        if (bt.isClassDeclaration(classDeclaration.node)) {
            componentCommentedPath = classDeclaration;
        }
    }
    const docBlock = (0, getDocblock_1.default)(componentCommentedPath);
    // if no prop return
    if (!docBlock || !docBlock.length) {
        return Promise.resolve();
    }
    const jsDoc = (0, getDoclets_1.default)(docBlock);
    documentation.set('description', jsDoc.description);
    if (jsDoc.tags) {
        const displayNamesTags = jsDoc.tags.filter(t => t.title === 'displayName');
        if (displayNamesTags.length) {
            const displayName = displayNamesTags[0];
            documentation.set('displayName', displayName.content);
        }
        const tagsAsObject = (0, transformTagsIntoObject_1.default)(jsDoc.tags.filter(t => t.title !== 'example' && t.title !== 'displayName') || []);
        const examples = jsDoc.tags.filter(t => t.title === 'example');
        if (examples.length) {
            tagsAsObject.examples = examples;
        }
        documentation.set('tags', tagsAsObject);
    }
    else {
        documentation.set('tags', {});
    }
    return Promise.resolve();
}
exports.default = componentHandler;
