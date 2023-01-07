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
exports.parseSource = exports.parseMulti = exports.parse = exports.getDefaultExample = exports.cleanName = exports.Documentation = exports.TemplateHandlers = exports.ScriptHandlers = void 0;
const Documentation_1 = __importDefault(require("./Documentation"));
exports.Documentation = Documentation_1.default;
const parse_1 = require("./parse");
const ScriptHandlers = __importStar(require("./script-handlers"));
exports.ScriptHandlers = ScriptHandlers;
const TemplateHandlers = __importStar(require("./template-handlers"));
exports.TemplateHandlers = TemplateHandlers;
var vue_inbrowser_compiler_independent_utils_1 = require("vue-inbrowser-compiler-independent-utils");
Object.defineProperty(exports, "cleanName", { enumerable: true, get: function () { return vue_inbrowser_compiler_independent_utils_1.cleanName; } });
Object.defineProperty(exports, "getDefaultExample", { enumerable: true, get: function () { return vue_inbrowser_compiler_independent_utils_1.getDefaultExample; } });
/**
 * Parse the component at filePath and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
function parse(filePath, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield parsePrimitive((options) => __awaiter(this, void 0, void 0, function* () { return yield (0, parse_1.parseFile)(options); }), filePath, opts))[0];
    });
}
exports.parse = parse;
/**
 * Parse all the components at filePath and returns an array of their
 * props, public methods, events and slot
 * @param filePath absolute path of the parsed file
 * @param opts
 */
function parseMulti(filePath, opts) {
    return parsePrimitive((options) => __awaiter(this, void 0, void 0, function* () { return yield (0, parse_1.parseFile)(options); }), filePath, opts);
}
exports.parseMulti = parseMulti;
/**
 * Parse the `source` assuming that it is located at `filePath` and return props, public methods, events and slots
 * @param source source code to be parsed
 * @param filePath absolute path of the parsed file
 * @param opts
 */
function parseSource(source, filePath, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield parsePrimitive((options) => __awaiter(this, void 0, void 0, function* () { return yield (0, parse_1.parseSource)(source, options); }), filePath, opts))[0];
    });
}
exports.parseSource = parseSource;
function isOptionsObject(opts) {
    return (!!opts &&
        (!!opts.alias ||
            opts.jsx !== undefined ||
            !!opts.addScriptHandlers ||
            !!opts.addTemplateHandlers));
}
function parsePrimitive(createDocs, filePath, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = isOptionsObject(opts)
            ? Object.assign(Object.assign({ validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath) }, opts), { filePath }) : {
            filePath,
            alias: opts,
            validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
        };
        const docs = yield createDocs(options);
        return docs.map(d => d.toObject());
    });
}
