<template>
  <router-link
    :to="path"
    active-class="active"
    class="opacity-75 border-l-4 border-transparent"
    :class="{ active: mustBeActive() }"
  >
    <div class="py-3 px-6 flex gap-5 items-center">
      <Icon :name="icon" />
      <span class="text-sm font-semibold" v-text="label"></span>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import { RouterLink } from "vue-router";
import router from "@/router";
import Icon from "../Icon.vue";

const props = defineProps<{
  icon: string;
  label: string;
  path: string;
  baseName?: string;
}>();
function mustBeActive() {
  if (props.baseName)
    return router.currentRoute.value.path.startsWith(props.baseName);

  return router.currentRoute.value.path === props.path;
}
</script>
<style scoped>
.active {
  @apply bg-primary-ligth;
  @apply border-l-4 border-l-secondary;
  opacity: 1;
}
</style>
