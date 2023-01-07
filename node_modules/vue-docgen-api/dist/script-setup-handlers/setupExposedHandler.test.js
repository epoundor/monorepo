"use strict";
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
const resolveExportedComponent_1 = __importDefault(require("../utils/resolveExportedComponent"));
const setupExposedHandler_1 = __importDefault(require("./setupExposedHandler"));
function parse(src, plugins) {
    return (0, babel_parser_1.default)({ plugins }).parse(src);
}
describe('setupExposedHandler', () => {
    let documentation;
    let mockExposedDescriptor;
    let stubNodePath;
    const options = { filePath: '', validExtends: () => true };
    beforeAll(() => {
        var _a;
        const defaultAST = (0, babel_parser_1.default)({ plugins: ['typescript'] }).parse('export default {}');
        stubNodePath = (_a = (0, resolveExportedComponent_1.default)(defaultAST)[0]) === null || _a === void 0 ? void 0 : _a.get('default');
    });
    beforeEach(() => {
        mockExposedDescriptor = {
            description: '',
            name: 'mockExposed'
        };
        documentation = new Documentation_1.default('test/path');
        const mockGetPropDescriptor = vi.spyOn(documentation, 'getExposedDescriptor');
        mockGetPropDescriptor.mockReturnValue(mockExposedDescriptor);
    });
    function parserTest(src, plugins = ['typescript']) {
        return __awaiter(this, void 0, void 0, function* () {
            const ast = parse(src, plugins);
            yield (0, setupExposedHandler_1.default)(documentation, stubNodePath, ast, options);
            return mockExposedDescriptor;
        });
    }
    it('should resolve Exposed in setup script', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
        const testProps = 0
        defineExpose({ testProps })
        `;
        yield parserTest(src);
        expect(documentation.getExposedDescriptor).toHaveBeenCalledWith('testProps');
    }));
    it('should resolve Exposed descriptions in setup script', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
        const testPropsInner = 0
        defineExpose({
          /**
           * Exposed test props
           */
          testProps: testPropsInner
        })
        `;
        const prop = yield parserTest(src);
        expect(prop).toMatchInlineSnapshot(`
			{
			  "description": "Exposed test props",
			  "name": "mockExposed",
			}
		`);
    }));
    it('should resolve Exposed items pushed by strings', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = `
        const testPropsInner = 0
        defineExpose({
          /**
           * Exposed test props
           */
          'testProps': testPropsInner
        })
        `;
        const prop = yield parserTest(src);
        expect(prop).toMatchInlineSnapshot(`
			{
			  "description": "Exposed test props",
			  "name": "mockExposed",
			}
		`);
    }));
});
