<template>
  <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-[#D39E3A]/30">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <svg class="w-6 h-6 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        Noticias y Eventos
      </h3>
      <span v-if="!loading && noticias.length > 0" class="text-xs text-gray-500 font-medium">
        {{ noticias.length }} anuncios
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="noticias.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <p class="text-gray-500 text-sm">No hay noticias disponibles en este momento</p>
    </div>

    <!-- News List -->
    <div v-else class="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div 
        v-for="noticia in noticias" 
        :key="noticia.idnoticia"
        class="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#C88A2A]/50"
      >
        <!-- Destacada Badge -->
        <span 
          v-if="noticia.destacada" 
          class="absolute top-2 right-2 px-2 py-1 bg-[#C88A2A] text-white text-[10px] font-bold uppercase rounded-full shadow-sm"
        >
          Destacada
        </span>

        <!-- Content -->
        <div :class="noticia.imagen ? 'flex gap-4' : ''">
          <!-- Image -->
          <div v-if="noticia.imagen" class="flex-shrink-0">
            <img 
              :src="noticia.imagen" 
              :alt="noticia.titulo"
              class="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          <!-- Text Content -->
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-[#C88A2A] transition-colors">
              {{ noticia.titulo }}
            </h4>
            <p class="text-xs text-gray-600 mb-2 line-clamp-2">
              {{ noticia.contenido }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-3 text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatearFecha(noticia.fecha_publicacion) }}
                </span>
                <span v-if="noticia.fecha_evento" class="flex items-center gap-1 text-[#8C1D40] font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Evento: {{ formatearFecha(noticia.fecha_evento) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { obtenerNoticiasPublicas } from '../actions/noticias.action';
import type { INoticiaResumen } from '@/interfaces/noticia.interface';

const noticias = ref<INoticiaResumen[]>([]);
const loading = ref(false);

const cargarNoticias = async () => {
  loading.value = true;
  try {
    noticias.value = await obtenerNoticiasPublicas(5);
  } catch (error) {
    console.error('Error cargando noticias:', error);
  } finally {
    loading.value = false;
  }
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return '';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  cargarNoticias();
});
</script>

<style scoped>
/* Scrollbar personalizado */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>