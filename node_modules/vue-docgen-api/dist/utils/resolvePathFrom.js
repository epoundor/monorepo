"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const missing_files_cache_1 = __importDefault(require("./missing-files-cache"));
const SUFFIXES = ['', '.js', '.ts', '.vue', '.jsx', '.tsx'];
function resolvePathFrom(path, from) {
    let finalPath = null;
    SUFFIXES.forEach(s => {
        if (!finalPath) {
            try {
                finalPath = require.resolve(`${path}${s}`, {
                    paths: from
                });
            }
            catch (e) {
                // eat the error
            }
        }
        if (!finalPath) {
            try {
                finalPath = require.resolve((0, path_1.join)(path, `index${s}`), {
                    paths: from
                });
            }
            catch (e) {
                // eat the error
            }
        }
        if (!finalPath) {
            for (let i = 0; i < from.length; i++) {
                try {
                    finalPath = require.resolve((0, path_1.join)(from[i], `${path}${s}`));
                    if (finalPath.length) {
                        break;
                    }
                }
                catch (e) {
                    // eat the error
                }
            }
        }
    });
    try {
        const packagePath = require.resolve((0, path_1.join)(path, 'package.json'), {
            paths: from
        });
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pkg = require(packagePath);
        // if it is an es6 module use the module instead of commonjs
        finalPath = require.resolve((0, path_1.join)(path, pkg.module || pkg.main));
    }
    catch (e) {
        // eat the error
    }
    if (!finalPath) {
        if (!missing_files_cache_1.default[path]) {
            // eslint-disable-next-line no-console
            console.warn(`Neither '${path}.vue' nor '${path}.js(x)' or '${path}/index.js(x)' or '${path}/index.ts(x)' could be found in '${from}'`);
            missing_files_cache_1.default[path] = true;
        }
    }
    return finalPath;
}
exports.default = resolvePathFrom;
