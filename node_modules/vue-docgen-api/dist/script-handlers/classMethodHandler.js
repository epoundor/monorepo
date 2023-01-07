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
const methodHandler_1 = require("./methodHandler");
/**
 * Extracts all information about methods in a class-style Component
 * @param documentation
 * @param path
 */
function classMethodHandler(documentation, path) {
    if (bt.isClassDeclaration(path.node)) {
        const methods = documentation.get('methods') || [];
        const allMethods = path
            .get('body')
            .get('body')
            .filter((a) => bt.isClassMethod(a.node));
        allMethods.forEach((methodPath) => {
            const methodName = bt.isIdentifier(methodPath.node.key)
                ? methodPath.node.key.name
                : '<anonymous>';
            const docBlock = (0, getDocblock_1.default)(bt.isClassMethod(methodPath.node) ? methodPath : methodPath.parentPath);
            const jsDoc = docBlock ? (0, getDoclets_1.default)(docBlock) : { description: '', tags: [] };
            const jsDocTags = jsDoc.tags ? jsDoc.tags : [];
            // ignore the method if there is no public tag
            if (!jsDocTags.some((t) => t.title === 'access' && t.content === 'public')) {
                return Promise.resolve();
            }
            const methodDescriptor = documentation.getMethodDescriptor(methodName);
            if (jsDoc.description) {
                methodDescriptor.description = jsDoc.description;
            }
            (0, methodHandler_1.setMethodDescriptor)(methodDescriptor, methodPath, jsDocTags);
            return true;
        });
        documentation.set('methods', methods);
    }
    return Promise.resolve();
}
exports.default = classMethodHandler;
