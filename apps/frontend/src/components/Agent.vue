<template>
  <router-link
    class="underline text-blue-400"
    :to="{ name: 'devices.details', params: { id: value.id } }"
  >
    {{ value.firstName }} {{ value.lastName }}
  </router-link>
</template>
<script setup lang="ts">
import axios from "axios";

const prop = defineProps<{
  agent: string;
}>();
const value = await //   await axios.get(`/api/users/${prop.agent}`)
(
  await axios.get(`/mocks/get/users/${prop.agent}.json`)
).data;
</script>
<style lang=""></style>
