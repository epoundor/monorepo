<template>
  <div>
    <h3 class="mb-2 text-sm font-semibold">{{ label }}</h3>
    <textarea
      class="border border-[#6D7580] rounded-lg h-20 w-full remove p-4"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextAreaInput",
  props: {
    label: { type: String, required: true },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
