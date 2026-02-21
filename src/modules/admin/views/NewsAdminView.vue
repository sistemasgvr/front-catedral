<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="relative z-10 flex flex-col min-h-screen">
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-7xl mx-auto">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Gestión de Noticias
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400">
                    Administra los anuncios y eventos de la iglesia
                  </p>
                </div>
                <button
                  @click="abrirModalCrear"
                  class="w-full sm:w-auto px-6 py-3 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] transition-all flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Noticia
                </button>
              </div>
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  v-model="filtros.busqueda"
                  type="text"
                  placeholder="Buscar..."
                  class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <select 
                  v-model="filtros.destacada"
                  class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option :value="null">Todas</option>
                  <option :value="true">Destacadas</option>
                  <option :value="false">No destacadas</option>
                </select>
                <select 
                  v-model="filtros.orden"
                  class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="reciente">Más recientes</option>
                  <option value="antigua">Más antiguas</option>
                </select>
              </div>
            </div>

            <!-- Table -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div v-if="loading" class="p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
              </div>

              <div v-else-if="noticiasFiltradas.length === 0" class="p-12 text-center">
                <p class="text-gray-600 dark:text-gray-400">No se encontraron noticias</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Título</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha Pub.</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Destacada</th>
                      <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="noticia in noticiasFiltradas" :key="noticia.idnoticia" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td class="px-6 py-4">
                        <p class="font-medium text-gray-900 dark:text-white">{{ noticia.titulo }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ noticia.contenido }}</p>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {{ formatearFecha(noticia.fecha_publicacion) }}
                      </td>
                      <td class="px-6 py-4">
                        <span :class="noticia.destacada ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'" class="px-2 py-1 text-xs font-semibold rounded-full">
                          {{ noticia.destacada ? 'Sí' : 'No' }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center justify-center gap-2">
                          <button @click="editarNoticia(noticia.idnoticia)" class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button @click="confirmarEliminar(noticia.idnoticia)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modales (crear según necesites) -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import type { INoticia } from '@/interfaces/noticia.interface';

const noticias = ref<INoticia[]>([]);
const loading = ref(false);
const filtros = ref({
  busqueda: '',
  destacada: null as boolean | null,
  orden: 'reciente' as 'reciente' | 'antigua',
});

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value];
  
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter(n => 
      n.titulo.toLowerCase().includes(busqueda) ||
      n.contenido.toLowerCase().includes(busqueda)
    );
  }
  
  if (filtros.value.destacada !== null) {
    resultado = resultado.filter(n => n.destacada === filtros.value.destacada);
  }
  
  resultado.sort((a, b) => {
    if (filtros.value.orden === 'reciente') {
      return new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime();
    } else {
      return new Date(a.fecha_publicacion).getTime() - new Date(b.fecha_publicacion).getTime();
    }
  });
  
  return resultado;
});

const abrirModalCrear = () => {
  console.log('Crear noticia');
};

const editarNoticia = (id: number) => {
  console.log('Editar', id);
};

const confirmarEliminar = (id: number) => {
  console.log('Eliminar', id);
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

onMounted(() => {
  // Cargar noticias
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>