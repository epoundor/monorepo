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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropsFromLiteralType = void 0;
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
const getTypeFromAnnotation_1 = __importStar(require("../utils/getTypeFromAnnotation"));
const propHandler_1 = require("../script-handlers/propHandler");
const tsUtils_1 = require("./utils/tsUtils");
/**
 * Extract information from an setup-style VueJs 3 component
 * about what props can be used with this component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
function setupPropHandler(documentation, componentDefinition, astPath, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        let propsDef;
        (0, recast_1.visit)(astPath.program, {
            visitCallExpression(nodePath) {
                const hasDefaults = bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'withDefaults';
                const normalizedNodePath = hasDefaults ? nodePath.get('arguments', 0) : nodePath;
                if (bt.isIdentifier(normalizedNodePath.node.callee) &&
                    normalizedNodePath.node.callee.name === 'defineProps') {
                    propsDef = normalizedNodePath.get('arguments', 0);
                    if (normalizedNodePath.node.typeParameters) {
                        const typeParamsPath = normalizedNodePath.get('typeParameters', 'params', 0);
                        if (bt.isTSTypeLiteral(typeParamsPath.node)) {
                            getPropsFromLiteralType(documentation, typeParamsPath.get('members'));
                        }
                        else if (bt.isTSTypeReference(typeParamsPath.node) &&
                            bt.isIdentifier(typeParamsPath.node.typeName)) {
                            // its a reference to an interface or type
                            const typeName = typeParamsPath.node.typeName.name; // extract the identifier
                            // find it's definition in the file
                            const definitionPath = (0, tsUtils_1.getTypeDefinitionFromIdentifier)(astPath, typeName);
                            // use the same process to exact info
                            if (definitionPath) {
                                getPropsFromLiteralType(documentation, definitionPath);
                            }
                        }
                    }
                    // add defaults from withDefaults
                    if (hasDefaults) {
                        const defaults = nodePath.get('arguments', 1);
                        if (bt.isObjectExpression(defaults.node)) {
                            defaults.get('properties').each((propPath) => {
                                const propName = propPath.get('key').node.name;
                                const propValue = propPath.get('value');
                                const propDescriptor = documentation.getPropDescriptor(propName);
                                propDescriptor.defaultValue = {
                                    func: false,
                                    value: (0, recast_1.print)(propValue).code
                                };
                            });
                        }
                    }
                }
                return false;
            }
        });
        // this is JavaScript typing
        if (propsDef) {
            yield (0, propHandler_1.describePropsFromValue)(documentation, propsDef, astPath, opt);
        }
    });
}
exports.default = setupPropHandler;
function getPropsFromLiteralType(documentation, typeParamsPathMembers) {
    typeParamsPathMembers.each((prop) => {
        if (bt.isTSPropertySignature(prop.node) && bt.isIdentifier(prop.node.key)) {
            const propDescriptor = documentation.getPropDescriptor(prop.node.key.name);
            (0, getTypeFromAnnotation_1.decorateItem)(prop, propDescriptor);
            propDescriptor.required = !prop.node.optional;
            propDescriptor.type = (0, getTypeFromAnnotation_1.default)(prop.get('typeAnnotation').value);
        }
    });
}
exports.getPropsFromLiteralType = getPropsFromLiteralType;
