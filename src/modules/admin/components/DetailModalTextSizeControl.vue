<template>
  <div
    class="inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900/50"
    role="group"
    aria-label="Tamaño de texto en este modal"
  >
    <span class="hidden pl-1.5 text-xs text-gray-500 sm:inline dark:text-gray-400">Texto</span>
    <button
      v-for="p in PRESETS"
      :key="p.value"
      type="button"
      class="rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-2.5 sm:text-sm"
      :class="
        isActive(p.value)
          ? 'bg-[#C88A2A] text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
      "
      :aria-pressed="isActive(p.value)"
      @click="zoom = p.value"
    >
      {{ p.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const STORAGE_KEY = 'catedral-admin-detail-modal-text-zoom';

const PRESETS = [
  { label: 'Normal', value: 1 },
  { label: 'Grande', value: 1.12 },
  { label: 'Extra', value: 1.28 },
] as const;

const props = defineProps<{
  /** Al abrir el modal se reaplica la preferencia guardada (compartida entre modales de detalle). */
  isModalOpen: boolean;
}>();

/** Ligero aumento por defecto (adultos mayores); el usuario puede bajar a Normal. */
const zoom = defineModel<number>({ default: 1.12 });

function isActive(value: number): boolean {
  return Math.abs(zoom.value - value) < 0.02;
}

function readStoredZoom(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null) return null;
  const v = parseFloat(raw);
  if (Number.isNaN(v) || v < 1 || v > 1.45) return null;
  return v;
}

watch(
  () => props.isModalOpen,
  (open) => {
    if (!open) return;
    const stored = readStoredZoom();
    if (stored != null) zoom.value = stored;
  },
  { immediate: true },
);

watch(zoom, (v) => {
  localStorage.setItem(STORAGE_KEY, String(v));
});
</script>
