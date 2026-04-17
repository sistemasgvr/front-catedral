import { computed, ref, watch, type ComputedRef } from "vue";

export interface UseClientPaginationOptions {
  initialPageSize?: number;
}

/**
 * Paginación en cliente sobre un listado ya filtrado (slice).
 * Reinicia a la página 1 cuando cambia el origen; ajusta la página si el total baja.
 */
export function useClientPagination<T>(
  sourceList: ComputedRef<T[]>,
  options?: UseClientPaginationOptions,
) {
  const page = ref(1);
  const pageSize = ref(options?.initialPageSize ?? 10);

  const total = computed(() => sourceList.value.length);

  const totalPages = computed(() => {
    if (total.value <= 0) return 1;
    return Math.ceil(total.value / pageSize.value);
  });

  const paginatedItems = computed(() => {
    const list = sourceList.value;
    const ps = pageSize.value;
    const p = Math.min(Math.max(1, page.value), totalPages.value);
    const start = (p - 1) * ps;
    return list.slice(start, start + ps);
  });

  watch(sourceList, () => {
    page.value = 1;
  });

  watch([total, pageSize], () => {
    const tp = totalPages.value;
    if (page.value > tp) page.value = tp;
    if (page.value < 1) page.value = 1;
  });

  return {
    page,
    pageSize,
    total,
    totalPages,
    paginatedItems,
  };
}
