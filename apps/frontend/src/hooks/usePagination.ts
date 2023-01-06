import { computed, ref, unref } from "vue";

export default function usePagination(options = {}) {
  const totalItems = ref(options.totalItems || 0);
  const currentPage = ref(options.currentPage || 1);
  const pageSize = ref(options.pageSize || 0);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value)
  );

  const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
  const endIndex = computed(
    () => Math.min(currentPage.value * pageSize.value, totalItems.value) - 1
  );
  const isNextEnabled = computed(() => currentPage.value < totalPages.value);
  const isPreviousEnabled = computed(() => currentPage.value > 1);

  function setPage(page) {
    if (page < 1 || page > totalPages.value) {
      return;
    }

    currentPage.value = page;
  }

  function nextPage() {
    setPage(currentPage.value + 1);
  }

  function previousPage() {
    setPage(currentPage.value - 1);
  }

  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isNextEnabled,
    isPreviousEnabled,

    setPage,
    nextPage,
    previousPage,
  };
}
