<template>
  <div class="relative">
    <Combobox
      @update:modelValue="(value) => (query = value)"
      v-model="selectedItem"
    >
      <div class="flex items-center gap-4 border rounded-lg px-5 py-2">
        <Icon name="SearchIcon" />
        <ComboboxInput
          autocapitalize
          data-test="data-combolist-input"
          @change="changeInput($event)"
          class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent flex-1"
          placeholder="Rechercher un Agent"
          :displayValue="
            (item) => (item ? item.firstName + ' ' + item.lastName : null)
          "
        />
      </div>

      <ComboboxOptions
        data-test="data-combolist-options"
        class="absolute overflow-auto max-h-52 bg-white z-20 w-full shadow-lg rounded-lg border mt-2 p-4"
      >
        <div
          v-if="filteredItems.length === 0 && query !== ''"
          class="relative cursor-default select-none py-2 px-4 text-gray-700"
        >
          Pas trouvé
        </div>
        <ComboboxOption
          v-else
          v-for="item in filteredItems"
          :key="item.id"
          :value="item"
          v-slot="{ active, selected }"
        >
          <div
            class="py-2 text-sm font-semibold px-4 rounded cursor-pointer"
            :class="{
              'bg-[#EFFCFF]': active,
              'bg-blue-300 ': selected,
            }"
          >
            {{ item.firstName }}
            {{ item.lastName }}
          </div>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>
  </div>
</template>
<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { computed, ref, type Ref } from "vue";
const props = defineProps<{
  items: Ref | Array<[]> | any;
}>();

// const selected = useVModel(props, "selected");

const selectedItem = ref(props.items[0]);
const query = ref("");

function changeInput(e: Event) {
  if (e.target) {
    query.value = e.target.value;
  }
}

const filteredItems = computed(() => {
  if (!query.value) {
    return props.items;
  }

  const reg = new RegExp(`${query.value.toLocaleLowerCase()}`, "g");
  return props.items.filter(
    (item: { [x: string]: any; firstName: string; lastName: string }) => {
      return (
        reg.test((item.firstName + " " + item.lastName).toLocaleLowerCase()) ||
        reg.test(item.email.toLocaleLowerCase())
      );
    }
  );
});

defineExpose({
  selectedItem,
});
</script>
<style lang=""></style>
