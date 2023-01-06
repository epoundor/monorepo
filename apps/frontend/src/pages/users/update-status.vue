<template>
  <div>
    <template v-if="!updatedStatus">
      <v-modal
        v-model="isModalActive"
        :title="
          isAnActivation
            ? 'Activer cet utilisateur'
            : 'Désactiver cet utilisateur'
        "
        class="rounded-lg w-full max-w-lg p-8"
        :okText="isAnActivation ? 'Activer' : 'Oui, supprimer'"
        @click:ok="updateStatus"
        @close="onClose"
        :okTextClass="isAnActivation ? undefined : 'bg-red-700'"
        :loading="isEableUser || isDisableUser"
        :ready="!isLoading"
      >
        <p class="text-center text-xl font-semibold my-8">
          Êtes-vous sur de vouloir
          {{ isAnActivation ? "activer" : "désactiver" }} cet utilisateur ?
        </p>
      </v-modal>
    </template>
    <template v-else>
      <v-modal
        v-model="isModalActive"
        noHeader
        class="rounded-lg w-full max-w-lg p-8"
        @close="onClose"
      >
        <div class="flex flex-col items-center gap-6 px-6">
          <Badge icon="check" color="#3FD578" />
          <div class="font-bold text-xl">
            Utilisateur {{ isAnActivation ? "activé" : "désactivé" }} avec
            succès
          </div>
        </div>
        <template #footer>
          <div class="flex mt-6">
            <v-button class="flex-1" variant="primary" @click="onClose" block
              >Terminer</v-button
            >
          </div>
        </template>
      </v-modal>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { Badge } from "@preuve-de-vie/ui/Atoms";

import { useRouter, useRoute } from "vue-router";
import {
  useFetchUser,
  useFetchUsers,
  useEnableUser,
  useDisableUser,
} from "@/api/users";
import type User from "@/types/entities/user";
const router = useRouter();
const route = useRoute();

const {
  registerSuccessCallback: onUserFetched,
  execute,
  isLoading,
} = useFetchUser();

const { execute: fetchUser } = useFetchUsers();

const {
  registerSuccessCallback: onEnableFetched,
  execute: enableUser,
  isLoading: isEableUser,
} = useEnableUser();

const {
  registerSuccessCallback: onDisableFetched,
  execute: disableUser,
  isLoading: isDisableUser,
} = useDisableUser();

const onSucess = () => {
  updatedStatus.value = true;
  fetchUser();
};
// ---------- Api Hooks LifeCycle -----------
onUserFetched((data) => {
  user.value = data;
});
onEnableFetched(() => {
  onSucess();
});
onDisableFetched(() => {
  onSucess();
});

onMounted(() => {
  execute({
    routeParams: { id: route.params.id + "" },
  });
});
const isModalActive: Ref<boolean> = ref(true);
// ~~ operator to transform string to number
// !! operator to transform number to bool
const user: Ref<User | undefined> = ref();
const isAnActivation: ComputedRef<boolean | undefined> = computed(() => {
  return !user.value?.enable;
});
const updatedStatus: Ref<boolean> = ref(false);

function onClose() {
  router.push({ name: "users.index" });
}
function updateStatus() {
  if (isAnActivation.value) {
    enableUser({
      routeParams: { id: route.params.id + "" },
    });
  } else {
    disableUser({
      routeParams: { id: route.params.id + "" },
    });
  }
}
</script>
<style lang=""></style>
