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
const getProperties_1 = __importDefault(require("./utils/getProperties"));
/**
 * Extracts component name from an object-style VueJs component
 * @param documentation
 * @param path
 */
function displayNameHandler(documentation, compDef) {
    if (bt.isObjectExpression(compDef.node)) {
        const namePath = (0, getProperties_1.default)(compDef, 'name');
        // if no prop return
        if (!namePath.length) {
            return Promise.resolve();
        }
        const nameValuePath = namePath[0].get('value');
        const singleNameValuePath = !Array.isArray(nameValuePath) ? nameValuePath : null;
        let displayName = null;
        if (singleNameValuePath) {
            if (bt.isStringLiteral(singleNameValuePath.node)) {
                displayName = singleNameValuePath.node.value;
            }
            else if (bt.isIdentifier(singleNameValuePath.node)) {
                const nameConstId = singleNameValuePath.node.name;
                const program = compDef.parentPath.parentPath;
                if (program.name === 'body') {
                    displayName = getDeclaredConstantValue(program, nameConstId);
                }
            }
        }
        documentation.set('displayName', displayName);
    }
    return Promise.resolve();
}
exports.default = displayNameHandler;
function getDeclaredConstantValue(prog, nameConstId) {
    const body = prog.node.body;
    const globalVariableDeclarations = body.filter((node) => bt.isVariableDeclaration(node));
    const globalVariableExports = body
        .filter((node) => bt.isExportNamedDeclaration(node) && bt.isVariableDeclaration(node.declaration))
        .map((node) => node.declaration);
    const declarations = globalVariableDeclarations
        .concat(globalVariableExports)
        .reduce((a, declPath) => a.concat(declPath.declarations), []);
    const nodeDeclaratorArray = declarations.filter(d => bt.isIdentifier(d.id) && d.id.name === nameConstId);
    const nodeDeclarator = nodeDeclaratorArray.length ? nodeDeclaratorArray[0] : undefined;
    return nodeDeclarator && nodeDeclarator.init && bt.isStringLiteral(nodeDeclarator.init)
        ? nodeDeclarator.init.value
        : null;
}
