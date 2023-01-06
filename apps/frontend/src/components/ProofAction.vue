<template>
  <v-button
    data-test="proof-action"
    outline
    v-if="status == ProofStatusEnum.PENDING"
    @click="verify"
  >
    <div class="flex items-center gap-2 font-bold">
      <Icon v-if="!isLoading" name="settings" class="text-primary" />
      <Icon v-else name="loading" class="text-primary animate-spin" /> Vérifier
    </div>
  </v-button>
  <v-button outline @click="seeDetails">
    <div class="flex items-center gap-2 font-bold">
      <Icon name="eye" /> Voir
    </div>
  </v-button>
</template>
<script setup lang="ts">
import { useProofVerify } from "@/api/proofs";
import { ProofStatusEnum } from "@/types/entities/proof";
import { useRouter } from "vue-router";
const { execute, isLoading, registerSuccessCallback } = useProofVerify();
const props = defineProps<{ status: ProofStatusEnum; id: string }>();
const emit = defineEmits(["update:status"]);
const router = useRouter();
registerSuccessCallback((data) => {
  emit("update:status", data);
});
const seeDetails = () => {
  router.push({
    name: "lifeproof.details",
    params: {
      id: props.id,
    },
  });
};

const verify = () => {
  execute({
    routeParams: {
      id: String(props.id),
    },
  });
};
</script>
<style lang=""></style>
