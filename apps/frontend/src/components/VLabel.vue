<template>
  <span
    class="px-2 py-1 text-xs font-semibold inline-flex items-center rounded-full"
    :class="[
      {
        border: bordered,
        [`border-${color}`]: bordered,
      },
      `text-${color}-600 bg-${color}-100`,
    ]"
  >
    <div
      class="h-[5px] w-[5px] flex-none rounded-full mr-1"
      :class="`bg-${color}-500`"
    ></div>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
  text: string;
  noMark?: boolean;
  bordered?: boolean;
  roundedSm?: boolean;
  roundedMd?: boolean;
  roundedLg?: boolean;
  roundedFull?: boolean;
}>();
</script>
