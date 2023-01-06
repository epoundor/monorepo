<template>
  <App
    title="Devices"
    :action-button="devices.length < 1 ? false : 'Ajouter un device'"
    :on-action-change="onActionClick"
  >
    <!-- <template v-if="isLoading || devices.length > 0"> -->
    <template v-if="true">
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
        :items="devices"
        searchPlaceholder="Rechercher un device"
        @update:currentPage="() => {}"
        :on-search-change="onSearchChange"
        class="flex-1"
      >
        <template v-once #cell(reference)="{ item }">
          <router-link
            class="underline text-blue-500"
            :to="{ name: 'devices.details', params: { id: item.id } }"
            >{{ item.reference }}</router-link
          >
        </template>
        <template v-once #cell(enable)="{ value: enable }">
          <v-label v-if="enable" color="green" text="En ligne" />
          <v-label v-else color="red" text="Hors Ligne" />
        </template>
        <!--
        <template #cell(lastConnexion)="{ value: time }">
          {{ timeAgo(new Date(time)) }}
        </template>
-->

        <template #cell(actions)="{ value: action }">
          <Action :actions="actions" v-once />
        </template>
        <template #cell(compliance)="{ value: compliance }">
          <v-label v-if="compliance" color="green" text="Conforme" />
          <v-label v-else color="red" text="Non Conforme" />
        </template>
      </v-data-table>
    </template>
    <template v-else>
      <div class="flex justify-center items-center flex-col gap-16">
        <EmptyState />
        <p class="min-w-[400px] text-center">
          Vous n’avez ajouté aucun terminal pour le moment, cliquez sur le
          bouton pour ajouter
        </p>
        <v-button variant="primary" @click="onActionClick"
          >Ajouter un terminal</v-button
        >
      </div>
    </template>
  </App>
  <router-view></router-view>
</template>
<script setup lang="ts">
import EmptyState from "@/assets/svg/empty-state-devices.vue";
import { ref, computed, type ComputedRef, type Ref, watch } from "vue";
import { useRouter } from "vue-router";
import { timeAgo } from "@/utils/time-ago";
import Action from "@/components/Action.vue";
import type { TableHeaders } from "@/types/Datatable";
import type Device from "@/types/entities/device";
import { useFetchDevices } from "@/api/devices";

import Agent from "@/components/Agent.vue";
const tableHeaders: TableHeaders[] = [
  { label: "Nom", field: "reference" },
  // { label: "Agent", field: "agent" },
  { label: "Connexion ", field: "enable" },
  { label: "Dernière connexion", field: "lastConnexion" },
  { label: "Conformité", field: "compliance" },
  { label: "Action", field: "actions", class: "w-60" },
];

const router = useRouter();

const devices: Ref<Device[]> = ref([]);
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
  registerSuccessCallback: onDevicesFetched,
  execute,
  isLoading,
} = useFetchDevices();

// ---------- Api Hooks LifeCycle -----------
onDevicesFetched((data) => {
  devices.value = data.items;
  totalItems.value = data.totalItems;
});

const selected: Ref = ref([]);

// const devicesWithUser: ComputedRef<Device[]> = computed((): Device[] => {
//   if (devices.value.length > 0) {
//     return devices.value.map((device) => {
//       device.agent = Promise.resolve(gofetchUser(device.agent));
//       return device;
//     });
//   }
//   return [];
// });

const actions = [
  {
    name: "Voir détails",
    icon: "eye",
    callback: () => {},
  },
  {
    name: "Attribuer à un agent",
    icon: "attribution",
    callback: onAttributeClick,
  },
  {
    name: "Modifier le terminal",
    icon: "update",
    callback: () => {},
  },
  {
    name: "Désactiver le terminal",
    icon: "delete",
    callback: onActionClick,
  },
];
function onActionClick() {
  router.push({ name: "devices.add" });
}
function onAttributeClick() {
  router.push({
    name: "devices.attribute",
    params: {
      id: selected.value[0].id,
    },
  });
}

watch(currentPage, () => {
  execute({
    params: params.value,
  });
});

const onSearchChange = (srch: string) => {
  if (!srch.length) execute();
  currentPage.value = 1;
  search.value = srch;
  execute({
    params: params.value,
  });
};
</script>
<style lang=""></style>
