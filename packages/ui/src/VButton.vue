<template>
  <component
    data-test="vbutton"
    :is="tag"
    :to="to"
    :href="href"
    class="
      relative
      inline-flex
      items-center
      justify-center
      rounded-lg
      border-2
      cursor-pointer
      focus:outline-none
      focus:ring-2
    "
    :class="[buttonClasses, disabled ? 'cursor-not-allowed' : '']"
    :disabled="disabled"
  >
    <slot name="prepend">
      <span v-if="leftIcon" :class="leftIconClasses">
        <Icon :width="iconSize" :height="iconSize" :name="leftIcon" />
      </span>
    </slot>

    <slot>{{ text }}</slot>

    <slot name="append">
      <span v-if="rightIcon" :class="rightIconClasses">
        <Icon :width="iconSize" :height="iconSize" :name="rightIcon" />
      </span>
    </slot>

    <div
      v-show="loading"
      class="
        absolute
        inset-0
        flex
        items-center
        justify-center
        pointer-events-none
        bg-transparent
      "
    >
      <svg
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </component>
</template>

<script lang="ts">
import { computed } from "vue";

const VARIANT_STYLES = {
  primary:
    "bg-primary border-green text-white focus:ring-green-300 active:bg-green-600",
  info: "bg-blue border-blue-500 text-white focus:ring-blue-300 active:bg-blue-600",
  danger:
    "bg-red-500 border-red border-red-500 text-white focus:ring-red-300 active:bg-red-600",
  minimal:
    "bg-gray-100 border-gray-100 !border text-gray-700 focus:ring-gray-300 active:bg-gray-200",
};

const VARIANT_OUTLINE_STYLES = {
  primary:
    "border-primary bg-white text-green focus:ring-green-300 active:bg-green-50",
  info: "border-blue bg-white text-green focus:ring-blue-300 active:bg-blue-50",
  danger: "border-red bg-white text-green focus:ring-red-300 active:bg-red-50",
  minimal:
    "bg-white border-[#6D7580] !border-2 text-gray-500 focus:ring-gray-300 active:bg-gray-100",
};

const SIZE_STYLES = {
  xl: "px-8 py-4 text-xl",
  lg: "px-6 py-3 text-lg",
  sm: "px-3 py-5px text-sm",
  xs: "px-2 py-1 text-xs",
  md: "px-4 py-2 text-base",
};

function getStyleClasses(variant: string, outline: boolean, loading: boolean) {
  let classes = outline
    ? VARIANT_OUTLINE_STYLES[variant]
    : VARIANT_STYLES[variant];

  if (loading) {
    classes += " !text-transparent";
  }

  return classes;
}

function getSizeClasses(size: string) {
  return SIZE_STYLES[size];
}

export default {
  props: {
    to: {
      type: [String, Object],
      required: false,
    },

    href: {
      type: String,
      required: false,
    },

    text: {
      type: String,
      required: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    leftIcon: {
      type: String,
      required: false,
    },

    rightIcon: {
      type: String,
      required: false,
    },

    variant: {
      type: String,
      default: "primary",
      validator: (value) => /primary|secondary|info|danger|minimal/.test(value),
    },

    outline: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      required: false,
      validator: (value) => /xl|lg|md|sm|xs/.test(value),
    },

    xsmall: {
      type: Boolean,
      default: false,
    },

    small: {
      type: Boolean,
      default: false,
    },

    large: {
      type: Boolean,
      default: false,
    },

    xlarge: {
      type: Boolean,
      default: false,
    },

    block: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const tag = computed(() =>
      props.href ? "a" : props.to ? "router-link" : "button"
    );

    const size = computed(
      () =>
        props.size ||
        (props.xlarge
          ? "xl"
          : props.large
          ? "lg"
          : props.small
          ? "sm"
          : props.xsmall
          ? "xs"
          : "md")
    );
    const buttonClasses = computed(() => [
      getStyleClasses(props.variant, props.outline, props.loading),
      getSizeClasses(size.value),
      props.block && "w-full justify-center",
    ]);
    const leftIconClasses = computed(
      () =>
        ({ xs: "mr-1", sm: "mr-2", md: "mr-3", lg: "mr-4", xl: "mr-5" }[
          size.value
        ])
    );
    const rightIconClasses = computed(
      () =>
        ({ xs: "ml-1", sm: "ml-2", md: "ml-3", lg: "ml-4", xl: "ml-5" }[
          size.value
        ])
    );

    const iconSize = computed(
      () => ({ xs: 16, sm: 20, md: 24, lg: 28, xl: 32 }[size.value])
    );

    return {
      tag,
      iconSize,
      buttonClasses,
      leftIconClasses,
      rightIconClasses,
    };
  },
};
</script>
