<template>
  <div class="h-full overflow-hidden flex flex-col gap-6">
    <div class="flex justify-between">
      <div class="flex gap-4">
        <Icon name="arrow" class="cursor-pointer" @click="back" />
        <div class="">
          <div class="font-bold text-xl">
            Preuve de vie de {{ proofs?.firstName }} {{ proofs?.lastName }}
          </div>
          <div class="flex gap-2 items-center text-functional-grey">
            <v-label
              v-if="proofs"
              :color="proofState[proofs.status].color"
              :text="proofState[proofs.status].text"
            />
            |
            <div class="font-semibold">
              <span class="">Date d’enregistrement : </span>
              <span v-if="proofs" class="text-black">
                {{ formatDate(new Date(proofs.proofDeviceCreatedDate)) }}</span
              >
              <!-- <span v-if="proofs" class="text-black">
              {{ proofs.createdAt }}</span
            > -->
            </div>
          </div>
        </div>
      </div>
      <v-button v-if="proofs?.status == ProofStatusEnum.PENDING">
        <div class="flex items-center gap-3">
          <Icon name="settings" />Vérifier
        </div></v-button
      >
    </div>

    <hr class="bg-functional-grey-2 h-[1px]" />
    <div class="flex-1 bg-white rounded-lg flex flex-col gap-8 py-4 px-6">
      <div class="">
        <h1 class="font-bold text-lg text-text-primary mb-4">
          Informations personnelles du pensionné
        </h1>
        <div class="grid grid-cols-3 grid-rows-2 gap-6">
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Nom</h3>
            {{ proofs?.firstName }}
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Prénom(s)</h3>
            {{ proofs?.lastName }}
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Date de naissance</h3>
            <span v-if="proofs">Néant</span>
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Lieu de naissance</h3>
            Néant
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">N° de la carte</h3>
            Néant
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">
              Date d’exiration de la carte
            </h3>
            Néant
          </div>

          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">N° matricule</h3>
            {{ proofs?.registrationNumber }}
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Téléphone</h3>
            {{ proofs?.phone }}
          </div>
        </div>
      </div>

      <hr class="bg-functional-grey-2 h-[1px]" />

      <div class="">
        <h1 class="font-bold text-lg text-text-primary mb-4">
          Infos sur l’enregistrement
        </h1>
        <div class="grid grid-cols-3 grid-rows-1 gap-6">
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Lieu</h3>
            Commissariat d’Aidjèdo
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Date de reception</h3>
            <span v-if="proofs">{{
              formatDate(new Date(proofs?.createdAt))
            }}</span>
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Heure de reception</h3>
            12:39
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Device</h3>
            {{ device?.reference }}
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Agent</h3>
            Néant
          </div>
          <div class="text-functional-grey">
            <h3 class="font-semibold text-black">Plateforme</h3>
            Android
          </div>
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>
<script setup lang="ts">
import { useFetchProof } from "@/api/proofs";
import type Proof from "@/types/entities/proof";
import { ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate } from "@/utils/format-date";
import { useFetchUser } from "@/api/users";
import { useFetchDevice } from "@/api/devices";
import { ProofStatusEnum } from "@/types/entities/proof";
import { proofState } from "@/constants";
import type Device from "@/types/entities/device";
const router = useRouter();
const route = useRoute();

const { registerSuccessCallback: onProofFetched } = useFetchProof(
  route.params.id + ""
);

const { registerSuccessCallback: onUserFetched, execute } = useFetchUser();
const { registerSuccessCallback: onDeviceFetched, execute: fetchDevice } =
  useFetchDevice();

// ---------- Api Hooks LifeCycle -----------
onProofFetched((data) => {
  proofs.value = data;
  fetchDevice({
    routeParams: {
      deviceId: proofs.value.deviceId,
    },
  });
});
onDeviceFetched((data) => {
  device.value = data;
});

const proofs: Ref<Proof | undefined> = ref();
const device: Ref<Device | undefined> = ref();

function back() {
  router.back();
}
</script>
<style lang=""></style>
