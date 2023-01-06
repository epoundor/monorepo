<template>
  <div class="w-1/6 bg-primary text-white flex flex-col items-center">
    <div class="py-10">
      <Logo />
    </div>
    <div class="w-full flex flex-col">
      <SideBarItem icon="dashboard" label="Tableau de Board" path="/" />
      <SideBarItem
        icon="life-proof"
        label="Preuve de vie"
        path="/life-proof"
        base-name="/life-proof"
      />
      <template v-for="(item, i) in items" :key="i">
        <SideBarGroup :label="item.groupLabel" :items="item.groupItems" />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from "@/assets/svg/logo.vue";
import SideBarItem from "@/components/SideBar/SideBarItem.vue";
import SideBarGroup from "@/components/SideBar/SideBarGroup.vue";
import { getMenuByUserRole } from "@/constants";

const items = getMenuByUserRole();
</script>
<style lang=""></style>
