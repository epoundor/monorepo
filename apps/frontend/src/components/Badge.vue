<template>
  <span
    class="flex justify-center items-center rounded-full aspect-square w-14"
    :style="`background-color:${color}`"
  >
    <Icon :name="icon" />
  </span>
</template>
<script setup lang="ts">
defineProps<{
  icon: string;
  color: string;
}>();
</script>
<style lang=""></style>
