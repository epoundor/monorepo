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
const recast_1 = require("recast");
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const getTypeFromAnnotation_1 = __importDefault(require("../utils/getTypeFromAnnotation"));
const eventHandler_1 = require("../script-handlers/eventHandler");
const tsUtils_1 = require("./utils/tsUtils");
/**
 * Extract information from an setup-style VueJs 3 component
 * about what events can be emitted
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
function setupEventHandler(documentation, componentDefinition, astPath, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        function buildEventDescriptor(eventName, eventPath) {
            var _a;
            const eventDescriptor = documentation.getEventDescriptor(eventName);
            const typeParam = eventPath.get('parameters', 1, 'typeAnnotation');
            if (bt.isTSTypeAnnotation(typeParam.node)) {
                const type = (_a = (0, getTypeFromAnnotation_1.default)(typeParam.node)) === null || _a === void 0 ? void 0 : _a.name;
                if (type) {
                    eventDescriptor.type = { names: [type] };
                }
            }
            const docBlock = (0, getDocblock_1.default)(eventPath);
            if (docBlock) {
                const jsDoc = (0, getDoclets_1.default)(docBlock);
                (0, eventHandler_1.setEventDescriptor)(eventDescriptor, jsDoc);
            }
        }
        function readEventsTSTypes(refs) {
            refs.each((member) => {
                if (bt.isTSCallSignatureDeclaration(member.node)) {
                    const firstParam = member.node.parameters[0].typeAnnotation;
                    if (bt.isTSTypeAnnotation(firstParam) &&
                        bt.isTSLiteralType(firstParam.typeAnnotation) &&
                        !bt.isUnaryExpression(firstParam.typeAnnotation.literal) &&
                        typeof firstParam.typeAnnotation.literal.value === 'string') {
                        buildEventDescriptor(firstParam.typeAnnotation.literal.value, member);
                    }
                }
            });
        }
        (0, recast_1.visit)(astPath.program, {
            visitCallExpression(nodePath) {
                if (bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'defineEmits') {
                    // Array of string where no type is specified
                    if (bt.isArrayExpression(nodePath.get('arguments', 0).node)) {
                        nodePath.get('arguments', 0, 'elements').each((element) => {
                            if (bt.isStringLiteral(element.node)) {
                                buildEventDescriptor(element.node.value, element);
                            }
                        });
                    }
                    // Object where the arguments are validated manually
                    if (bt.isObjectExpression(nodePath.get('arguments', 0).node)) {
                        nodePath.get('arguments', 0, 'properties').each((element) => {
                            if (bt.isObjectProperty(element.node) && bt.isIdentifier(element.node.key)) {
                                buildEventDescriptor(element.node.key.name, element);
                            }
                        });
                    }
                    // typescript validation of arguments
                    if (bt.isTSTypeParameterInstantiation(nodePath.get('typeParameters').node)) {
                        nodePath.get('typeParameters', 'params').each((param) => {
                            if (bt.isTSTypeLiteral(param.node)) {
                                readEventsTSTypes(param.get('members'));
                            }
                            else if (bt.isTSTypeReference(param.node) && bt.isIdentifier(param.node.typeName)) {
                                const resolvedType = (0, tsUtils_1.getTypeDefinitionFromIdentifier)(astPath, param.node.typeName.name);
                                if (resolvedType) {
                                    readEventsTSTypes(resolvedType);
                                }
                            }
                        });
                    }
                }
                return false;
            }
        });
    });
}
exports.default = setupEventHandler;
