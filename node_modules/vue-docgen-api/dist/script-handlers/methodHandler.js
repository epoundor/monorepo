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
exports.setMethodDescriptor = void 0;
const bt = __importStar(require("@babel/types"));
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const getTypeFromAnnotation_1 = __importDefault(require("../utils/getTypeFromAnnotation"));
const transformTagsIntoObject_1 = __importDefault(require("../utils/transformTagsIntoObject"));
const getProperties_1 = __importDefault(require("./utils/getProperties"));
/**
 * Extracts methods information from an object-style VueJs component
 * @param documentation
 * @param path
 */
function methodHandler(documentation, path) {
    var _a;
    if (bt.isObjectExpression(path.node)) {
        const exposePath = (0, getProperties_1.default)(path, 'expose');
        const exposeArray = ((_a = exposePath[0]) === null || _a === void 0 ? void 0 : _a.get('value', 'elements').map((el) => el.value.value)) || [];
        const methodsPath = (0, getProperties_1.default)(path, 'methods');
        // if no method return
        if (!methodsPath.length) {
            return Promise.resolve();
        }
        const methodsObject = methodsPath[0].get('value');
        if (bt.isObjectExpression(methodsObject.node)) {
            methodsObject.get('properties').each((p) => {
                let methodName = '<anonymous>';
                if (bt.isObjectProperty(p.node) && bt.isIdentifier(p.node.key)) {
                    const val = p.get('value');
                    methodName = p.node.key.name;
                    if (!Array.isArray(val)) {
                        p = val;
                    }
                }
                methodName =
                    bt.isObjectMethod(p.node) && bt.isIdentifier(p.node.key) ? p.node.key.name : methodName;
                const docBlock = (0, getDocblock_1.default)(bt.isObjectMethod(p.node) ? p : p.parentPath);
                const jsDoc = docBlock ? (0, getDoclets_1.default)(docBlock) : { description: '', tags: [] };
                const jsDocTags = jsDoc.tags ? jsDoc.tags : [];
                // ignore the method if there is no public tag
                if (!jsDocTags.some((t) => t.title === 'access' && t.content === 'public') &&
                    !exposeArray.includes(methodName)) {
                    return;
                }
                const methodDescriptor = documentation.getMethodDescriptor(methodName);
                if (jsDoc.description) {
                    methodDescriptor.description = jsDoc.description;
                }
                setMethodDescriptor(methodDescriptor, p, jsDocTags);
            });
        }
    }
    return Promise.resolve();
}
exports.default = methodHandler;
function setMethodDescriptor(methodDescriptor, method, jsDocTags) {
    // params
    describeParams(method, methodDescriptor, jsDocTags.filter(tag => ['param', 'arg', 'argument'].indexOf(tag.title) >= 0));
    // returns
    describeReturns(method, methodDescriptor, jsDocTags.filter(t => t.title === 'returns'));
    // tags
    methodDescriptor.tags = (0, transformTagsIntoObject_1.default)(jsDocTags);
    return methodDescriptor;
}
exports.setMethodDescriptor = setMethodDescriptor;
function describeParams(methodPath, methodDescriptor, jsDocParamTags) {
    // if there is no parameter no need to parse them
    const fExp = methodPath.node;
    if (!fExp.params || !jsDocParamTags || (!fExp.params.length && !jsDocParamTags.length)) {
        return;
    }
    const params = [];
    fExp.params.forEach((par, i) => {
        let name;
        if (bt.isIdentifier(par)) {
            // simple params
            name = par.name;
        }
        else if (bt.isIdentifier(par.left)) {
            // es6 default params
            name = par.left.name;
        }
        else {
            // unrecognized pattern
            return;
        }
        const jsDocTags = jsDocParamTags.filter(tag => tag.name === name);
        let jsDocTag = jsDocTags.length ? jsDocTags[0] : undefined;
        // if tag is not namely described try finding it by its order
        if (!jsDocTag) {
            if (jsDocParamTags[i] && !jsDocParamTags[i].name) {
                jsDocTag = jsDocParamTags[i];
            }
        }
        const param = { name };
        if (jsDocTag) {
            if (jsDocTag.type) {
                param.type = jsDocTag.type;
            }
            if (jsDocTag.description) {
                param.description = jsDocTag.description;
            }
        }
        if (!param.type && par.typeAnnotation) {
            const type = (0, getTypeFromAnnotation_1.default)(par.typeAnnotation);
            if (type) {
                param.type = type;
            }
        }
        params.push(param);
    });
    // in case the arguments are abstracted (using the arguments keyword)
    if (!params.length) {
        jsDocParamTags.forEach(doc => {
            params.push(doc);
        });
    }
    if (params.length) {
        methodDescriptor.params = params;
    }
}
function describeReturns(methodPath, methodDescriptor, jsDocReturnTags) {
    if (jsDocReturnTags.length) {
        const ret = jsDocReturnTags[0];
        if (ret.name && ret.description) {
            ret.description = `${ret.name} ${ret.description}`;
        }
        methodDescriptor.returns = ret;
    }
    if (!methodDescriptor.returns || !methodDescriptor.returns.type) {
        const methodNode = methodPath.node;
        if (methodNode.returnType) {
            const type = (0, getTypeFromAnnotation_1.default)(methodNode.returnType);
            if (type) {
                methodDescriptor.returns = methodDescriptor.returns || {};
                methodDescriptor.returns.type = type;
            }
        }
    }
}
