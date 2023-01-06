<template>
  <TransitionRoot appear :show="isOpened" as="template">
    <Dialog as="div" @close="close">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="min-h-screen flex items-center justify-center"
          :class="{ 'px-4': !paddingless }"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-black bg-opacity-20" />
          </TransitionChild>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="relative my-8 text-left align-middle transition-all transform bg-white shadow"
              :class="[
                contentClass,
                { 'overflow-hidden': !preserveOverflow, 'p-6': !paddingless },
              ]"
            >
              <div
                v-if="!noHeader && ready"
                class="absolute top-4 right-4 flex"
              >
                <slot name="header-actions" />
                <button
                  v-if="!persistent"
                  class="w-7 h-7 ml-4 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-300"
                  @click="close"
                >
                  <Icon name="close" />
                </button>
              </div>

              <DialogTitle
                v-if="!noHeader && ready"
                as="h3"
                class="text-2xl font-bold leading-6 text-gray-900"
              >
                <slot name="title">
                  {{ title }}
                </slot>
              </DialogTitle>

              <div :class="[bodyClass, { 'mt-4': !noHeader }]" v-if="ready">
                <slot />
              </div>

              <slot v-if="!noFooter && ready" name="footer">
                <div class="mt-6 flex gap-6 justify-between">
                  <v-button
                    block
                    outline
                    type="button"
                    class=""
                    variant="minimal"
                    :disabled="loading"
                    @click="onCancelClick"
                  >
                    {{ cancelText }}
                  </v-button>

                  <v-button
                    block
                    type="button"
                    :class="okTextClass"
                    :loading="loading"
                    @click="onOkClick"
                  >
                    {{ okText }}
                  </v-button>
                </div>
              </slot>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";

import { useVModel } from "@vueuse/core";
import { computed, watch } from "vue";

export default {
  inheritAttrs: false,

  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: false,
    },

    cancelText: {
      type: String,
      default: "Annuler",
    },

    okText: {
      type: String,
      default: "Ok",
    },
    okTextClass: {
      type: String,
      default: "bg-primary",
    },
    loading: {
      type: Boolean,
      loading: false,
    },
    ready: {
      type: Boolean,
      default: true,
    },

    noFooter: {
      type: Boolean,
      default: false,
    },

    noHeader: {
      type: Boolean,
      default: false,
    },

    paddingless: {
      type: Boolean,
      default: false,
    },

    preserveOverflow: {
      type: Boolean,
      default: false,
    },

    persistent: {
      type: Boolean,
      default: false,
    },

    bodyClass: {
      type: String,
      default: "",
    },
  },

  emits: ["close", "open", "click:ok", "click:cancel", "update:modelValue"],

  setup(props, { emit, attrs }) {
    const isOpened = useVModel(props, "modelValue", emit);
    const contentClass = computed(() => attrs.class);
    watch(isOpened, (newValue) => {
      if (!newValue) {
        emit("close");
      }
    });

    const close = () => {
      if (!props.persistent) {
        isOpened.value = false;
      }
    };

    const open = () => {
      isOpened.value = true;
      emit("open");
    };

    const onOkClick = () => {
      emit("click:ok");
    };

    const onCancelClick = () => {
      isOpened.value = false;
      emit("click:cancel");
    };

    return {
      isOpened,
      contentClass,
      open,
      close,
      onOkClick,
      onCancelClick,
    };
  },
};
</script>
