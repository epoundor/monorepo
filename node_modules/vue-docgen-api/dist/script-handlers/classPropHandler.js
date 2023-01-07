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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bt = __importStar(require("@babel/types"));
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const getTypeFromAnnotation_1 = __importDefault(require("../utils/getTypeFromAnnotation"));
const transformTagsIntoObject_1 = __importDefault(require("../utils/transformTagsIntoObject"));
const propHandler_1 = __importStar(require("./propHandler"));
const getArgFromDecorator_1 = __importDefault(require("../utils/getArgFromDecorator"));
/**
 * Extracts prop information from a class-style VueJs component
 * @param documentation
 * @param path
 */
function classPropHandler(documentation, path, ast, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bt.isClassDeclaration(path.node)) {
            const config = (0, getArgFromDecorator_1.default)(path.get('decorators'));
            if (config && bt.isObjectExpression(config.node)) {
                yield (0, propHandler_1.default)(documentation, config, ast, opt);
            }
            path
                .get('body')
                .get('body')
                .filter((p) => bt.isClassProperty(p.node) && !!p.node.decorators)
                .forEach((propPath) => {
                const propDeco = (propPath.get('decorators') || []).filter((p) => {
                    const exp = bt.isCallExpression(p.node.expression)
                        ? p.node.expression.callee
                        : p.node.expression;
                    return bt.isIdentifier(exp) && exp.name === 'Prop';
                });
                if (!propDeco.length) {
                    return undefined;
                }
                const propName = bt.isIdentifier(propPath.node.key) ? propPath.node.key.name : undefined;
                if (!propName) {
                    return undefined;
                }
                const propDescriptor = documentation.getPropDescriptor(propName);
                // description
                const docBlock = (0, getDocblock_1.default)(propPath);
                const jsDoc = docBlock ? (0, getDoclets_1.default)(docBlock) : { description: '', tags: [] };
                const jsDocTags = jsDoc.tags ? jsDoc.tags : [];
                if (jsDocTags) {
                    propDescriptor.tags = (0, transformTagsIntoObject_1.default)(jsDocTags);
                }
                if (jsDoc.description) {
                    propDescriptor.description = jsDoc.description;
                }
                (0, propHandler_1.extractValuesFromTags)(propDescriptor);
                let litteralType;
                if (propPath.node.typeAnnotation) {
                    const values = !!bt.isTSTypeAnnotation(propPath.node.typeAnnotation) &&
                        (0, propHandler_1.getValuesFromTypeAnnotation)(propPath.node.typeAnnotation.typeAnnotation);
                    if (values) {
                        propDescriptor.values = values;
                        propDescriptor.type = { name: 'string' };
                        litteralType = 'string';
                    }
                    else {
                        // type
                        propDescriptor.type = (0, getTypeFromAnnotation_1.default)(propPath.node.typeAnnotation);
                    }
                }
                else if (propPath.node.value) {
                    propDescriptor.type = getTypeFromInitValue(propPath.node.value);
                }
                const propDecoratorPath = propDeco[0].get('expression');
                if (bt.isCallExpression(propDecoratorPath.node)) {
                    const propDecoratorArg = propDecoratorPath.get('arguments', 0);
                    if (propDecoratorArg) {
                        if (bt.isObjectExpression(propDecoratorArg.node)) {
                            const propsPath = propDecoratorArg
                                .get('properties')
                                .filter((p) => bt.isObjectProperty(p.node));
                            // if there is no type annotation, get it from the decorators arguments
                            if (!propPath.node.typeAnnotation) {
                                litteralType = (0, propHandler_1.describeType)(propsPath, propDescriptor);
                            }
                            (0, propHandler_1.describeDefault)(propsPath, propDescriptor, litteralType || '');
                            (0, propHandler_1.describeRequired)(propsPath, propDescriptor);
                            // this compares the node to its supposed args
                            // if it finds no args it will return itself
                        }
                        else if (propDecoratorArg.node !== propDecoratorPath.node) {
                            propDescriptor.type = (0, propHandler_1.getTypeFromTypePath)(propDecoratorArg);
                        }
                    }
                }
                return undefined;
            });
        }
        return Promise.resolve();
    });
}
exports.default = classPropHandler;
function getTypeFromInitValue(node) {
    if (bt.isNumericLiteral(node)) {
        return { name: 'number' };
    }
    if (bt.isStringLiteral(node) || bt.isTemplateLiteral(node)) {
        return { name: 'string' };
    }
    if (bt.isBooleanLiteral(node)) {
        return { name: 'boolean' };
    }
    return undefined;
}
