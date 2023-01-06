<template>
  <div class="flex flex-col relative gap-2">
    <span class="font-semibold text-sm">{{ label }}</span>
    <Listbox v-model="selectedItem">
      <ListboxButton
        data-test="data-list-button"
        class="bg-[#F6F9FA] border-2 baseinput-core w-full rounded-lg py-3 px-4 flex justify-between flex-shrink flex-nowrap items-center space-x-2 s"
        >{{ selectedItem.name }} <Icon name="chevron"
      /></ListboxButton>
      <ListboxOptions
        data-test="data-list-options"
        class="absolute overflow-auto max-h-20 bg-white top-16 z-20 w-full shadow-lg rounded-lg border mt-4 p-4"
      >
        <template v-if="items.length > 0">
          <ListboxOption
            v-for="item in items"
            :key="item.value"
            :value="item"
            :disabled="item.unavailable"
            v-slot="{ active, selected }"
          >
            <div
              class="py-2 text-sm font-semibold px-4 rounded cursor-pointer"
              :class="{
                'bg-[#EFFCFF]': active,
                'bg-blue-300 ': selected,
              }"
            >
              {{ item.name }}
            </div>
          </ListboxOption>
        </template>
      </ListboxOptions>
    </Listbox>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

interface Items {
  name: string;
  unavailable?: boolean;
  value: string | number;
}

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  items: Items[];
  label: string;
  modelValue: string;
}>();
const selectedItem: Ref<Items | {}> = ref({});

onMounted(() => {
  selectedItem.value = props.items[0];
});
watch(selectedItem, (newVal: Items) => {
  console.log(newVal);
  emit("update:modelValue", newVal.value);
});
</script>
<style lang=""></style>
