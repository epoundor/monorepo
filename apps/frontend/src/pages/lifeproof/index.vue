<template>
  <App title="Preuves de vie">
    <div class="flex flex-col pb-4 gap-6 h-full">
      <v-data-table
        v-model:selected="selected"
        v-model:currentPage="currentPage"
        fixed-headers
        select-row-on-click
        server-side
        :total-items="totalItems"
        :loading="isLoading"
        :page-size="perPage"
        :headers="tableHeaders"
        searchPlaceholder="Rechercher une preuve de vie"
        :items="proofs"
        @update:currentPage="() => {}"
        class="flex-1"
        :on-search-change="onSearchChange"
      >
        <template #filters>
          <div class="flex gap-4">
            <v-button outline>
              <div class="flex items-center gap-3 font-bold">
                <Icon name="filter" /> Filter
              </div>
            </v-button>
            <v-button variant="primary">
              <div class="flex items-center gap-3 font-bold">
                <Icon name="download" /> Télécharger
              </div>
            </v-button>
          </div>
        </template>

        <template #cell(pensioner)="proof">
          {{ proof.item.firstName }} {{ proof.item.lastName }}
        </template>

        <template #cell(proofDeviceCreatedDate)="{ value: date }">
          {{ formatDate(new Date(date)) }}
        </template>
        <template #cell(status)="{ value: status }">
          <v-label
            :color="proofState[status].color"
            :text="proofState[status].text"
          />
        </template>

        <template #cell(actions)="item">
          <div
            class="hover:opacity-100 flex opacity-0 w-full gap-4 justify-center"
            :class="{
              'opacity-100': selected[0] && selected[0].id === item.item.id,
            }"
          >
            <ProofAction
              :id="item.item.id"
              :status="item.item.status"
              @update:status="statusUpdate"
            />
          </div>
        </template>
      </v-data-table>
    </div>
  </App>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { proofState } from "@/constants";
import { computed, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import type { TableHeaders } from "@/types/Datatable";
import { useFetchProofs } from "@/api/proofs";
import type Proof from "@/types/entities/proof";
import { ProofStatusEnum } from "@/types/entities/proof";
import { formatDate } from "@/utils/format-date";
import ProofAction from "@/components/ProofAction.vue";
// ------------- Constants ------------
const tableHeaders: TableHeaders[] = [
  { label: "N° Matricule", field: "registrationNumber", class: "w-88" },
  { label: "Pensionné", field: "pensioner" },
  { label: "Enregistré le ", field: "proofDeviceCreatedDate" },
  { label: "Statut", field: "status" },
  { label: "Action", field: "actions", class: "w-56" },
];

const proofs: Ref<Proof[] | never[]> = ref([]);
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
  registerSuccessCallback: onProofsFetched,
  execute,
  isLoading,
} = useFetchProofs();

// ---------- Api Hooks LifeCycle -----------
onProofsFetched((data) => {
  proofs.value = data.items;
  totalItems.value = data.totalItems;
});

const selected: Ref = ref([]);

onMounted(() => {
  execute({
    params: params.value,
  });
});

watch(currentPage, () => {
  execute({
    params: params.value,
  });
});

const onSearchChange = (srch: string) => {
  if (!srch.length) execute();

  search.value = srch;
  currentPage.value = 1;
  execute({
    params: params.value,
  });
};

const statusUpdate = (proof: Proof) => {
  const changedItem = proofs.value.findIndex((el) => el.id === proof.id);
  proofs.value[changedItem] = proof;
};
</script>
<style lang=""></style>
