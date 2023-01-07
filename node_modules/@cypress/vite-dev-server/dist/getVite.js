"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVite = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = (0, debug_1.default)('cypress:vite-dev-server:getVite');
// "vite-dev-server" is bundled in the binary, so we need to require.resolve "vite"
// from root of the active project since we don't bundle vite internally but rather
// use the version the user has installed
function getVite(config) {
    try {
        const viteImportPath = require.resolve('vite', { paths: [config.cypressConfig.projectRoot] });
        debug('resolved viteImportPath as %s', viteImportPath);
        return require(viteImportPath);
    }
    catch (err) {
        throw new Error(`Could not find "vite" in your project's dependencies. Please install "vite" to fix this error.\n\n${err}`);
    }
}
exports.getVite = getVite;
