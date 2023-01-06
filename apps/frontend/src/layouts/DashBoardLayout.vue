<template lang="">
  <div class="flex h-screen w-screen">
    <SideBar />
    <div class="flex flex-col h-screen flex-1">
      <div class="">
        <NavBar />
      </div>
      <div class="py-8 px-6 bg-[#F8F8F8] flex-1 overflow-y-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SideBar from "@/components/SideBar/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
</script>
<style lang=""></style>
