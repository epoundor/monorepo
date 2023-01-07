"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const LRUCache = require('lru-cache');
const hash = require('hash-sum');
const cache = new LRUCache(250);
function default_1(creator, ...argsKey) {
    const cacheKey = hash(argsKey.join(''));
    // source-map cache busting for hot-reloadded modules
    let output = cache.get(cacheKey);
    if (output) {
        return output;
    }
    output = creator();
    cache.set(cacheKey, output);
    return output;
}
exports.default = default_1;
