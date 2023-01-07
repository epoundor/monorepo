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
exports.resolveIEV = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("util");
const recast_1 = require("recast");
const ts_map_1 = __importDefault(require("ts-map"));
const babel_parser_1 = __importDefault(require("../babel-parser"));
const cacher_1 = __importDefault(require("./cacher"));
const resolveImmediatelyExported_1 = __importDefault(require("./resolveImmediatelyExported"));
const read = (0, util_1.promisify)(fs_1.readFile);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hash = require('hash-sum');
/**
 * Recursively resolves specified variables to their actual files
 * Useful when using intermeriary files like this
 *
 * ```js
 * export mixin from "path/to/mixin"
 * ```
 *
 * @param pathResolver function to resolve relative to absolute path
 * @param varToFilePath set of variables to be resolved (will be mutated into the final mapping)
 */
function recursiveResolveIEV(pathResolver, varToFilePath, validExtends) {
    return __awaiter(this, void 0, void 0, function* () {
        // resolve imediately exported variable as many layers as they are burried
        let hashBefore;
        do {
            hashBefore = hash(varToFilePath);
            // in this case I need to resolve IEV in sequence in case they are defined multiple times
            // eslint-disable-next-line no-await-in-loop
            yield resolveIEV(pathResolver, varToFilePath, validExtends);
        } while (hashBefore !== hash(varToFilePath));
    });
}
exports.default = recursiveResolveIEV;
/**
 * Resolves specified variables to their actual files
 * Useful when using intermeriary files like this
 *
 * ```js
 * export mixin from "path/to/mixin"
 * ```
 *
 * @param pathResolver function to resolve relative to absolute path
 * @param varToFilePath set of variables to be resolved (will be mutated into the final mapping)
 */
function resolveIEV(pathResolver, varToFilePath, validExtends) {
    return __awaiter(this, void 0, void 0, function* () {
        // First, create a map from filepath to localName and exportedName
        // key: filepath, content: {key: localName, content: exportedName}
        const filePathToVars = new ts_map_1.default();
        Object.keys(varToFilePath).forEach(k => {
            const exportedVariable = varToFilePath[k];
            exportedVariable.filePath.forEach(filePath => {
                const exportToLocalMap = filePathToVars.get(filePath) || new ts_map_1.default();
                exportToLocalMap.set(k, exportedVariable.exportName);
                filePathToVars.set(filePath, exportToLocalMap);
            });
        });
        // then roll though this map and replace varToFilePath elements with their final destinations
        // {
        //	nameOfVariable:{filePath:['filesWhereToFindIt'], exportedName:'nameUsedInExportThatCanBeUsedForFiltering'}
        // }
        yield Promise.all(filePathToVars.entries().map(([filePath, exportToLocal]) => __awaiter(this, void 0, void 0, function* () {
            if (filePath && exportToLocal) {
                const exportedVariableNames = [];
                exportToLocal.forEach(exportedName => {
                    if (exportedName) {
                        exportedVariableNames.push(exportedName);
                    }
                });
                try {
                    const fullFilePath = pathResolver(filePath);
                    if (!fullFilePath || !validExtends(fullFilePath)) {
                        return;
                    }
                    const source = yield read(fullFilePath, {
                        encoding: 'utf-8'
                    });
                    const astRemote = (0, cacher_1.default)(() => (0, recast_1.parse)(source, { parser: (0, babel_parser_1.default)() }), source);
                    const returnedVariables = (0, resolveImmediatelyExported_1.default)(astRemote, exportedVariableNames);
                    if (Object.keys(returnedVariables).length) {
                        exportToLocal.forEach((exported, local) => {
                            if (exported && local) {
                                const aliasedVariable = returnedVariables[exported];
                                if (aliasedVariable) {
                                    aliasedVariable.filePath = aliasedVariable.filePath
                                        .map(p => pathResolver(p, path.dirname(fullFilePath)))
                                        .filter(a => a);
                                    varToFilePath[local] = aliasedVariable;
                                }
                            }
                        });
                    }
                }
                catch (e) {
                    // ignore load errors
                }
            }
        })));
    });
}
exports.resolveIEV = resolveIEV;
