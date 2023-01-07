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
const path = __importStar(require("path"));
const ast_types_1 = require("ast-types");
const makePathResolver_1 = __importDefault(require("../../utils/makePathResolver"));
const resolveRequired_1 = __importDefault(require("../../utils/resolveRequired"));
const recursiveResolveIEV_1 = __importDefault(require("../../utils/recursiveResolveIEV"));
const getPathFromExportedValue_1 = __importDefault(require("../../utils/getPathFromExportedValue"));
/**
 * Determines if node contains the value -1
 * @param node
 */
function isMinusOne(node) {
    return (bt.isUnaryExpression(node) &&
        node.operator === '-' &&
        bt.isNumericLiteral(node.argument) &&
        node.argument.value === 1);
}
function parseValidatorForValues(validatorNode, ast, options) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Resolves a variable value from its identifier (name)
         * @param identifierName
         */
        function resolveValueFromIdentifier(identifierName) {
            return __awaiter(this, void 0, void 0, function* () {
                let varPath;
                (0, ast_types_1.visit)(ast, {
                    visitVariableDeclaration(p) {
                        p.node.declarations.forEach((decl, i) => {
                            if (bt.isVariableDeclarator(decl) &&
                                bt.isIdentifier(decl.id) &&
                                decl.id.name === identifierName) {
                                varPath = p.get('declarations', i, 'init');
                            }
                        });
                        return false;
                    }
                });
                if (varPath && bt.isArrayExpression(varPath.node)) {
                    return varPath.node.elements.map((e) => e.value).filter(e => e);
                }
                const varToFilePath = (0, resolveRequired_1.default)(ast, [identifierName]);
                const originalDirName = path.dirname(options.filePath);
                const pathResolver = (0, makePathResolver_1.default)(originalDirName, options.alias, options.modules);
                // resolve where sources are through immediately exported variables
                yield (0, recursiveResolveIEV_1.default)(pathResolver, varToFilePath, options.validExtends);
                if (varToFilePath[identifierName]) {
                    // load value found from read file
                    const { exportName, filePath } = varToFilePath[identifierName];
                    const p = yield (0, getPathFromExportedValue_1.default)(pathResolver, exportName, filePath, options);
                    if (p && bt.isArrayExpression(p.node)) {
                        return p.node.elements.map((e) => e.value).filter(e => e);
                    }
                }
                return undefined;
            });
        }
        function extractStringArray(valuesObjectNode) {
            return __awaiter(this, void 0, void 0, function* () {
                return bt.isIdentifier(valuesObjectNode)
                    ? yield resolveValueFromIdentifier(valuesObjectNode.name)
                    : bt.isArrayExpression(valuesObjectNode)
                        ? valuesObjectNode.elements.map((e) => e.value).filter(e => e)
                        : undefined;
            });
        }
        const returnedExpression = (bt.isMethod(validatorNode) || bt.isFunctionExpression(validatorNode)) &&
            validatorNode.body.body.length === 1 &&
            bt.isReturnStatement(validatorNode.body.body[0])
            ? validatorNode.body.body[0].argument
            : bt.isArrowFunctionExpression(validatorNode)
                ? validatorNode.body
                : undefined;
        const varName = validatorNode.params && bt.isIdentifier(validatorNode.params[0])
            ? validatorNode.params[0].name
            : undefined;
        if (bt.isBinaryExpression(returnedExpression)) {
            let valuesNode;
            switch (returnedExpression.operator) {
                case '>':
                    if (isMinusOne(returnedExpression.right)) {
                        valuesNode = returnedExpression.left;
                    }
                    break;
                case '<':
                    if (bt.isExpression(returnedExpression.left) && isMinusOne(returnedExpression.left)) {
                        valuesNode = returnedExpression.right;
                    }
                    break;
                case '!==':
                case '!=':
                    if (bt.isExpression(returnedExpression.left) && isMinusOne(returnedExpression.left)) {
                        valuesNode = returnedExpression.right;
                    }
                    else if (isMinusOne(returnedExpression.right)) {
                        valuesNode = returnedExpression.left;
                    }
                    break;
                default:
                    return undefined;
            }
            const values = bt.isCallExpression(valuesNode) &&
                bt.isIdentifier(valuesNode.arguments[0]) &&
                varName === valuesNode.arguments[0].name &&
                bt.isMemberExpression(valuesNode.callee) &&
                bt.isIdentifier(valuesNode.callee.property) &&
                valuesNode.callee.property.name === 'indexOf'
                ? yield extractStringArray(valuesNode.callee.object)
                : undefined;
            return values;
        }
        else if (bt.isCallExpression(returnedExpression)) {
            if (bt.isMemberExpression(returnedExpression.callee) &&
                bt.isIdentifier(returnedExpression.callee.property) &&
                returnedExpression.callee.property.name === 'includes') {
                return extractStringArray(returnedExpression.callee.object);
            }
        }
        return undefined;
    });
}
exports.default = parseValidatorForValues;
