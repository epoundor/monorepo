"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolveAliases_1 = __importDefault(require("../utils/resolveAliases"));
const resolvePathFrom_1 = __importDefault(require("../utils/resolvePathFrom"));
function makePathResolver(refDirName, aliases, modules) {
    return (filePath, originalDirNameOverride) => (0, resolvePathFrom_1.default)((0, resolveAliases_1.default)(filePath, aliases || {}, refDirName), [
        originalDirNameOverride || refDirName,
        ...(modules || [])
    ]);
}
exports.default = makePathResolver;
