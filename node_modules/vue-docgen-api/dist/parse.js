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
exports.parseSource = exports.parseFile = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("util");
const parse_script_1 = __importDefault(require("./parse-script"));
const parseSFC_1 = __importDefault(require("./parseSFC"));
const read = (0, util_1.promisify)(fs_1.readFile);
const ERROR_EMPTY_DOCUMENT = 'The passed source is empty';
/**
 * parses the source at filePath and returns the doc
 * @param opt ParseOptions containing the filePath and the rest of the options
 * @param documentation documentation to be enriched if needed
 * @returns {object} documentation object
 */
function parseFile(opt, documentation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const source = yield read(opt.filePath, {
                encoding: 'utf-8'
            });
            return parseSource(source, opt, documentation);
        }
        catch (e) {
            throw Error(`Could not read file ${opt.filePath}`);
        }
    });
}
exports.parseFile = parseFile;
/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} opt path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
function parseSource(source, opt, documentation) {
    return __awaiter(this, void 0, void 0, function* () {
        // if jsx option is not mentionned, parse jsx in components
        opt.jsx = opt.jsx === undefined ? true : opt.jsx;
        const singleFileComponent = /\.vue$/i.test(path.extname(opt.filePath));
        if (source === '') {
            throw new Error(ERROR_EMPTY_DOCUMENT);
        }
        // if the parsed component is the result of a mixin or an extends
        if (documentation) {
            documentation.setOrigin(opt);
        }
        let docs;
        if (singleFileComponent) {
            docs = yield (0, parseSFC_1.default)(documentation, source, opt);
        }
        else {
            opt.lang = /\.tsx?$/i.test(path.extname(opt.filePath)) ? 'ts' : 'js';
            docs = (yield (0, parse_script_1.default)(source, opt, documentation, documentation !== undefined)) || [];
            if (docs.length === 1 && !docs[0].get('displayName')) {
                // give a component a display name if we can
                const displayName = path.basename(opt.filePath).replace(/\.\w+$/, '');
                const dirName = path.basename(path.dirname(opt.filePath));
                docs[0].set('displayName', displayName.toLowerCase() === 'index' ? dirName : displayName);
            }
        }
        if (documentation) {
            documentation.setOrigin({});
        }
        return docs;
    });
}
exports.parseSource = parseSource;
