<template>
  <div
    class="w-full bg-white border-b py-2 px-6 flex justify-between items-center shadow-box"
  >
    <div></div>

    <!-- SPACER -->
    <!-- <div class="w-full bg-danger"></div> -->
    <!-- Notification & Profile Block -->
    <div class="flex gap-4 items-center justify-center">
      <div class="relative">
        <Icon name="NotificationIcon" class="border-r pr-4 inline-block" />
        <span
          class="absolute top-[8px] left-[16px] flex justify-center items-center px-[5px] aspect-square font-semibold text-[10px] bg-[#DA1414] rounded-full text-white leading-3"
          >3</span
        >
      </div>
      <div class="rounded-full bg-functional-grey w-10 aspect-square">
        <img src="" alt="" />
      </div>
      <div class="flex flex-col">
        <span class="font-semibold">Agbala Josh</span>
        <span class="font-medium text-xs text-functional-grey opacity-80"
          >Contrôleur Financier</span
        >
      </div>
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton class="p-1 cursor-pointer rounded-md">
            <Icon name="chevron" />
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
            class="absolute font-semibold right-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mt-4"
          >
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <router-link :to="{ name: 'profile.index' }">
                  <button
                    :class="[
                      active ? 'bg-gray-100 ' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    Voir Profil
                  </button>
                </router-link>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-gray-100 ' : 'text-red-700',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                >
                  Déconnexion
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
</script>

<style lang="scss" scoped>
.searchBox {
  :deep(.baseinput-core) {
    @apply bg-[#F0F0F0];
    /* background-color: #f4f6f9; */
  }
}
.shadow-box {
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
}
</style>
