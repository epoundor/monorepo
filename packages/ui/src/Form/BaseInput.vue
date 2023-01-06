<template>
  <div
    data-widget-item="baseinput"
    class="preference flex flex-col items-baseline relative"
  >
    <label
      v-if="label"
      class="baseinput-label text-sm text-left leading-[1.125rem] -tracking-[0.1px] opacity-80 text-black font-semibold mb-2"
      :for="name"
    >
      <span>{{ label }}</span
      >&thinsp;<span
        v-if="required"
        style="color: #da1414"
        class="text-left text-DA1414 font-semibold opacity-80 text-xs leading-5"
        >*</span
      >
    </label>

    <div
      class="bg-white border-2 baseinput-core w-full rounded-lg py-3 px-4 flex flex-shrink flex-nowrap items-center space-x-2"
      :class="{ error: hasError, success: hasSuccess, s: true }"
    >
      <span v-if="$slots.icon" class="inline-flex flex-shrink-0">
        <slot name="icon" />
      </span>
      <!-- type number input -->
      <input
        v-if="type === BaseInputType.NUMBER"
        :id="name"
        :placeholder="placeholder"
        class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent"
        :type="type"
        :autocomplete="shouldBeAutoCompleted(type)"
        spellcheck="false"
        :name="name"
        :value="inputValue"
        :min="min"
        :max="max"
        :step="step"
        @input="emitUpdateEvent($event)"
      />
      <!-- all except type number input -->
      <input
        v-else
        :id="name"
        :placeholder="placeholder"
        class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent"
        :type="viewPassword ? 'text' : type"
        :name="name"
        :value="inputValue"
        :autocomplete="shouldBeAutoCompleted(type)"
        spellcheck="false"
        @input="emitUpdateEvent($event)"
      />
      <template v-if="type === 'password'">
        <span
          class="cursor-pointer inline-flex flex-shrink-0"
          @click="viewPassword = !viewPassword"
        >
          <Icon v-if="!viewPassword" name="EyeIcon" />
          <Icon v-if="viewPassword" name="NoEyeIcon" />
        </span>
      </template>
    </div>

    <!-- error message -->
    <div
      v-if="hasError"
      class="rounded-lg w-full bg-danger-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <Icon name="ErrorIcon" />
      </span>
      <span class="text-xs text-danger font-medium">{{
        errorMessage || validationErrMessage || "Email non trouvé"
      }}</span>
    </div>

    <!-- success message -->
    <div
      v-if="hasSuccess"
      class="rounded-lg w-full bg-primary-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <Icon name="GreenInfoIcon" />
      </span>
      <span class="text-xs text-primary font-medium">{{
        successMessage || ""
      }}</span>
    </div>

    <!-- any slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, withDefaults, ref } from "vue";
import Icon from "@/components/Icon.vue";
import BaseInputType from "@/constants/input-type";

interface Props {
  cinput?: string;
  modelValue?: String | Number;
  label?: string;
  hasSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  type?: BaseInputType;
  name?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cinput: "py-3",
  label: "",
  hasSuccess: false,
  successMessage: "",
  errorMessage: "",
  placeholder: "",
  type: BaseInputType.TEXT,
  required: false,
  name: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", target: any): void;
  (e: "change", target: any): void;
}>();

const {
  value: inputValue,
  errorMessage: validationErrMessage,
  handleChange,
} = useField(props.name, undefined, {
  initialValue: props.modelValue ?? "",
});
const viewPassword = ref(false);

const hasError = computed(() => {
  return validationErrMessage.value !== undefined || props.errorMessage !== "";
});

function emitUpdateEvent(event: Event) {
  emit("update:modelValue", (event.target as any).value);
  emit("change", (event.target as any).value);
  handleChange(event);
}

function shouldBeAutoCompleted(type: string) {
  let complete = "";
  switch (type) {
    case "password":
      complete = "new-password";
      break;
    case "text":
      complete = "on";
      break;
    default:
      complete = "off";
      break;
  }
  return complete;
}
</script>

<style scoped lang="scss">
// v::deep .cinput {
// }

::placeholder {
  font-weight: 600;
  color: #6d7580;
  @apply text-sm;
}

.error {
  background: #feefef;
  border: 1px solid #da1414;
}

.success {
  background: #edf9f0;
  border: 1px solid #287d3c;
}

.error input {
  -webkit-box-shadow: 0 0 0px 1000px #feefef inset !important;
}

.success input {
  -webkit-box-shadow: 0 0 0px 1000px #edf9f0 inset !important;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

input::-ms-reveal,
input::-ms-clear {
  display: none;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
