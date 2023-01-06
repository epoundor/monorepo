<template>
  <div id="base" class="w-screen h-screen flex relative">
    <div class="w-[480px] absolute right-56 bottom-40">
      <h1 class="font-bold text-3xl text-white mb-11">
        Plateforme d’enregistrement de preuve de vie
      </h1>
      <div class="bg-white p-10 text-2xl rounded-2xl flex flex-col gap-6">
        <h2 class="mb-4 font-bold">Connexion</h2>
        <BaseInput label="Email/Téléphone" />
        <BaseInput label="Mot de passe" type="password" />
        <v-button variant="primary">Se connecter</v-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseInput from "@/components/Form/BaseInput.vue";
</script>
<style lang="css">
#base {
  background: url("/login-image.png") no-repeat bottom left,
    url("/poligon-1.png") no-repeat top right 20px,
    url("/poligon-2.png") no-repeat bottom 110px left;

  @apply bg-[#2F666F];
}
</style>
