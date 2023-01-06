<script setup lang="ts">
defineProps<{ label: string }>();
</script>
<template>
  <div
    class="flex justify-center items-center px-[18px] py-[14px] bg-primary rounded-lg cursor-pointer text-white"
  >
    {{ label }}
  </div>
</template>
