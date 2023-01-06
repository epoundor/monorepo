<template>
  <div class="flex mt-20 gap-5 justify-center items-stretch">
    <div class="pt-10 px-6 bg-white rounded-2xl border text-center">
      <VProfileVue />
      <div class="text-2xl font-semibold">Homer Simson</div>
      <span class="text-functional-grey">hou.pinaisse@gmail.com</span>
    </div>
    <div class="flex flex-col max-w-2xl flex-1 gap-6">
      <div class="flex justify-between bg-white rounded-lg border p-6">
        <div>
          <h3 class="text-xs text-functional-grey">Nom et prénoms</h3>
          <span class="text-lg">Homer Simson</span>
        </div>
        <v-button outline @click="changeName">Modifier</v-button>
      </div>
      <div class="flex justify-between bg-white rounded-lg border p-6">
        <div>
          <h3 class="text-xs text-functional-grey">Email</h3>
          <span class="text-lg">hou.pinaisse@gmail.com</span>
        </div>
        <v-button outline @click="changeEmail">Modifier</v-button>
      </div>
      <div class="flex justify-between bg-white rounded-lg border p-6">
        <div>
          <h3 class="text-xs text-functional-grey">Mot de passe</h3>
          <span v-for="i in 'Homer Simson'.length" class="text-lg">*</span>
        </div>
        <v-button outline @click="changePassword">Modifier</v-button>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
import VProfileVue from "@/components/VProfile.vue";
import { useRouter } from "vue-router";

const router = useRouter();
function changeName() {
  router.push({ name: "profile.name" });
}
function changeEmail() {
  router.push({ name: "profile.email" });
}
function changePassword() {
  router.push({ name: "profile.password" });
}
</script>
<style lang=""></style>
