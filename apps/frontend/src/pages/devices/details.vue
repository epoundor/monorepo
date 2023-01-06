<template>
  <div class="h-full overflow-hidden flex flex-col gap-6">
    <div class="flex justify-between">
      <div class="flex gap-4">
        <Icon name="arrow" class="cursor-pointer" @click="back" />
        <div class="">
          <div class="font-bold text-xl">{{ device?.reference }}</div>
          <div class="flex gap-2 items-center text-functional-grey">
            <v-label color="green" text="Conforme" /> |
            <div class="font-semibold">
              <span class="">Dernière connexion : </span>
              <span v-if="device" class="text-black">
                {{ timeAgo(new Date(device.createdAt)) }}</span
              >
              <!-- <span v-if="proofs" class="text-black">
              {{ proofs.createdAt }}</span
            > -->
            </div>
          </div>
        </div>
      </div>
    </div>
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
      searchPlaceholder="Rechercher une preuve de vie"
      :items="proofs"
      @update:currentPage="() => {}"
      :on-search-change="onSearchChange"
      class="flex-1"
    >
      <template #cell(pensioner)="proof">
        {{ proof.item.firstName }} {{ proof.item.lastName }}
      </template>

      <template #cell(createdAt)="{ value: date }">
        {{ new Date(date).toDateString() }}
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
</template>
<script setup lang="ts">
import { useFetchProofsByDevice } from "@/api/proofs";
import { useFetchDevice } from "@/api/devices";
import type Proof from "@/types/entities/proof";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ProofStatusEnum } from "@/types/entities/proof";
import { timeAgo } from "@/utils/time-ago";
import type { TableHeaders } from "@/types/Datatable";
import { proofState } from "@/constants";
import type Device from "@/types/entities/device";
import ProofAction from "@/components/ProofAction.vue";

const router = useRouter();
const route = useRoute();

const device: Ref<Device | undefined> = ref();
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
const { registerSuccessCallback: onDeviceFetched, execute: fetchDevice } =
  useFetchDevice();
const {
  registerSuccessCallback: onProofsFetched,
  execute,
  isLoading,
} = useFetchProofsByDevice();

const tableHeaders: TableHeaders[] = [
  { label: "N° Matricule", field: "registrationNumber", class: "w-88" },
  { label: "Pensionné", field: "pensioner" },
  { label: "Enregistré le ", field: "createdAt" },
  { label: "Statut", field: "status" },
  { label: "Action", field: "actions", class: "w-56" },
];

// ---------- Api Hooks LifeCycle -----------
onDeviceFetched((data) => {
  device.value = data;
});
onProofsFetched((data) => {
  proofs.value = data.items;
  totalItems.value = data.totalItems;
});
// ---------- Api Hooks handle -------------
onMounted(() => {
  fetchDevice({ routeParams: { id: String(route.params.id) } });
});
const selected: Ref = ref([]);

watch(device, () => {
  if (!device.value) return;
  execute({
    routeParams: { deviceId: device.value.id },
  });
});

const back = () => {
  router.push({ name: "devices.index" });
};

const statusUpdate = (proof: Proof) => {
  const changedItem = proofs.value.findIndex((el) => el.id === proof.id);
  proofs.value[changedItem] = proof;
};
const onSearchChange = (srch: string) => {
  if (!srch.length) execute();

  search.value = srch;
  currentPage.value = 1;
  if (!device.value) return;
  execute({
    routeParams: { deviceId: device.value.id },
    params: params.value,
  });
};
</script>
