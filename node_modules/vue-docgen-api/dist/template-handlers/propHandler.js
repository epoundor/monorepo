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
const extractLeadingComment_1 = __importDefault(require("../utils/extractLeadingComment"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const getTemplateExpressionAST_1 = __importDefault(require("../utils/getTemplateExpressionAST"));
const guards_1 = require("../utils/guards");
function propTemplateHandler(documentation, templateAst, siblings, options) {
    if (options.functional) {
        propsInAttributes(documentation, templateAst, siblings);
        propsInInterpolation(documentation, templateAst, siblings);
    }
}
exports.default = propTemplateHandler;
function propsInAttributes(documentation, templateAst, siblings) {
    if ((0, guards_1.isBaseElementNode)(templateAst)) {
        templateAst.props.forEach(prop => {
            if ((0, guards_1.isDirectiveNode)(prop) && (0, guards_1.isSimpleExpressionNode)(prop.exp)) {
                getPropsFromExpression(documentation, templateAst, prop.exp, siblings);
            }
        });
    }
}
function propsInInterpolation(documentation, templateAst, siblings) {
    if ((0, guards_1.isInterpolationNode)(templateAst) && (0, guards_1.isSimpleExpressionNode)(templateAst.content)) {
        getPropsFromExpression(documentation, templateAst, templateAst.content, siblings);
    }
}
function getPropsFromExpression(documentation, item, exp, siblings) {
    const expression = exp.content;
    const ast = (0, getTemplateExpressionAST_1.default)(expression);
    const propsFound = [];
    (0, recast_1.visit)(ast.program, {
        visitMemberExpression(path) {
            const obj = path.node ? path.node.object : undefined;
            const propName = path.node ? path.node.property : undefined;
            if (obj &&
                propName &&
                bt.isIdentifier(obj) &&
                obj.name === 'props' &&
                bt.isIdentifier(propName)) {
                const pName = propName.name;
                const p = documentation.getPropDescriptor(pName);
                propsFound.push(pName);
                p.type = { name: 'undefined' };
            }
            return false;
        }
    });
    if (propsFound.length) {
        const comments = (0, extractLeadingComment_1.default)(siblings, item);
        comments.forEach(comment => {
            const doclets = (0, getDoclets_1.default)(comment);
            const propTags = doclets.tags && doclets.tags.filter(d => d.title === 'prop');
            if (propTags && propTags.length) {
                propsFound.forEach(pName => {
                    const propTag = propTags.filter(pt => pt.name === pName);
                    if (propTag.length) {
                        const p = documentation.getPropDescriptor(pName);
                        p.type = propTag[0].type;
                        if (typeof propTag[0].description === 'string') {
                            p.description = propTag[0].description;
                        }
                    }
                });
            }
        });
    }
}
