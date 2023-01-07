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
Object.defineProperty(exports, "__esModule", { value: true });
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
function default_1(ast, variableFilter) {
    const variables = {};
    const importedVariablePaths = {};
    const exportAllFiles = [];
    // get imported variable names and filepath
    (0, recast_1.visit)(ast.program, {
        visitImportDeclaration(astPath) {
            if (!astPath.node.source) {
                return false;
            }
            const filePath = astPath.node.source.value;
            if (typeof filePath !== 'string') {
                return false;
            }
            const specifiers = astPath.get('specifiers');
            specifiers.each((s) => {
                const varName = s.node.local.name;
                const exportName = bt.isImportSpecifier(s.node) && bt.isIdentifier(s.node.imported)
                    ? s.node.imported.name
                    : 'default';
                importedVariablePaths[varName] = { filePath: [filePath], exportName };
            });
            return false;
        }
    });
    (0, recast_1.visit)(ast.program, {
        visitExportNamedDeclaration(astPath) {
            const specifiers = astPath.get('specifiers');
            if (astPath.node.source) {
                const filePath = astPath.node.source.value;
                if (typeof filePath !== 'string') {
                    return false;
                }
                specifiers.each((s) => {
                    if (bt.isIdentifier(s.node.exported)) {
                        const varName = s.node.exported.name;
                        const exportName = s.node.local ? s.node.local.name : varName;
                        if (variableFilter.indexOf(varName) > -1) {
                            variables[varName] = { filePath: [filePath], exportName };
                        }
                    }
                });
            }
            else {
                specifiers.each((s) => {
                    if (bt.isIdentifier(s.node.exported)) {
                        const varName = s.node.exported.name;
                        const middleName = s.node.local.name;
                        const importedVar = importedVariablePaths[middleName];
                        if (importedVar && variableFilter.indexOf(varName) > -1) {
                            variables[varName] = importedVar;
                        }
                    }
                });
            }
            return false;
        },
        visitExportDefaultDeclaration(astPath) {
            if (variableFilter.indexOf('default') > -1) {
                const middleNameDeclaration = astPath.node.declaration;
                if (bt.isIdentifier(middleNameDeclaration)) {
                    const middleName = middleNameDeclaration.name;
                    const importedVar = importedVariablePaths[middleName];
                    if (importedVar) {
                        variables.default = importedVar;
                    }
                }
            }
            return false;
        },
        visitExportAllDeclaration(astPath) {
            const newFilePath = astPath.get('source').node.value;
            exportAllFiles.push(newFilePath);
            return false;
        }
    });
    if (exportAllFiles.length) {
        variableFilter
            .filter(v => !variables[v])
            .forEach(exportName => {
            variables[exportName] = { filePath: exportAllFiles, exportName };
        });
    }
    return variables;
}
exports.default = default_1;
