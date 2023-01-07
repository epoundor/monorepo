"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transformTagsIntoObject_1 = __importDefault(require("./transformTagsIntoObject"));
describe('transformTagsIntoObject', () => {
    it('should return ignore with description to true', () => {
        expect((0, transformTagsIntoObject_1.default)([{ title: 'ignore', content: true }])).toMatchObject({
            ignore: [{ title: 'ignore', description: true }]
        });
    });
    it('should return multiple authors', () => {
        expect((0, transformTagsIntoObject_1.default)([
            { title: 'author', content: 'Bobby' },
            { title: 'author', content: 'Mike' }
        ])).toMatchObject({
            author: [
                {
                    description: 'Bobby',
                    title: 'author'
                },
                {
                    description: 'Mike',
                    title: 'author'
                }
            ]
        });
    });
    it('should parse custom tags', () => {
        expect((0, transformTagsIntoObject_1.default)([{ title: 'asdf', content: 'qwerty' }])).toMatchObject({
            asdf: [
                {
                    title: 'asdf',
                    description: 'qwerty'
                }
            ]
        });
    });
});
