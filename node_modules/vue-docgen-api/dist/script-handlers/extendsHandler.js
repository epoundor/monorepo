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
const resolveRequired_1 = __importDefault(require("../utils/resolveRequired"));
const documentRequiredComponents_1 = __importDefault(require("../utils/documentRequiredComponents"));
const resolveLocal_1 = __importDefault(require("../utils/resolveLocal"));
const parse_script_1 = require("../parse-script");
/**
 * Returns documentation of the component referenced in the extends property of the component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
function extendsHandler(documentation, componentDefinition, astPath, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        const extendsVariableName = getExtendsVariableName(componentDefinition);
        // if there is no extends or extends is a direct require
        if (!extendsVariableName) {
            return;
        }
        const variablesResolvedToCurrentFile = (0, resolveLocal_1.default)(astPath, [extendsVariableName]);
        if (variablesResolvedToCurrentFile.get(extendsVariableName)) {
            yield (0, parse_script_1.addDefaultAndExecuteHandlers)(variablesResolvedToCurrentFile, astPath, Object.assign(Object.assign({}, opt), { nameFilter: [extendsVariableName] }), documentation);
        }
        else {
            // get all require / import statements
            const extendsFilePath = (0, resolveRequired_1.default)(astPath, [extendsVariableName]);
            // get each doc for each mixin using parse
            yield (0, documentRequiredComponents_1.default)(documentation, extendsFilePath, 'extends', opt);
        }
    });
}
exports.default = extendsHandler;
function getExtendsVariableName(compDef) {
    const extendsVariable = compDef &&
        bt.isClassDeclaration(compDef.node) &&
        compDef.node.superClass &&
        bt.isIdentifier(compDef.node.superClass)
        ? compDef.get('superClass')
        : getExtendsVariableNameFromCompDef(compDef);
    if (extendsVariable) {
        const extendsValue = bt.isProperty(extendsVariable.node)
            ? extendsVariable.node.value
            : extendsVariable.node;
        return extendsValue && bt.isIdentifier(extendsValue) ? extendsValue.name : undefined;
    }
    return undefined;
}
function getExtendsVariableNameFromCompDef(compDef) {
    if (!compDef) {
        return undefined;
    }
    const compDefProperties = compDef.get('properties');
    const pathExtends = compDefProperties.value
        ? compDefProperties.filter((p) => bt.isIdentifier(p.node.key) && p.node.key.name === 'extends')
        : [];
    return pathExtends.length ? pathExtends[0] : undefined;
}
