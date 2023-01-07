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
const ts_map_1 = __importDefault(require("ts-map"));
const path = __importStar(require("path"));
const recursiveResolveIEV_1 = __importDefault(require("../utils/recursiveResolveIEV"));
const parse_1 = require("../parse");
const makePathResolver_1 = __importDefault(require("./makePathResolver"));
/**
 * Document all components in varToFilePath in documentation
 * Instead of giving it only one component file, here we give it a whole set of variable -> file
 *
 * @param documentation if omitted (undefined), it will return all docs in an array
 * @param varToFilePath variable of object to document
 * @param originObject to build the origin flag
 * @param opt parsing options
 */
function documentRequiredComponents(documentation, varToFilePath, originObject, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalDirName = path.dirname(opt.filePath);
        const pathResolver = (0, makePathResolver_1.default)(originalDirName, opt.alias, opt.modules);
        // resolve where components are through immediately exported variables
        yield (0, recursiveResolveIEV_1.default)(pathResolver, varToFilePath, opt.validExtends);
        // if we are in a mixin or an extend we want to add
        // all props on the current doc, instead of creating another one
        if (originObject && documentation) {
            return [
                yield enrichDocumentation(documentation, varToFilePath, originObject, opt, pathResolver)
            ];
        }
        const files = new ts_map_1.default();
        for (const varName of Object.keys(varToFilePath)) {
            const { filePath, exportName } = varToFilePath[varName];
            filePath.forEach(p => {
                const fullFilePath = pathResolver(p);
                if (fullFilePath && opt.validExtends(fullFilePath)) {
                    const vars = files.get(fullFilePath) || [];
                    vars.push({ exportName, varName });
                    files.set(fullFilePath, vars);
                }
            });
        }
        const docsArray = yield Promise.all(files.keys().map((fullFilePath) => __awaiter(this, void 0, void 0, function* () {
            const vars = files.get(fullFilePath) || [];
            const temporaryDocs = yield (0, parse_1.parseFile)(Object.assign(Object.assign({}, opt), { filePath: fullFilePath, nameFilter: vars.map(v => v.exportName) }), documentation);
            // update varnames with the original iev names
            temporaryDocs.forEach(d => d.set('exportName', (vars.find(v => v.exportName === d.get('exportName')) || {}).varName));
            return temporaryDocs;
        })));
        // flatten array of docs
        return docsArray.reduce((a, i) => a.concat(i), []);
    });
}
exports.default = documentRequiredComponents;
function enrichDocumentation(documentation, varToFilePath, originObject, opt, pathResolver) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Object.keys(varToFilePath).reduce((_, varName) => __awaiter(this, void 0, void 0, function* () {
            yield _;
            const { filePath, exportName } = varToFilePath[varName];
            // If there is more than one filepath for a variable, only one
            // will be valid. if not the parser of the browser will shout.
            // We therefore do not care in which order the filepath go as
            // long as we follow the variables order
            yield Promise.all(filePath.map((p) => __awaiter(this, void 0, void 0, function* () {
                const fullFilePath = pathResolver(p);
                if (fullFilePath && opt.validExtends(fullFilePath)) {
                    try {
                        const originVar = {
                            [originObject]: {
                                name: '-',
                                path: path.relative(path.dirname(documentation.componentFullfilePath), fullFilePath)
                            }
                        };
                        yield (0, parse_1.parseFile)(Object.assign(Object.assign(Object.assign({}, opt), { filePath: fullFilePath, nameFilter: [exportName] }), originVar), documentation);
                        if (documentation && originVar[originObject]) {
                            originVar[originObject].name =
                                documentation.get('displayName') || documentation.get('exportName');
                            documentation.set('displayName', null);
                        }
                    }
                    catch (e) {
                        // eat the error
                    }
                }
            })));
        }), Promise.resolve());
        return documentation;
    });
}
