<template>
  <div
    class="flex px-4 gap-3 items-center rounded border-l-4"
    :style="`background-color:${backgroundColor};border-color:${color};`"
  >
    <div class="p-3 rounded-full" :style="`background-color:${color}`">
      <Icon :name="icon" />
    </div>
    <div class="flex flex-col">
      <span class="text-xs">{{ label }}</span>
      <span class="text-xl font-bold">{{ value }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  value: number;
  color: string;
  backgroundColor: string;
}>();
</script>
<style lang=""></style>
