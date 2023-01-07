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
const compiler_sfc_1 = require("@vue/compiler-sfc");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const util_1 = require("util");
const template_handlers_1 = __importDefault(require("./template-handlers"));
const cacher_1 = __importDefault(require("./utils/cacher"));
const parse_template_1 = __importDefault(require("./parse-template"));
const Documentation_1 = __importDefault(require("./Documentation"));
const parse_script_1 = __importDefault(require("./parse-script"));
const makePathResolver_1 = __importDefault(require("./utils/makePathResolver"));
const script_setup_handlers_1 = __importDefault(require("./script-setup-handlers"));
const read = (0, util_1.promisify)(fs_1.readFile);
function parseSFC(initialDoc, source, opt) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let documentation = initialDoc;
        // create a custom path resolver to resolve webpack aliases
        const pathResolver = (0, makePathResolver_1.default)(path.dirname(opt.filePath), opt.alias, opt.modules);
        // use padding so that errors are displayed at the correct line
        const { descriptor: parts } = (0, cacher_1.default)(() => (0, compiler_sfc_1.parse)(source, { pad: 'line' }), source);
        // get slots and props from template
        if (parts.template) {
            const extTemplSrc = (_b = (_a = parts === null || parts === void 0 ? void 0 : parts.template) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.src;
            if (extTemplSrc && typeof extTemplSrc === 'string') {
                const extTemplSrcAbs = pathResolver(extTemplSrc);
                const extTemplSource = extTemplSrcAbs
                    ? yield read(extTemplSrcAbs, {
                        encoding: 'utf-8'
                    })
                    : // if we don't have a content to bind
                        // leave the template alone
                        false;
                if (extTemplSource) {
                    parts.template.content = extTemplSource;
                }
            }
            const addTemplateHandlers = opt.addTemplateHandlers || [];
            documentation = initialDoc || new Documentation_1.default(opt.filePath);
            (0, parse_template_1.default)(parts.template, documentation, [...template_handlers_1.default, ...addTemplateHandlers], opt);
        }
        if (parts.customBlocks) {
            documentation = documentation || new Documentation_1.default(opt.filePath);
            const docsBlocks = parts.customBlocks
                .filter(block => block.type === 'docs' && block.content && block.content.length)
                .map(block => block.content.trim());
            if (docsBlocks.length) {
                documentation.setDocsBlocks(docsBlocks);
            }
        }
        let docs = documentation ? [documentation] : [];
        if (parts.scriptSetup) {
            docs = yield parseScriptTag(parts.scriptSetup, pathResolver, opt, documentation, initialDoc !== undefined, true, parts.script ? parts.script.content : '');
        }
        else if (parts.script) {
            docs = yield parseScriptTag(parts.script, pathResolver, opt, documentation, initialDoc !== undefined);
        }
        if (documentation && !documentation.get('displayName')) {
            // a component should always have a display name
            // give a component a display name if we can
            const displayName = path.basename(opt.filePath).replace(/\.\w+$/, '');
            const dirName = path.basename(path.dirname(opt.filePath));
            documentation.set('displayName', displayName.toLowerCase() === 'index' ? dirName : displayName);
        }
        return docs;
    });
}
exports.default = parseSFC;
function parseScriptTag(scriptTag, pathResolver, opt, documentation, forceSingleExport, isSetupScript = false, isSetupScriptOtherScript = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let scriptSource = scriptTag ? scriptTag.content : undefined;
        const extSrc = scriptTag && scriptTag.attrs ? scriptTag.attrs.src : false;
        if (extSrc && typeof extSrc === 'string') {
            const extSrcAbs = pathResolver(extSrc);
            const extSource = extSrcAbs
                ? yield read(extSrcAbs, {
                    encoding: 'utf-8'
                })
                : '';
            if (extSource.length) {
                scriptSource = extSource;
                opt.lang =
                    (scriptTag && scriptTag.attrs && /^tsx?$/.test(scriptTag.attrs.lang)) ||
                        /\.tsx?$/i.test(extSrc)
                        ? 'ts'
                        : 'js';
            }
        }
        opt.lang =
            (scriptTag && scriptTag.attrs && /^tsx?$/.test(scriptTag.attrs.lang)) ||
                (typeof extSrc === 'string' && /\.tsx?$/i.test(extSrc))
                ? 'ts'
                : 'js';
        opt = isSetupScript ? Object.assign(Object.assign({}, opt), { scriptPreHandlers: [], scriptHandlers: script_setup_handlers_1.default }) : opt;
        const docs = scriptSource
            ? (yield (0, parse_script_1.default)(isSetupScriptOtherScript + '\n' + scriptSource, opt, documentation, forceSingleExport, isSetupScript)) || []
            : // if there is only a template return the template's doc
                documentation
                    ? [documentation]
                    : [];
        return docs;
    });
}
