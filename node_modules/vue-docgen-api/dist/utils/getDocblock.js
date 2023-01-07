"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocblock = void 0;
/**
 * Helper functions to work with docblock comments.
 */
/**
 * Extracts the text from a docblock comment
 * @param {rawDocblock} str
 * @return str stripped from stars and spaces
 */
function parseDocblock(str) {
    const lines = str.split('\n');
    for (let i = 0, l = lines.length; i < l; i++) {
        lines[i] = lines[i].replace(/^\s*\*\s?/, '').replace(/\r$/, '');
    }
    return lines.join('\n').trim();
}
exports.parseDocblock = parseDocblock;
const DOCBLOCK_HEADER = /^\*\s/;
/**
 * Given a path, this function returns the closest preceding docblock if it
 * exists.
 */
function getDocblock(path, { commentIndex = 1 } = { commentIndex: 1 }) {
    commentIndex = commentIndex || 1;
    let comments = [];
    const allComments = path.node.leadingComments;
    if (allComments) {
        comments = allComments.filter((comment) => comment.type === 'CommentBlock' && DOCBLOCK_HEADER.test(comment.value));
    }
    if (comments.length + 1 - commentIndex > 0) {
        return parseDocblock(comments[comments.length - commentIndex].value);
    }
    return null;
}
exports.default = getDocblock;
