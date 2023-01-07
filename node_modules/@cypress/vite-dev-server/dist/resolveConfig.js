"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViteDevServerConfig = void 0;
const tslib_1 = require("tslib");
/**
 * The logic inside of this file is heavily reused from
 * Vitest's own config resolution logic.
 * You can find it here https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/create.ts
 */
const debug_1 = tslib_1.__importDefault(require("debug"));
const path_1 = tslib_1.__importDefault(require("path"));
const constants_1 = require("./constants");
const index_1 = require("./plugins/index");
const dynamic_import_1 = require("./dynamic-import");
const debug = (0, debug_1.default)('cypress:vite-dev-server:resolve-config');
const createViteDevServerConfig = async (config, vite) => {
    const { viteConfig: inlineViteConfig, cypressConfig: { projectRoot } } = config;
    let resolvedOverrides = {};
    if (inlineViteConfig) {
        debug(`Received a custom viteConfig`, inlineViteConfig);
        if (typeof inlineViteConfig === 'function') {
            resolvedOverrides = await inlineViteConfig();
        }
        else if (typeof inlineViteConfig === 'object') {
            resolvedOverrides = inlineViteConfig;
        }
        // Set "configFile: false" to disable auto resolution of <project-root>/vite.config.js
        resolvedOverrides = Object.assign({ configFile: false }, resolvedOverrides);
    }
    else {
        const { findUp } = await (0, dynamic_import_1.dynamicImport)('find-up');
        const configFile = await findUp(constants_1.configFiles, { cwd: projectRoot });
        if (!configFile) {
            if (config.onConfigNotFound) {
                config.onConfigNotFound('vite', projectRoot, constants_1.configFiles);
                // The config process will be killed from the parent, but we want to early exit so we don't get
                // any additional errors related to not having a config
                process.exit(0);
            }
            else {
                throw new Error(`Your component devServer config for vite is missing a required viteConfig property, since we could not automatically detect one.\n Please add one to your ${config.cypressConfig.configFile}`);
            }
        }
        debug('Resolved config file at', configFile, 'using root', projectRoot);
        resolvedOverrides = { configFile };
    }
    const finalConfig = vite.mergeConfig(resolvedOverrides, makeCypressViteConfig(config, vite));
    debug('The resolved server config is', JSON.stringify(finalConfig, null, 2));
    return finalConfig;
};
exports.createViteDevServerConfig = createViteDevServerConfig;
function makeCypressViteConfig(config, vite) {
    const { cypressConfig: { projectRoot, devServerPublicPathRoute, supportFile, cypressBinaryRoot, isTextTerminal, }, specs, } = config;
    // Vite caches its output in the .vite directory in the node_modules where vite lives.
    // So we want to find that node_modules path and ensure it's added to the "allow" list
    const vitePathNodeModules = path_1.default.dirname(path_1.default.dirname(require.resolve(`vite/package.json`, {
        paths: [projectRoot],
    })));
    return {
        root: projectRoot,
        base: `${devServerPublicPathRoute}/`,
        optimizeDeps: {
            esbuildOptions: {
                incremental: true,
                plugins: [
                    {
                        name: 'cypress-esbuild-plugin',
                        setup(build) {
                            build.onEnd(function (result) {
                                // We don't want to completely fail the build here on errors so we treat the errors as warnings
                                // which will handle things more gracefully. Vite will 500 on files that have errors when they
                                // are requested later and Cypress will display an error message.
                                // See: https://github.com/cypress-io/cypress/pull/21599
                                result.warnings = [...result.warnings, ...result.errors];
                                result.errors = [];
                            });
                        },
                    },
                ],
            },
            entries: [
                ...specs.map((s) => path_1.default.relative(projectRoot, s.relative)),
                ...(supportFile ? [path_1.default.resolve(projectRoot, supportFile)] : []),
            ].filter((v) => v != null),
        },
        server: Object.assign({ fs: {
                allow: [
                    projectRoot,
                    vitePathNodeModules,
                    cypressBinaryRoot,
                ],
            }, host: '127.0.0.1' }, (isTextTerminal
            ? { watch: { ignored: '**/*' }, hmr: false }
            : {})),
        plugins: [
            (0, index_1.Cypress)(config, vite),
            (0, index_1.CypressSourcemap)(config, vite),
        ],
    };
}
