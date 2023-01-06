<template>
  <div>
    <template v-if="!isFinish">
      <v-modal
        v-model="isModalActive"
        title="Attribuer à un agent"
        class="rounded-lg p-9 w-full max-w-3xl"
        no-footer
        @close="onClose"
      >
        <template #title v-if="step === 2">
          <div class="flex gap-11">
            <Icon name="arrow" @click="step = 1" class="cursor-pointer" />
            Attribuer à un agent
          </div>
        </template>
        <div class="flex gap-10 my-10">
          <div class="p-6 bg-[#2F666F1A] rounded-2xl">
            <img src="/terminal.png" alt="" />
          </div>
          <div class="flex flex-1 flex-col gap-6">
            <VDatalist
              @keyup.enter="
                () => {
                  if (isItemSet) {
                    step = 2;
                  }
                }
              "
              v-show="step === 1"
              :items="users"
              ref="data_list"
            />
            <AgentInfo v-show="step === 2" :agent="selected" />
            <v-button
              :disabled="!isItemSet"
              class="bg-primary-ligth disabled:opacity-50"
              >Attribuer</v-button
            >
          </div>
        </div>
      </v-modal>
    </template>

    <template v-else>
      <v-modal
        v-model="isFinish"
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
import { computed, onMounted, watch, type Ref } from "vue";
import { ref } from "vue";
import Button from "@/components/Button.vue";
import { Badge } from "@preuve-de-vie/ui/Atoms";
import { useRouter } from "vue-router";
import VDatalist from "@/components/VComboList.vue";
import { useFetchUsers } from "@/api/users";
import type User from "@/types/entities/user";
import AgentInfo from "@/components/AgentInfo.vue";
const router = useRouter();

const { execute, registerSuccessCallback } = useFetchUsers();

registerSuccessCallback((data) => {
  users.value = data.items;
});
onMounted(() => {
  execute();
});
const data_list = ref<InstanceType<typeof VDatalist> | null>(null);
const selected = computed(() => {
  if (data_list.value) {
    return data_list.value.selectedItem;
  }
  return;
});

watch(selected, async (newValue) => {
  if (isItemSet) {
    step.value = 2;
  }
});
const step = ref(1);
const isItemSet = computed(() => {
  if (selected.value && selected.value !== null) {
    return true;
  }
  return false;
});

const users: Ref<User[]> = ref([]);
const isFinish: Ref<boolean> = ref(false);
const isModalActive: Ref<boolean> = ref(true);
function onClose() {
  router.push({ name: "devices.index" });
}
</script>
<style lang=""></style>
