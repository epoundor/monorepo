<template>
  <div>
    <template v-if="!isAdded">
      <v-modal
        v-model="isModalActive"
        title="Ajouter un terminal"
        class="rounded-lg w-full max-w-lg"
        @close="onClose"
      >
        <form action="" class="flex flex-col gap-6 mt-8">
          <BaseInput label="Référence du terminal" v-model="reference" />
        </form>
        <template #footer>
          <div class="flex mt-6">
            <v-button
              variant="primary"
              block
              :loading="isLoading"
              @click="addDevice"
              >Ajouter</v-button
            >
            <!-- <Button label="Ajouter" class="flex-1" @click="addDevice" /> -->
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
          <div class="font-bold text-xl">Terminal ajouté avec succès</div>
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
import { useCreateDevice } from "@/api/devices";
const router = useRouter();
// ---------- Api Hooks handle -------------
const {
  registerSuccessCallback: onDevicesCreate,
  execute,
  isLoading,
} = useCreateDevice();

// ---------- Api Hooks LifeCycle -----------
onDevicesCreate((data) => {
  isAdded.value = true;
});

const isAdded: Ref<boolean> = ref(false);
const isModalActive: Ref<boolean> = ref(true);
const reference: Ref<string> = ref("");

function onClose() {
  router.push({ name: "devices.index" });
}
function addDevice() {
  execute({
    data: {
      reference: reference.value,
    },
  });
}
</script>
<style lang=""></style>
