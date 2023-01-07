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
const recast_1 = require("recast");
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
/**
 * Extract information from an setup-style VueJs 3 component
 * about what methods and variable are exposed
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
function setupExposedHandler(documentation, componentDefinition, astPath, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        function buildExposedDescriptor(exposedName, exposedPath) {
            const exposedDescriptor = documentation.getExposedDescriptor(exposedName);
            const docBlock = (0, getDocblock_1.default)(exposedPath);
            if (docBlock) {
                const jsDoc = (0, getDoclets_1.default)(docBlock);
                setExposedDescriptor(exposedDescriptor, jsDoc);
            }
        }
        function setExposedDescriptor(exposedDescriptor, jsDoc) {
            var _a;
            if (jsDoc.description && jsDoc.description.length) {
                exposedDescriptor.description = jsDoc.description;
            }
            if ((_a = jsDoc.tags) === null || _a === void 0 ? void 0 : _a.length) {
                exposedDescriptor.tags = jsDoc.tags;
            }
        }
        (0, recast_1.visit)(astPath.program, {
            visitCallExpression(nodePath) {
                if (bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'defineExpose') {
                    if (bt.isObjectExpression(nodePath.get('arguments', 0).node)) {
                        nodePath.get('arguments', 0, 'properties').each((prop) => {
                            if (bt.isIdentifier(prop.node.key)) {
                                buildExposedDescriptor(prop.node.key.name, prop);
                            }
                            else if (bt.isStringLiteral(prop.node.key)) {
                                buildExposedDescriptor(prop.node.key.value, prop);
                            }
                        });
                    }
                }
                return false;
            }
        });
    });
}
exports.default = setupExposedHandler;
