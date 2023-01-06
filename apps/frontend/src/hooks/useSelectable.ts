import { isRef, ref, unref, watch } from "vue";

export default function useSelectable(
  items,
  { itemKey = "id", selected: providedSelected } = {}
) {
  const itemsRef = ref(items);
  const selected = isRef(providedSelected)
    ? ref(providedSelected)
    : ref(providedSelected || []);
  const allSelected = ref(false);

  watch(
    selected,
    () => {
      allSelected.value = selected.value.length > 0;
    }
    // { deep: true }
  );

  function getItemIdentifier(item) {
    if (typeof itemKey === "string") {
      return item[itemKey];
    }

    if (typeof itemKey === "function") {
      return itemKey(item);
    }
  }

  function isItemSelected(item) {
    return selected.value.some(
      (_item) => getItemIdentifier(_item) === getItemIdentifier(item)
    );
  }

  function toggleItem(item) {
    selected.value = [];
    const index = selected.value.findIndex(
      (_item) => getItemIdentifier(_item) === getItemIdentifier(item)
    );

    if (index === -1) {
      selected.value.push(item);
    } else {
      selected.value.splice(index, 1);
    }

    allSelected.value = itemsRef.value.every((item) => isItemSelected(item));
  }

  function toggleSelectAll() {
    if (allSelected.value) {
      selected.value = [];
    } else {
      selected.value = itemsRef.value;
    }

    allSelected.value = !allSelected.value;
  }

  return {
    selected,
    allSelected,
    isItemSelected,
    toggleItem,
    toggleSelectAll,
  };
}
