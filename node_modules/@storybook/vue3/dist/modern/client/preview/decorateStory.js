import "core-js/modules/es.array.reduce.js";
import { h } from 'vue';
import { sanitizeStoryContextUpdate } from '@storybook/store';

/*
  This normalizes a functional component into a render method in ComponentOptions.

  The concept is taken from Vue 3's `defineComponent` but changed from creating a `setup`
  method on the ComponentOptions so end-users don't need to specify a "thunk" as a decorator.
 */
function normalizeFunctionalComponent(options) {
  return typeof options === 'function' ? {
    render: options,
    name: options.name
  } : options;
}

function prepare(rawStory, innerStory) {
  const story = rawStory;

  if (story == null) {
    return null;
  }

  if (innerStory) {
    return Object.assign({}, normalizeFunctionalComponent(story), {
      components: Object.assign({}, story.components || {}, {
        story: innerStory
      })
    });
  }

  return {
    render() {
      return h(story);
    }

  };
}

export function decorateStory(storyFn, decorators) {
  return decorators.reduce((decorated, decorator) => context => {
    let story;
    const decoratedStory = decorator(update => {
      story = decorated(Object.assign({}, context, sanitizeStoryContextUpdate(update)));
      return story;
    }, context);

    if (!story) {
      story = decorated(context);
    }

    if (decoratedStory === story) {
      return story;
    }

    return prepare(decoratedStory, story);
  }, context => prepare(storyFn(context)));
}