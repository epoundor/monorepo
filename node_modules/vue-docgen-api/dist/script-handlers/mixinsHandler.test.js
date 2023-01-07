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
const babel_parser_1 = __importDefault(require("../babel-parser"));
const Documentation_1 = __importDefault(require("../Documentation"));
const parse = __importStar(require("../parse"));
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const resolvePathFrom_1 = __importDefault(require("../utils/resolvePathFrom"));
const resolveRequired_1 = __importDefault(require("../utils/resolveRequired"));
const mixinsHandler_1 = __importDefault(require("./mixinsHandler"));
vi.mock('../utils/resolveRequired');
vi.mock('../utils/resolvePathFrom');
describe('mixinsHandler', () => {
    let resolveRequiredMock;
    let mockResolvePathFrom;
    let mockParse;
    const doc = new Documentation_1.default('dummy/path');
    beforeEach(() => {
        resolveRequiredMock = resolveRequired_1.default;
        resolveRequiredMock.mockReturnValue({
            testComponent: { filePath: ['componentPath'], exportName: 'default' }
        });
        mockResolvePathFrom = resolvePathFrom_1.default;
        mockResolvePathFrom.mockReturnValue('./component/full/path');
        mockParse = vi.spyOn(parse, 'parseFile');
        mockParse.mockReset();
        mockParse.mockReturnValue({ component: 'documentation' });
    });
    it.each([
        [
            'import testComponent from "./testComponent"',
            'export default {',
            '  mixins:[testComponent]',
            '}'
        ].join('\n'),
        [
            'import { testComponent, other } from "./testComponent"',
            'export default {',
            '   mixins:[testComponent,other]',
            '}'
        ].join('\n'),
        [
            'const testComponent = require("./testComponent");',
            'export default {',
            '  mixins:[testComponent,other]',
            '}'
        ].join('\n')
    ])('should resolve extended modules variables', (src) => __awaiter(void 0, void 0, void 0, function* () {
        const ast = (0, babel_parser_1.default)().parse(src);
        const path = (0, resolveExportedComponent_1.default)(ast)[0].get('default');
        if (path) {
            yield (0, mixinsHandler_1.default)(doc, path, ast, {
                filePath: '',
                validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
            });
        }
        expect(mockParse).toHaveBeenCalledWith(expect.objectContaining({
            filePath: './component/full/path',
            nameFilter: ['default']
        }), doc);
    }));
    it('should resolve mixins modules variables in class style components', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = [
            'import { testMixin, otherMixin  } from "./mixins";',
            '@Component',
            'export default class Bart extends mixins(testMixins, otherMixin) {',
            '}'
        ].join('\n');
        const ast = (0, babel_parser_1.default)().parse(src);
        const path = (0, resolveExportedComponent_1.default)(ast)[0].get('default');
        if (!path) {
            return;
        }
        yield (0, mixinsHandler_1.default)(doc, path, ast, {
            filePath: '',
            validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
        });
        expect(mockParse).toHaveBeenCalledWith(expect.objectContaining({
            filePath: './component/full/path',
            nameFilter: ['default']
        }), doc);
    }));
    it('should ignore mixins coming from node_modules', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = [
            'import { VueMixin  } from "vue-mixins";',
            'export default {',
            '  mixins:[VueMixin]',
            '}'
        ].join('\n');
        const ast = (0, babel_parser_1.default)().parse(src);
        const path = (0, resolveExportedComponent_1.default)(ast)[0].get('default');
        if (!path) {
            return;
        }
        mockResolvePathFrom.mockReturnValue('foo/node_modules/component/full/path');
        yield (0, mixinsHandler_1.default)(doc, path, ast, {
            filePath: '',
            validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
        });
        expect(mockParse).not.toHaveBeenCalled();
    }));
    it('should ignore variables that are not mixins', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = [
            'const { maxin } = require("./maxins");',
            'const foo = require("./bar")',
            'export default {',
            '  name: "boo"',
            '}'
        ].join('\n');
        const ast = (0, babel_parser_1.default)().parse(src);
        const path = (0, resolveExportedComponent_1.default)(ast)[0].get('default');
        if (!path) {
            return;
        }
        yield (0, mixinsHandler_1.default)(doc, path, ast, {
            filePath: '',
            validExtends: (fullFilePath) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
        });
        expect(mockParse).not.toHaveBeenCalled();
    }));
});
