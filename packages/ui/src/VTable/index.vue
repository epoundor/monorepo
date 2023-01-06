<template>
  <div :class="{ 'overflow-y-auto flex items-start': fixedHeaders }">
    <table class="table bg-white border-collapse w-full text-[#272833]">
      <thead
        v-once
        :class="{ 'sticky top-0 bg-white': fixedHeaders, [headerClass]: true }"
        v-if="!headerLess"
      >
        <tr>
          <th
            v-if="selectable"
            scope="col"
            class="w-4 px-3 py-3 text-xs font-semibold text-[#272833] uppercase tracking-wider"
          >
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th
            v-for="header in headers"
            :key="`${header.field}_header`"
            class="px-3 py-3 text-left text-xs font-semibold text-[#272833] uppercase tracking-wider"
            :class="computeCellClass(header, true)"
          >
            {{ header.label }}
          </th>
        </tr>
        <tr v-if="loading">
          <td :colspan="cellsCount">
            <div class="h-1 bg-green-100 relative overflow-hidden">
              <div
                class="absolute w-64 bg-green-500 h-full transform"
                :style="{ left: loadingBarPosition + '%' }"
              ></div>
            </div>
          </td>
        </tr>
      </thead>

      <tbody class="overflow-auto h-full">
        <template v-if="items.length > 0">
          <tr
            v-for="(item, index) in items"
            @mouseover="$emit('onRowHovered', { row: index, item })"
            @mouseleave="$emit('onRowHovered', null)"
            :key="item[identifier]"
            class="border-b last:border-b-0 border-l-4 border-l-transparent"
            :class="[
              rowClass(item),
              {
                'bg-yellow-300 border-l-[#F8D648] border-b-transparent bg-opacity-10 shadow':
                  isItemSelected(item),
              },
            ]"
            @click="onRowClick(item)"
          >
            <td
              v-if="selectable"
              scope="col"
              class="w-4 px-3 py-3 text-xs font-medium tracking-wider"
            >
              <input
                type="checkbox"
                :checked="isItemSelected(item)"
                @change="onRowClick(item, true)"
                @click.stop
              />
            </td>

            <td
              v-for="header in headers"
              :key="`cell_${header.field}_item[identifier]`"
              class="px-4 py-4 text-left text-xs font-medium tracking-wider"
              :class="computeCellClass(header, true)"
            >
              <slot
                :name="`cell(${header.field})`"
                :item="item"
                :value="getItemField(item, header)"
                :index="index"
                :iteration="index + 1"
              >
                <span class="uppercase">{{ getItemField(item, header) }} </span>
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="cellsCount">
              <slot name="empty">
                <div class="w-full py-16 text-center">
                  Aucune donnée disponible
                </div>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from "vue";
import { useRafFn, useVModel } from "@vueuse/core";
import { computeCellClass, getItemField } from "./utils";
import useSelectable from "@/hooks/useSelectable";

export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },

    items: {
      type: Array,
      default: () => [],
    },

    identifier: {
      type: String,
      default: "id",
    },

    selectable: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: [Object, Array],
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    selectRowOnClick: {
      type: Boolean,
      default: false,
    },

    fixedHeaders: {
      type: Boolean,
      default: false,
    },

    headerClass: {
      type: String,
      default: "",
    },

    headerLess: {
      type: Boolean,
      default: false,
    },

    rowClass: {
      type: Function,
      default: () => "",
    },

    tooltipFn: {
      type: Function,
      default: () => "",
    },
  },

  setup(props, { emit }) {
    const cellsCount = computed(
      () => props.headers.length + (props.selectable ? 1 : 0)
    );
    const loadingBarPosition = ref(0);
    const selected = useVModel(props, "selected", emit, { passive: true });
    const { allSelected, toggleItem, toggleSelectAll, isItemSelected } =
      useSelectable(
        computed(() => props.items),
        { selected }
      );

    useRafFn(() => {
      loadingBarPosition.value++;
      if (loadingBarPosition.value === 100) {
        loadingBarPosition.value = 0;
      }
    });

    function onRowClick(item, force = false) {
      if (force || props.selectRowOnClick) {
        toggleItem(item);
      }
    }

    return {
      selected,
      cellsCount,
      loadingBarPosition,
      allSelected,
      toggleItem,
      toggleSelectAll,
      isItemSelected,
      computeCellClass,
      getItemField,
      onRowClick,
    };
  },
};
</script>
