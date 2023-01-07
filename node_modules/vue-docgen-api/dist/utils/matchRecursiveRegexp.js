"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRecursiveRegExp = void 0;
/* eslint-disable no-cond-assign */
/**
 * matching nested constructs
 * thanks Steve Levithan
 * @see http://blog.stevenlevithan.com/archives/javascript-match-recursive-regexp
 * @param str
 * @param left
 * @param right
 * @param flags
 */
function matchRecursiveRegExp(str, left, right, flags = '') {
    let f = flags;
    const g = f.indexOf('g') > -1;
    f = f.replace('g', '');
    const x = new RegExp(`${left}|${right}`, `g${f}`);
    const l = new RegExp(left, f.replace(/g/g, ''));
    const a = [];
    let s = -1;
    let t;
    let m;
    do {
        t = 0;
        while ((m = x.exec(str))) {
            if (l.test(m[0])) {
                if (!t++) {
                    s = x.lastIndex;
                }
            }
            else if (t) {
                if (!--t) {
                    a.push(str.slice(s, m.index));
                    if (!g) {
                        return a;
                    }
                }
            }
        }
    } while (t && (x.lastIndex = s));
    return a;
}
exports.matchRecursiveRegExp = matchRecursiveRegExp;
exports.default = matchRecursiveRegExp;
