<template>
  <nav
    class="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-600 dark:bg-gray-900/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6"
    aria-label="Paginación del listado"
  >
    <p class="text-sm text-gray-600 dark:text-gray-400">
      <span v-if="total === 0">Sin {{ itemLabel }}</span>
      <span v-else>
        Mostrando
        <span class="font-semibold text-gray-800 dark:text-gray-200">{{ rangeFrom }}</span>
        –
        <span class="font-semibold text-gray-800 dark:text-gray-200">{{ rangeTo }}</span>
        de
        <span class="font-semibold text-gray-800 dark:text-gray-200">{{ total }}</span>
        {{ itemLabel }}
      </span>
    </p>

    <div class="flex flex-wrap items-center gap-2 sm:justify-end">
      <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="whitespace-nowrap">Por página</span>
        <select
          :value="pageSize"
          class="min-h-[40px] rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium text-gray-800 shadow-sm focus:border-[#C88A2A] focus:outline-none focus:ring-2 focus:ring-[#C88A2A]/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="onPageSizeChange"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>

      <div class="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm dark:border-gray-600 dark:bg-gray-800">
        <button
          type="button"
          class="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-200 dark:hover:bg-gray-700"
          :disabled="!canFirst"
          aria-label="Primera página"
          @click="goFirst"
        >
          <Icon icon="mdi:chevron-double-left" class="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-200 dark:hover:bg-gray-700"
          :disabled="!canPrev"
          aria-label="Página anterior"
          @click="goPrev"
        >
          <Icon icon="mdi:chevron-left" class="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
        <span
          class="min-w-[5.5rem] px-2 text-center text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100"
        >
          {{ page }} / {{ totalPages }}
        </span>
        <button
          type="button"
          class="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-200 dark:hover:bg-gray-700"
          :disabled="!canNext"
          aria-label="Página siguiente"
          @click="goNext"
        >
          <Icon icon="mdi:chevron-right" class="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-35 dark:text-gray-200 dark:hover:bg-gray-700"
          :disabled="!canLast"
          aria-label="Última página"
          @click="goLast"
        >
          <Icon icon="mdi:chevron-double-right" class="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { Icon } from "@iconify/vue";

const page = defineModel<number>("page", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });

const props = withDefaults(
  defineProps<{
    total: number;
    itemLabel?: string;
    pageSizeOptions?: number[];
  }>(),
  {
    itemLabel: "registros",
    pageSizeOptions: () => [10, 25, 50, 100],
  },
);

const totalPages = computed(() => {
  if (props.total <= 0) return 1;
  return Math.ceil(props.total / pageSize.value);
});

const rangeFrom = computed(() => {
  if (props.total === 0) return 0;
  return (page.value - 1) * pageSize.value + 1;
});

const rangeTo = computed(() => {
  if (props.total === 0) return 0;
  return Math.min(page.value * pageSize.value, props.total);
});

const canPrev = computed(() => page.value > 1);
const canNext = computed(() => page.value < totalPages.value);
const canFirst = computed(() => canPrev.value);
const canLast = computed(() => canNext.value);

function goFirst() {
  if (canFirst.value) page.value = 1;
}
function goPrev() {
  if (canPrev.value) page.value -= 1;
}
function goNext() {
  if (canNext.value) page.value += 1;
}
function goLast() {
  if (canLast.value) page.value = totalPages.value;
}

function onPageSizeChange(e: Event) {
  const el = e.target as HTMLSelectElement;
  const n = parseInt(el.value, 10);
  if (!Number.isNaN(n) && n > 0) {
    pageSize.value = n;
    page.value = 1;
  }
}

watch(
  () => props.total,
  () => {
    const tp = totalPages.value;
    if (page.value > tp) page.value = tp;
    if (page.value < 1) page.value = 1;
  },
);
</script>
