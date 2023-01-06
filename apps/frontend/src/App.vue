<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DashBoardLayout from "@/layouts/DashBoardLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

const route = useRoute();
</script>

<template>
  <template v-if="route.meta.layout === 'auth'">
    <AuthLayout />
  </template>
  <template v-else>
    <DashBoardLayout>
      <RouterView />
    </DashBoardLayout>
  </template>
</template>

<style scoped></style>
