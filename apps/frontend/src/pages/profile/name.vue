<template>
  <div>
    <template v-if="!isAdded">
      <v-modal
        v-model="isModalActive"
        title="Modifier mon nom"
        class="rounded-lg w-full max-w-lg"
        @close="onClose"
      >
        <form action="" class="flex flex-col gap-6 mt-8">
          <BaseInput label="Nom" />
          <BaseInput label="Prénom (s)" />
        </form>
        <template #footer>
          <div class="flex mt-6">
            <Button label="Modifier" class="flex-1" @click="updateUser" />
          </div>
        </template>
      </v-modal>
    </template>

    <template v-else>
      <v-modal
        v-model="isAdded"
        noHeader
        class="rounded-lg w-full max-w-lg"
        @close="onClose"
      >
        <div class="flex flex-col items-center gap-6 px-6">
          <Badge icon="check" color="#3FD578" />
          <div class="font-bold text-xl">Nom modifié avec succès</div>
        </div>
        <template #footer>
          <div class="flex mt-6">
            <Button label="Terminer" class="flex-1" @click="onClose" />
          </div>
        </template>
      </v-modal>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import Button from "@/components/Button.vue";
import { Badge } from "@preuve-de-vie/ui/Atoms";

import { useRouter } from "vue-router";

const router = useRouter();

const isAdded: Ref<boolean> = ref(false);
const isModalActive: Ref<boolean> = ref(true);
function onClose() {
  router.push({ name: "profile.index" });
}
function updateUser() {
  isAdded.value = true;
}
</script>
<style lang=""></style>
