<template>
  <span>
    <slot name="trigger" :on="events" />
    <v-modal
      v-model="isModalActive"
      :loading="loading"
      :title="title"
      :cancel-text="cancelActionText"
      :ok-text="confirmActionText"
      class="rounded-lg w-lg"
      @click:ok="onConfirmClick"
    >
      <p v-html="description"></p>
    </v-modal>
  </span>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Voulez-vous vraiment exécuter cette action ?",
  },

  description: {
    type: String,
    default: "",
  },

  cancelActionText: {
    type: String,
    default: "Annuler",
  },

  confirmActionText: {
    type: String,
    default: "Oui",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm"]);

const isModalActive = ref(false);
const events = {
  click() {
    isModalActive.value = true;
  },
};

function onConfirmClick() {
  emit("confirm");
  isModalActive.value = false;
}
</script>
