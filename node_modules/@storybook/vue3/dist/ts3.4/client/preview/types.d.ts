import { ConcreteComponent } from 'vue';
export { RenderContext } from '@storybook/core';
export interface ShowErrorArgs {
    title: string;
    description: string;
}
export declare type StoryFnVueReturnType = ConcreteComponent<any>;
export interface IStorybookStory {
    name: string;
    render: (context: any) => any;
}
export interface IStorybookSection {
    kind: string;
    stories: IStorybookStory[];
}
