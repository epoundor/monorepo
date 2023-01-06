<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="mb-6 flex justify-between items-center">
      <div class="font-bold text-xl" data-test="title">{{ title }}</div>
      <Button :label="actionButton" v-if="actionButton" @click="onClick()" />
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import Button from "./Button.vue";

const props = defineProps<{
  title: string;
  actionButton?: string;
  onActionChange?: Function;
}>();

function onClick() {
  if (props.onActionChange) {
    props.onActionChange();
  }
}
</script>
<style lang=""></style>
