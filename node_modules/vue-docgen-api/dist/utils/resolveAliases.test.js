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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const resolveAliases_1 = __importDefault(require("./resolveAliases"));
vi.mock('fs', () => {
    return {
        existsSync: vi.fn((path) => path === '/replacementPath/src/mixins/somethingNice/mixinFile.js')
    };
});
describe('resolveAliases', () => {
    it('should resolve aliased from a path', () => {
        expect((0, resolveAliases_1.default)('myPath/somethingNice/mixinFile.js', {
            myPath: './replacementPath/src/mixins'
        })).toEqual(path.join('./replacementPath/src/mixins', 'somethingNice/mixinFile.js'));
    });
    it('should not resolve partial aliased', () => {
        const aliasedPath = (0, resolveAliases_1.default)('@myPath/somethingNice/mixinFile.js', {
            '@': './replacementPath/src/mixins'
        });
        expect(aliasedPath).not.toContain('replacementPath');
    });
    it('should resolve an alias from an array', () => {
        expect((0, resolveAliases_1.default)('myPath/somethingNice/mixinFile.js', {
            myPath: [
                './replacementPath/src/mixins',
                './replacementPath2/src/mixins'
            ]
        }, '/')).toEqual(path.resolve('/replacementPath/src/mixins', 'somethingNice/mixinFile.js'));
    });
    it('should not resolve an alias from an array', () => {
        const aliasedPath = (0, resolveAliases_1.default)('@myPath/somethingNice/mixinFile.js', {
            '@': [
                './replacementPath/src/mixins',
                './replacementPath2/src/mixins'
            ]
        }, '/');
        expect(aliasedPath).not.toContain('replacementPath');
    });
    it('should not resolve an alias from an non-existing file', () => {
        const aliasedPath = (0, resolveAliases_1.default)('myPath/somethingNice/nonExistingMixinFile.js', {
            myPath: [
                './replacementPath/src/mixins',
                './replacementPath2/src/mixins'
            ]
        }, '/');
        expect(aliasedPath).not.toContain('replacementPath');
    });
});
