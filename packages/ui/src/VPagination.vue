<template>
  <div class="flex items-center text-true-gray-600 font-semibold">
    <span>
      {{ startIndex + 1 }}
      -
      {{ endIndex + 1 }}
    </span>
    <span class="ml-2">sur</span>
    <span class="ml-2">{{ totalItems }}</span>

    <button
      :disabled="!isPreviousEnabled"
      class="ml-4 flex w-8 h-8 rounded-full items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
      :class="{
        'pointer-events-none text-true-gray-400': !isPreviousEnabled,
      }"
      @click="onPreviousClick"
    >
      <Icon name="chevron" class="rotate-90" />
    </button>
    <button
      :disabled="!isNextEnabled"
      class="flex w-8 h-8 rounded-full items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
      :class="{
        'pointer-events-none text-true-gray-400': !isNextEnabled,
      }"
      @click="onNextClick"
    >
      <Icon name="chevron" class="-rotate-90" />
    </button>
  </div>
</template>

<script lang="ts">
import usePagination from "@/hooks/usePagination";
import { useVModel } from "@vueuse/core";
import { computed, watchEffect } from "vue";

export default {
  props: {
    totalItems: {
      type: Number,
      default: 0,
    },

    pageSize: {
      type: Number,
      default: 10,
    },

    modelValue: {
      type: Number,
      default: 1,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const currentPage = useVModel(props, "modelValue", emit);

    const {
      startIndex,
      endIndex,
      totalItems,
      isNextEnabled,
      isPreviousEnabled,
      nextPage,
      previousPage,
    } = usePagination({
      totalItems: computed(() => props.totalItems),
      pageSize: computed(() => props.pageSize),
      currentPage,
    });

    return {
      totalItems,
      startIndex,
      endIndex,
      isNextEnabled,
      isPreviousEnabled,
      onNextClick: nextPage,
      onPreviousClick: previousPage,
    };
  },
};
</script>
