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
exports.addDefaultAndExecuteHandlers = void 0;
const recast_1 = require("recast");
const babel_parser_1 = __importDefault(require("./babel-parser"));
const Documentation_1 = __importDefault(require("./Documentation"));
const cacher_1 = __importDefault(require("./utils/cacher"));
const resolveExportedComponent_1 = __importDefault(require("./utils/resolveExportedComponent"));
const documentRequiredComponents_1 = __importDefault(require("./utils/documentRequiredComponents"));
const script_handlers_1 = __importStar(require("./script-handlers"));
const ERROR_MISSING_DEFINITION = 'No suitable component definition found';
function parseScript(source, options, documentation, forceSingleExport = false, noNeedForExport = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = options.lang === 'ts' ? ['typescript'] : ['flow'];
        if (options.jsx) {
            plugins.push('jsx');
        }
        const ast = (0, cacher_1.default)(() => (0, recast_1.parse)(source, { parser: (0, babel_parser_1.default)({ plugins }) }), source);
        if (!ast) {
            throw new Error(`Unable to parse empty file "${options.filePath}"`);
        }
        const [componentDefinitions, ievSet] = (0, resolveExportedComponent_1.default)(ast);
        if (componentDefinitions.size === 0 && noNeedForExport) {
            componentDefinitions.set('default', ast.program.body[0]);
        }
        if (componentDefinitions.size === 0) {
            // if there is any immediately exported variable
            // resolve their documentations
            const docs = yield (0, documentRequiredComponents_1.default)(documentation, ievSet, undefined, options);
            // if we do not find any components, throw
            if (!docs.length) {
                throw new Error(`${ERROR_MISSING_DEFINITION} on "${options.filePath}"`);
            }
            else {
                return docs;
            }
        }
        return addDefaultAndExecuteHandlers(componentDefinitions, ast, options, documentation, forceSingleExport);
    });
}
exports.default = parseScript;
function addDefaultAndExecuteHandlers(componentDefinitions, ast, options, documentation, forceSingleExport = false) {
    const handlers = [
        ...(options.scriptHandlers || script_handlers_1.default),
        ...(options.addScriptHandlers || [])
    ];
    return executeHandlers(options.scriptPreHandlers || script_handlers_1.preHandlers, handlers, componentDefinitions, ast, options, forceSingleExport, documentation);
}
exports.addDefaultAndExecuteHandlers = addDefaultAndExecuteHandlers;
function executeHandlers(preHandlers, localHandlers, componentDefinitions, ast, opt, forceSingleExport, documentation) {
    return __awaiter(this, void 0, void 0, function* () {
        const compDefs = componentDefinitions
            .keys()
            .filter(name => name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1));
        if (forceSingleExport && compDefs.length > 1) {
            throw Error('vue-docgen-api: multiple exports in a component file are not handled by docgen.parse, Please use "docgen.parseMulti" instead');
        }
        const docs = yield Promise.all(compDefs.map((name) => __awaiter(this, void 0, void 0, function* () {
            // If there are multiple exports and an initial documentation,
            // it means the doc is coming from an SFC template.
            // Only enrich the doc attached to the default export
            // NOTE: module.exports is normalized to default
            const doc = (compDefs.length > 1 && name !== 'default' ? undefined : documentation) ||
                new Documentation_1.default(opt.filePath);
            const compDef = componentDefinitions.get(name);
            // execute all prehandlers in order
            yield preHandlers.reduce((_, handler) => __awaiter(this, void 0, void 0, function* () {
                yield _;
                if (typeof handler === 'function') {
                    return yield handler(doc, compDef, ast, opt);
                }
            }), Promise.resolve());
            yield Promise.all(localHandlers.map((handler) => __awaiter(this, void 0, void 0, function* () { return yield handler(doc, compDef, ast, opt); })));
            // end with setting of exportname
            // to avoid dependencies names bleeding on the main components,
            // do this step at the end of the function
            doc.set('exportName', name);
            return doc;
        })));
        // default component first so in multiple exports in parse it is returned
        return docs.sort((a, b) => a.get('exportName') === 'default' ? -1 : b.get('exportName') === 'default' ? 1 : 0);
    });
}
