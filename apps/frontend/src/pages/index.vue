<template>
  <App title="Tableau de bord">
    <div class="flex flex-col pb-4 gap-6 h-full">
      <div class="grid grid-cols-4 gap-6 h-24">
        <StatBand
          color="#2E5AAC"
          label="Total de preuve de vie"
          :value="stats.total"
          icon="life-proof"
          background-color="#EEF2FA"
        />
        <StatBand
          color="#005700"
          label="Preuve de vie validées"
          :value="stats.valid"
          icon="life-proof"
          background-color="#E1ECE1"
        />
        <StatBand
          color="#DA1414"
          label="Preuve de vie invalidées"
          :value="stats.invalid"
          icon="life-proof"
          background-color="#FDE3E3"
        />
        <StatBand
          color="#CC6517"
          label="Preuve de vie en attente"
          :value="stats.pending"
          icon="life-proof"
          background-color="#FFE7D5"
        />
      </div>
      <div class="flex justify-between">
        <span class="font-bold text-xl">Derniers enregistrements</span>
        <router-link
          :to="{ name: 'lifeproof.index' }"
          class="text-blue-500 underline"
          >Voir tous</router-link
        >
      </div>

      <v-data-table
        :with-filters="false"
        v-model:selected="selected"
        fixed-headers
        select-row-on-click
        :loading="isLoading"
        :page-size="10"
        :headers="tableHeaders"
        :items="proofs"
        @update:currentPage="() => {}"
        class="flex-1"
      >
        <template #cell(pensioner)="proof">
          <Suspense>
            {{ proof.item.firstName }} {{ proof.item.lastName }}
            <template #fallback> ... </template>
          </Suspense>
        </template>

        <template #cell(createdAt)="{ value: date }">
          {{ formatDate(new Date(date)) }}
        </template>

        <template #cell(status)="{ value: state }">
          <v-label
            :color="proofState[state].color"
            :text="proofState[state].text"
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
</template>
<script setup lang="ts">
import App from "@/components/App.vue";
import StatBand from "@/components/StatBand.vue";
import { useFetchStats } from "@/api/proofs";
import { useFetchLastProofs } from "@/api/proofs";
import { proofState } from "@/constants";
import ProofAction from "@/components/ProofAction.vue";

import { reactive, ref, type Ref } from "vue";
import type Stat from "@/types/apiResponses/stats";
import type Proof from "@/types/apiResponses/proofs";
import type { TableHeaders } from "@/types/Datatable";
import { formatDate } from "@/utils/format-date";
import { ProofStatusEnum } from "@/types/entities/proof";
import { useRouter } from "vue-router";
const router = useRouter();

const tableHeaders: TableHeaders[] = [
  { label: "N° Matricule", field: "registrationNumber", class: "w-88" },
  { label: "Pensionné", field: "pensioner" },
  { label: "Enregistré le ", field: "proofDeviceCreatedDate" },
  { label: "Statut", field: "status" },
  { label: "Action", field: "actions", class: "w-56" },
];
const selected: Ref = ref([]);

const proofs: Ref<Proof[] | never[]> = ref([]);
let stats: Ref<Stat> = ref({
  total: 0,
  invalid: 0,
  valid: 0,
  pending: 0,
});
// ---------- Api Hooks handle -------------
const { registerSuccessCallback: onStatsFetched, execute } = useFetchStats();
const { registerSuccessCallback: onLastProofFetched, isLoading } =
  useFetchLastProofs();

// ---------- Api Hooks LifeCycle -----------
onStatsFetched((data) => {
  stats.value = data;
});

onLastProofFetched((data) => {
  proofs.value = data.items;
});

const statusUpdate = (proof: Proof) => {
  const changedItem = proofs.value.findIndex((el) => el.id === proof.id);
  proofs.value[changedItem] = proof;
  execute();
};
</script>
<style lang=""></style>
