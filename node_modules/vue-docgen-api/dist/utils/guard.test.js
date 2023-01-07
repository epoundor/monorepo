"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guards_1 = require("./guards");
describe('guards', () => {
    it('should return false when null', () => {
        expect((0, guards_1.isTextNode)()).toBeFalsy();
        expect((0, guards_1.isCommentNode)()).toBeFalsy();
        expect((0, guards_1.isBaseElementNode)()).toBeFalsy();
        expect((0, guards_1.isDirectiveNode)()).toBeFalsy();
        expect((0, guards_1.isAttributeNode)()).toBeFalsy();
        expect((0, guards_1.isSimpleExpressionNode)()).toBeFalsy();
        expect((0, guards_1.isCompoundExpressionNode)()).toBeFalsy();
        expect((0, guards_1.isInterpolationNode)()).toBeFalsy();
    });
});
