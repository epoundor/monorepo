<template>
  <App
    title="Utilisateurs"
    action-button="Ajouter un utilisateur"
    :on-action-change="onActionClick"
  >
    <div class="flex flex-col pb-4 gap-6 h-full">
      <v-data-table
        v-model:selected="selected"
        v-model:currentPage="currentPage"
        fixed-headers
        select-row-on-click
        server-side
        :total-items="totalItems"
        :loading="isLoading"
        :page-size="10"
        :headers="tableHeaders"
        searchPlaceholder="Rechercher un administrateur"
        :items="users"
        @update:currentPage="() => {}"
        :on-search-change="onSearchChange"
        class="flex-1"
      >
        <template #cell(enable)="{ value: enable }">
          <template v-if="!enable">
            <span
              class="w-3 h-3 rounded-full inline-block aspect-square bg-red-500"
            ></span>
          </template>
          <template v-else>
            <span
              class="w-3 h-3 rounded-full inline-block aspect-square bg-green-500"
            ></span>
          </template>
        </template>

        <template #cell(actions)="user">
          <!-- <Action :actions="actions" /> -->
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="p-1 cursor-pointer rounded-md">
                <Icon name="menu" />
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
              >
                <div class="px-1 py-1 font-semibold">
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-gray-400 text-white' : 'text-gray-900',
                        'group flex gap-3 w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                    >
                      <Icon name="update" />
                      Modifier
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="statusUpdate()"
                      :class="[
                        active ? 'bg-gray-400 text-white' : 'text-gray-900',
                        'group flex gap-3 w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                    >
                      <template v-if="!user.item.enable">
                        <Icon name="switch-disabled" />
                        Activer
                      </template>
                      <template v-else>
                        <Icon name="switch-active" />
                        Désactiver
                      </template>
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </template>
        <template #cell(role)="{ value: role }">
          {{ userRole[role] }}
        </template>
      </v-data-table>
    </div>
  </App>
  <RouterView />
</template>
<script setup lang="ts">
import { onBeforeRouteUpdate, RouterView, useRouter } from "vue-router";
// import Action from "@/components/Action.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { computed, onUpdated, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import type { TableHeaders } from "@/types/Datatable";
import { useFetchUsers } from "@/api/users";
import type User from "@/types/entities/user";
import { userRole } from "@/constants";

// ------------- Constants ------------
const tableHeaders: TableHeaders[] = [
  { label: "", field: "enable" },
  { label: "Nom", field: "lastName" },
  { label: "Prénoms", field: "firstName" },
  { label: "Email ", field: "email" },
  { label: "Rôle", field: "role" },
  { label: "Action", field: "actions", class: "text-right w-60" },
];
// const actions = [
//   {
//     name: "Modifier",
//     icon: "update",
//     callback: onUpdate,
//   },
//   {
//     name: "Désactiver",
//     icon: "switch-active",
//     callback: statusUpdate,
//   },
// ];
const users: Ref<User[] | never[]> = ref([]);
const totalItems: Ref<number> = ref(0);
const currentPage: Ref<number> = ref(1);
const perPage: number = 10;
const search: Ref<string> = ref("");

const params = computed(() => {
  return {
    search: search.value,
    skip: perPage * (currentPage.value - 1),
    take: perPage,
  };
});
// ---------- Api Hooks handle -------------
const {
  registerSuccessCallback: onUsersFetched,
  execute,
  isLoading,
} = useFetchUsers();

// ---------- Api Hooks LifeCycle -----------
onUsersFetched((data) => {
  users.value = data.items;
  totalItems.value = data.totalItems;
});

const router = useRouter();

const selected: Ref = ref([]);

onMounted(() => {
  execute({
    params: params.value,
  });
});

onUpdated(() => {
  execute({
    params: params.value,
  });
}),
  watch(currentPage, () => {
    execute({
      params: params.value,
    });
  });

function onActionClick() {
  router.push({ name: "users.add" });
}

function statusUpdate() {
  router.push({
    name: "users.update.status",
    params: {
      id: selected.value[0].id,
    },
  });
}

const onSearchChange = (srch: string) => {
  if (!srch.length) execute();

  search.value = srch;
  currentPage.value = 1;
  execute({
    params: params.value,
  });
};
</script>
<style lang=""></style>
