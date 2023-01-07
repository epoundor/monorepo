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
const recast_1 = require("recast");
const babel_parser_1 = __importDefault(require("../babel-parser"));
const extractLeadingComment_1 = __importDefault(require("../utils/extractLeadingComment"));
const slotHandler_1 = require("../script-handlers/slotHandler");
const guards_1 = require("../utils/guards");
const parser = (0, babel_parser_1.default)({ plugins: ['typescript'] });
function slotHandler(documentation, templateAst, siblings) {
    if ((0, guards_1.isBaseElementNode)(templateAst) && templateAst.tag === 'slot') {
        const nameProp = templateAst.props.filter(guards_1.isAttributeNode).find(b => b.name === 'name');
        let slotName = nameProp && nameProp.value ? nameProp.value.content : undefined;
        if (!slotName) {
            const dynExpr = templateAst.props
                .filter(guards_1.isDirectiveNode)
                .find(b => b.name === 'bind' && (0, guards_1.isSimpleExpressionNode)(b.arg) && b.arg.content === 'name');
            if (dynExpr && (0, guards_1.isSimpleExpressionNode)(dynExpr.exp) && dynExpr.exp) {
                slotName = dynExpr.exp.content;
            }
            else {
                slotName = 'default';
            }
        }
        const bindings = templateAst.props.filter(
        // only keep simple binds and static attributes
        b => b.name !== 'name' && (b.name === 'bind' || (0, guards_1.isAttributeNode)(b)));
        const slotDescriptor = documentation.getSlotDescriptor(slotName);
        if (bindings.length) {
            slotDescriptor.scoped = true;
        }
        const comments = (0, extractLeadingComment_1.default)(siblings, templateAst);
        let bindingDescriptors = [];
        comments.forEach(comment => {
            // if a comment contains @slot,
            // use it to determine bindings and tags
            // if multiple @slot, use the last one
            if (comment.length) {
                const doclets = (0, slotHandler_1.parseSlotDocBlock)(comment, slotDescriptor);
                if (doclets && doclets.bindings) {
                    bindingDescriptors = doclets.bindings;
                }
            }
        });
        const simpleBindings = [];
        // deal with v-bind="" props
        const simpleVBind = bindings.find(b => (0, guards_1.isDirectiveNode)(b) && !b.arg);
        let rawVBind = false;
        if (simpleVBind && (0, guards_1.isSimpleExpressionNode)(simpleVBind.exp)) {
            const ast = parser.parse(`() => (${simpleVBind.exp.content})`);
            (0, recast_1.visit)(ast.program, {
                visitObjectExpression(path) {
                    path.get('properties').each((property) => {
                        const node = property.node;
                        if (bt.isProperty(node) || bt.isObjectProperty(node)) {
                            const name = (0, recast_1.print)(property.get('key')).code;
                            const bindingDesc = bindingDescriptors.filter(t => t.name === name)[0];
                            simpleBindings.push(bindingDesc
                                ? bindingDesc
                                : {
                                    name,
                                    title: 'binding'
                                });
                        }
                        else {
                            rawVBind = true;
                        }
                    });
                    return false;
                }
            });
        }
        if (bindings.length) {
            slotDescriptor.bindings = simpleBindings.concat(bindings.reduce((acc, b) => {
                if (!rawVBind && (0, guards_1.isDirectiveNode)(b) && !b.arg) {
                    return acc;
                }
                // resolve name of binding
                const name = (0, guards_1.isDirectiveNode)(b) && b.arg && (0, guards_1.isSimpleExpressionNode)(b.arg)
                    ? b.arg.content
                    : `${(0, guards_1.isDirectiveNode)(b) ? 'v-' : ''}${b.name}`;
                const bindingDesc = bindingDescriptors.filter(t => t.name === name)[0];
                acc.push(bindingDesc ? bindingDesc : { name, title: 'binding' });
                return acc;
            }, []));
        }
    }
}
exports.default = slotHandler;
