<template>
  <Menu as="div" class="relative inline-block" data-test="action-button">
    <div>
      <MenuButton class="p-1 cursor-pointer rounded-md">
        <Icon name="menu" class="rotate-90 block" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="flex flex-col absolute -top-4 right-6 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mt-4"
        data-test="action-items"
      >
        <div class="px-1 py-1 font-semibold">
          <template v-for="action in actions">
            <MenuItem v-slot="{ active }">
              <button
                data-test="action-item"
                @click="action.callback"
                :class="[
                  active ? 'bg-gray-100' : 'text-gray-900',
                  'group flex gap-3 w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <Icon :name="action.icon" />
                {{ action.name }}
              </button>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
interface Action {
  name: string;
  icon: string;
  callback: Function;
}
defineProps<{ actions: Action[] }>();
</script>
<style lang=""></style>
