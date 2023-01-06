<template>
  <span>
    <component :is="component" />
  </span>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import ErrorIconVue from "./icons/ErrorIcon.vue";
import LoadingIcon from "./icons/loading.vue";
const prop = defineProps<{ name: string }>();

const component = defineAsyncComponent({
  loader: () => import(`./icons/${prop.name}.vue`),
  errorComponent: ErrorIconVue,
  loadingComponent: LoadingIcon,
});
</script>
<style></style>
