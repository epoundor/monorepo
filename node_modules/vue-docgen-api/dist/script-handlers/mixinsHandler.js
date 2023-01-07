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
const getProperties_1 = __importDefault(require("./utils/getProperties"));
const resolveLocal_1 = __importDefault(require("../utils/resolveLocal"));
const parse_script_1 = require("../parse-script");
/**
 * Look in the mixin section of a component.
 * Parse the file mixins point to.
 * Add the necessary info to the current doc object.
 * Must be run first as mixins do not override components.
 * @param documentation
 * @param componentDefinition
 * @param astPath
 * @param opt
 */
function mixinsHandler(documentation, componentDefinition, astPath, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        // filter only mixins
        const mixinVariableNames = getMixinsVariableNames(componentDefinition);
        if (!mixinVariableNames || !mixinVariableNames.length) {
            return;
        }
        const variablesResolvedToCurrentFile = (0, resolveLocal_1.default)(astPath, mixinVariableNames);
        // get require / import statements for mixins
        const mixinVarToFilePath = (0, resolveRequired_1.default)(astPath, mixinVariableNames);
        yield mixinVariableNames.reduce((_, varName) => __awaiter(this, void 0, void 0, function* () {
            yield _;
            if (variablesResolvedToCurrentFile.get(varName)) {
                yield (0, parse_script_1.addDefaultAndExecuteHandlers)(variablesResolvedToCurrentFile, astPath, Object.assign(Object.assign({}, opt), { nameFilter: [varName] }), documentation);
            }
            else {
                // get each doc for each mixin using parse
                yield (0, documentRequiredComponents_1.default)(documentation, mixinVarToFilePath, 'mixin', Object.assign(Object.assign({}, opt), { nameFilter: [varName] }));
            }
            return;
        }), Promise.resolve());
    });
}
exports.default = mixinsHandler;
function getMixinsVariableNames(compDef) {
    const varNames = [];
    if (bt.isObjectExpression(compDef.node)) {
        const mixinProp = (0, getProperties_1.default)(compDef, 'mixins');
        const mixinPath = mixinProp.length ? mixinProp[0] : undefined;
        if (mixinPath) {
            const mixinPropertyValue = mixinPath.node.value && bt.isArrayExpression(mixinPath.node.value)
                ? mixinPath.node.value.elements
                : [];
            mixinPropertyValue.forEach((e) => {
                if (!e) {
                    return;
                }
                if (bt.isCallExpression(e)) {
                    e = e.callee;
                }
                if (bt.isIdentifier(e)) {
                    varNames.push(e.name);
                }
            });
        }
    }
    else if (bt.isClassDeclaration(compDef.node) &&
        compDef.node.superClass &&
        bt.isCallExpression(compDef.node.superClass) &&
        bt.isIdentifier(compDef.node.superClass.callee) &&
        compDef.node.superClass.callee.name.toLowerCase() === 'mixins') {
        return compDef.node.superClass.arguments.reduce((acc, a) => {
            if (bt.isIdentifier(a)) {
                acc.push(a.name);
            }
            return acc;
        }, []);
    }
    return varNames;
}
