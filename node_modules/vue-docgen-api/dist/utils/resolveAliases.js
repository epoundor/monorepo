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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function resolveAliases(filePath, aliases, refDirName = '') {
    const aliasKeys = Object.keys(aliases);
    let aliasResolved = null;
    if (!aliasKeys.length) {
        return filePath;
    }
    for (const aliasKey of aliasKeys) {
        const aliasValueWithSlash = aliasKey + '/';
        const aliasMatch = filePath.substring(0, aliasValueWithSlash.length) === aliasValueWithSlash;
        const aliasValue = aliases[aliasKey];
        if (!aliasMatch) {
            continue;
        }
        if (!Array.isArray(aliasValue)) {
            aliasResolved = path.join(aliasValue, filePath.substring(aliasKey.length + 1));
            continue;
        }
        for (const alias of aliasValue) {
            const absolutePath = path.resolve(refDirName, alias, filePath.substring(aliasKey.length + 1));
            if (fs.existsSync(absolutePath)) {
                aliasResolved = absolutePath;
                break;
            }
        }
    }
    return aliasResolved === null ?
        filePath :
        aliasResolved;
}
exports.default = resolveAliases;
