<template>
  <div>
    <template v-if="!isAdded">
      <v-modal
        v-model="isModalActive"
        title="Ajouter un utilisateur"
        class="rounded-lg w-full max-w-lg"
        @close="onClose"
      >
        <form action="" class="flex flex-col gap-6 mt-8">
          <BaseInput label="Nom" v-model="dto.firstName" />
          <BaseInput label="Prénom (s)" v-model="dto.lastName" />
          <BaseInput label="Email" type="email" v-model="dto.email" />
          <VList label="Rôle" :items="roles" v-model="dto.role" />
        </form>
        <template #footer>
          <div class="flex mt-6">
            <Button label="Ajouter" class="flex-1" @click="addUser" />
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
          <div class="font-bold text-xl">Utilisateur ajouté avec succès</div>

          <p class="text-center">
            Une invitation à rejoindre le backoffice a été envoyé à
            <span class="font-bold">ayomindeida@gmail.com</span>
          </p>
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
<script lang="ts">
const roles = [
  { value: "ADMIN", name: "Administrateur" },
  { value: "AGENT", name: "Utilistateur" },
];
</script>
<script setup lang="ts">
import { reactive, type Ref } from "vue";
import { ref } from "vue";
import Button from "@/components/Button.vue";
import { Badge } from "@preuve-de-vie/ui/Atoms";

import { useRouter } from "vue-router";
import VList from "@/components/VList.vue";
import { useCreateUser } from "@/api/users";

const router = useRouter();
// ---------- Api Hooks handle -------------
const {
  registerSuccessCallback: onUserCreate,
  execute,
  isLoading,
} = useCreateUser();

const dto = reactive({
  email: "",
  role: "",
  lastName: "",
  firstName: "",
});
const isAdded: Ref<boolean> = ref(false);
const isModalActive: Ref<boolean> = ref(true);
function onClose() {
  router.push({ name: "users.index" });
}
onUserCreate(() => {
  isAdded.value = true;
});

async function addUser() {
  if (!dto.email) return;
  await execute({
    data: { ...dto },
  });
}
</script>
<style lang=""></style>
