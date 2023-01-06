<template>
  <div
    data-test="agent-info"
    class="border-2 border-primary-ligth rounded-2xl h-4/6 gap-6 p-6 flex"
  >
    <div class="">
      <img src="/person-circle-outline.png" alt="" />
    </div>
    <div class="flex flex-col gap-4">
      <div class="text-functional-grey text-sm">
        Nom & Prénom (s)
        <h3 class="font-medium text-base text-black">
          {{ agent?.firstName }} {{ agent?.lastName }}
        </h3>
      </div>
      <div class="text-functional-grey text-sm">
        Téléphone
        <h3 class="font-medium text-base text-black">{{ agent?.phone }}</h3>
      </div>
      <div class="text-functional-grey text-sm">
        Lieu d’affectation
        <h3 class="font-medium text-base text-black">
          Littoral, Akpakpa, Avotrou
        </h3>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  agent?: {
    lastName: string;
    firstName: string;
    phone: string;
    placeAssignments: string;
  };
}>();
</script>
<style lang=""></style>
