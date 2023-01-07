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
const fs_1 = require("fs");
const util_1 = require("util");
const ast_types_1 = require("ast-types");
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
const babel_parser_1 = __importDefault(require("../babel-parser"));
const cacher_1 = __importDefault(require("./cacher"));
const read = (0, util_1.promisify)(fs_1.readFile);
function getPathOfExportedValue(pathResolver, exportName, filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = options.lang === 'ts' ? ['typescript'] : ['flow'];
        if (options.jsx) {
            plugins.push('jsx');
        }
        let filePathIndex = filePath.length;
        let exportedPath = undefined;
        while (filePathIndex--) {
            const currentFilePath = pathResolver(filePath[filePathIndex]);
            if (!currentFilePath) {
                return undefined;
            }
            let filePlugins = plugins;
            // Fixes SFCs written in JS having their imported modules being assumed to also be JS
            if (/.tsx?$/.test(currentFilePath)) {
                filePlugins = filePlugins.map(plugin => plugin === 'flow' ? 'typescript' : plugin);
            }
            const source = yield read(currentFilePath, {
                encoding: 'utf-8'
            });
            const ast = (0, cacher_1.default)(() => (0, recast_1.parse)(source, { parser: (0, babel_parser_1.default)({ plugins: filePlugins }) }), source);
            (0, ast_types_1.visit)(ast, {
                visitExportNamedDeclaration(p) {
                    const masterDeclaration = p.node.declaration;
                    if (masterDeclaration && bt.isVariableDeclaration(masterDeclaration)) {
                        masterDeclaration.declarations.forEach((declaration, i) => {
                            if (bt.isVariableDeclarator(declaration) &&
                                bt.isIdentifier(declaration.id) &&
                                declaration.id.name === exportName) {
                                exportedPath = p.get('declaration', 'declarations', i, 'init');
                            }
                        });
                    }
                    return false;
                },
                visitExportDefaultDeclaration(p) {
                    if (exportName === 'default') {
                        const masterDeclaration = p.node.declaration;
                        if (masterDeclaration) {
                            exportedPath = p.get('declaration');
                        }
                    }
                    return false;
                }
            });
            if (exportedPath) {
                return exportedPath;
            }
        }
        return undefined;
    });
}
exports.default = getPathOfExportedValue;
