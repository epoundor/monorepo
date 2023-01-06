<template>
  <div
    class="relative"
    :class="{ 'h-full pb-3 flex flex-col overflow-y-auto': fixedHeaders }"
  >
    <div
      v-if="withFilters"
      class="flex items-center bg-white justify-between p-4 mb-4 border rounded-md shadow"
    >
      <BaseInput
        :placeholder="searchPlaceholder"
        class="searchBox bg-[#F6F9FA] rounded-lg border min-w-[482px]"
        @update:modelValue="onDefaultSearchChange"
      >
        <template #icon>
          <Icon name="SearchIcon" />
        </template>
      </BaseInput>
      <div>
        <slot name="filters"> </slot>
      </div>

      <v-pagination
        v-if="paginate"
        v-model="activePage"
        :totalItems="total"
        :page-size="pageSize"
      />
    </div>

    <v-table
      v-model:selected="selectedItems"
      v-bind="attrs"
      :items="currentPageItems"
      :fixed-headers="fixedHeaders"
      :class="{ 'flex-1': fixedHeaders }"
    >
      <template v-for="slot in slotNames" v-slot:[slot]="props">
        <slot :name="slot" v-bind="props" />
      </template>
    </v-table>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { useVModel } from "@vueuse/core";

import BaseInput from "@/components/Form/BaseInput.vue";
import usePagination from "@/hooks/usePagination";
import VTable from "./VTable/index.vue";

export default {
  inheritAttrs: false,
  components: {
    VTable,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    selected: {
      type: Array,
      default: () => [],
    },

    pageSize: {
      type: Number,
      default: 10,
    },

    totalItems: {
      type: Number,
      default: 0,
    },

    currentPage: {
      type: Number,
      default: 1,
    },

    fixedHeaders: {
      type: Boolean,
      default: false,
    },

    serverSide: {
      type: Boolean,
      default: false,
    },
    paginate: {
      type: Boolean,
      default: true,
    },
    searchPlaceholder: {
      type: String,
      default: "",
    },
    withFilters: {
      type: Boolean,
      default: true,
    },
    onSearchChange: Function,
  },

  setup(props, { emit, attrs, slots }) {
    const slotNames = Object.keys(slots);
    const selectedItems = useVModel(props, "selected", emit, {
      passive: true,
    });
    const isSearching = ref(false);
    const showSelectionActions = computed(() => selectedItems.value.length > 0);
    const total = computed(() =>
      props.serverSide ? props.totalItems : props.items.length
    );

    const {
      startIndex,
      endIndex,
      currentPage: activePage,
    } = usePagination({
      totalItems: total,
      pageSize: computed(() => props.pageSize),
      currentPage: props.currentPage,
    });

    const currentPageItems = computed(() =>
      props.serverSide
        ? props.items
        : props.items.slice(startIndex.value, endIndex.value + 1)
    );

    useVModel(props, "totalItems", emit);
    function onDefaultSearchChange(search: string) {
      // console.warn(search);
      isSearching.value = true;
      if (!search.length) {
        isSearching.value = false;
      }
      if (props.onSearchChange) {
        return props.onSearchChange(search);
      }

      // const regex = new RegExp(search, "gi");
      // return props.users.filter(
      //   (user) =>
      //     regex.test(user.fullname) ||
      //     regex.test(user.department.code) ||
      //     regex.test(user.department.title)
      // );
    }
    watch(
      () => props.currentPage,
      () => {
        if (props.currentPage !== activePage.value) {
          activePage.value = props.currentPage;
        }
      }
    );

    watch(activePage, () => {
      emit("update:currentPage", activePage.value);
    });

    function onCloseSelectionActions() {
      selectedItems.value = [];
    }

    return {
      attrs,
      slotNames,
      total,
      activePage,
      currentPageItems,
      selectedItems,
      showSelectionActions,
      onCloseSelectionActions,
      onDefaultSearchChange,
    };
  },
};
</script>
