<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <!-- Título + contenido -->
    <td class="px-6 py-4">
      <div class="flex items-start gap-3">
        <div
          v-if="noticia.imagen"
          class="flex-shrink-0 cursor-zoom-in"
          @click="$emit('verImagen', noticia.imagen!)"
        >
          <img
            :src="noticia.imagen"
            :alt="noticia.titulo"
            class="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform shadow-sm"
          />
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-gray-900 dark:text-white line-clamp-1">{{ noticia.titulo }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{{ noticia.contenido }}</p>
        </div>
      </div>
    </td>

    <!-- Fecha publicación -->
    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {{ formatearFecha(noticia.fecha_publicacion) }}
    </td>

    <!-- Fecha evento -->
    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
      <span v-if="noticia.fecha_evento" class="text-[#8C1D40] dark:text-rose-400 font-medium">
        {{ formatearFecha(noticia.fecha_evento) }}
      </span>
      <span v-else class="text-gray-300 dark:text-gray-600">—</span>
    </td>

    <!-- Destacada -->
    <td class="px-6 py-4">
      <span
        :class="noticia.destacada
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
        class="px-2.5 py-1 text-xs font-semibold rounded-full"
      >
        {{ noticia.destacada ? '⭐ Destacada' : 'Normal' }}
      </span>
    </td>

    <!-- Acciones -->
    <td class="px-6 py-4">
      <div class="flex items-center justify-center gap-1">
        <button
          @click="$emit('editar', noticia)"
          class="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
          title="Editar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('eliminar', noticia.idnoticia)"
          class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Eliminar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { INoticia } from '@/interfaces/noticia.interface';

defineProps<{ noticia: INoticia }>();

defineEmits<{
  editar: [noticia: INoticia];
  eliminar: [id: number];
  verImagen: [url: string];
}>();

const formatearFecha = (fecha: string): string => {
  if (!fecha) return '—';
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>