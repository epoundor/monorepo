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
exports.traverse = void 0;
const pug = __importStar(require("pug"));
const compiler_dom_1 = require("@vue/compiler-dom");
const cacher_1 = __importDefault(require("./utils/cacher"));
function parseTemplate(tpl, documentation, handlers, opts) {
    const { filePath, pugOptions } = opts;
    if (tpl && tpl.content) {
        const source = tpl.attrs && tpl.attrs.lang === 'pug'
            ? pug.render(tpl.content.trim(), Object.assign(Object.assign({ doctype: 'html' }, pugOptions), { filename: filePath }))
            : tpl.content;
        const ast = (0, cacher_1.default)(() => (0, compiler_dom_1.parse)(source, { comments: true }), source);
        const functional = !!tpl.attrs.functional;
        if (functional) {
            documentation.set('functional', functional);
        }
        if (ast) {
            ast.children.forEach(child => traverse(child, documentation, handlers, ast.children, {
                functional
            }));
        }
    }
}
exports.default = parseTemplate;
function hasChildren(child) {
    return !!child.children;
}
function traverse(templateAst, documentation, handlers, siblings, options) {
    const traverseAstChildren = (ast) => {
        if (hasChildren(ast)) {
            const { children } = ast;
            for (const childNode of children) {
                traverse(childNode, documentation, handlers, children, options);
            }
        }
    };
    handlers.forEach(handler => {
        handler(documentation, templateAst, siblings, options);
    });
    traverseAstChildren(templateAst);
}
exports.traverse = traverse;
