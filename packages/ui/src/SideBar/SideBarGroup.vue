<template>
  <div class="my-5 pb-4 border-[#2D5F67] border-b">
    <span
      class="font-semibold text-xs opacity-40 uppercase pl-4 text-[#F2F8F8]"
      v-text="label"
    ></span>
    <div class="w-full flex flex-col">
      <template v-for="(item, i) in items" :key="i">
        <SideBarItem
          :icon="item.iconName"
          :label="item.label"
          :path="item.path"
          :base-name="item.basePathName"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SideBarItem from "@/components/SideBar/SideBarItem.vue";
import type { MenuGroupItemType } from "@/types/globalType";

defineProps<{ label: string; items: MenuGroupItemType[] }>();
</script>
<style lang=""></style>
