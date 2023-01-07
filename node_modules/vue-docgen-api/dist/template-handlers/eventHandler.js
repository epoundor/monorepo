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
const eventHandler_1 = require("../script-handlers/eventHandler");
const getTemplateExpressionAST_1 = __importDefault(require("../utils/getTemplateExpressionAST"));
const guards_1 = require("../utils/guards");
function eventHandler(documentation, templateAst, siblings) {
    if ((0, guards_1.isBaseElementNode)(templateAst)) {
        templateAst.props.forEach(prop => {
            if ((0, guards_1.isDirectiveNode)(prop)) {
                if (prop.name === 'on') {
                    // only look at expressions
                    const expression = prop.exp;
                    if ((0, guards_1.isSimpleExpressionNode)(expression)) {
                        getEventsFromExpression(templateAst, expression.content, documentation, siblings);
                    }
                }
            }
        });
    }
}
exports.default = eventHandler;
function getEventsFromExpression(item, expression, documentation, siblings) {
    const ast = (0, getTemplateExpressionAST_1.default)(expression);
    const eventsFound = [];
    (0, recast_1.visit)(ast.program, {
        visitCallExpression(path) {
            const obj = path.node ? path.node.callee : undefined;
            const args = path.node ? path.node.arguments : undefined;
            if (obj && args && bt.isIdentifier(obj) && obj.name === '$emit' && args.length) {
                const evtName = bt.isStringLiteral(args[0]) ? args[0].value : '<undefined>';
                documentation.getEventDescriptor(evtName);
                eventsFound.push(evtName);
                return false;
            }
            this.traverse(path);
            return undefined;
        }
    });
    if (eventsFound.length) {
        const leadingComments = (0, extractLeadingComment_1.default)(siblings, item);
        if (leadingComments.length) {
            eventsFound.forEach(evtName => {
                leadingComments.forEach(comment => {
                    const doclets = (0, getDoclets_1.default)(comment);
                    const eventTags = doclets.tags && doclets.tags.filter(d => d.title === 'event');
                    if (!(eventTags &&
                        eventTags.length &&
                        eventTags.findIndex(et => et.content === evtName) > -1)) {
                        return;
                    }
                    const e = documentation.getEventDescriptor(evtName);
                    (0, eventHandler_1.setEventDescriptor)(e, doclets);
                });
            });
        }
    }
}
