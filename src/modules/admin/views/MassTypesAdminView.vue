<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <!-- Content -->
      <div class="relative z-10 flex flex-col min-h-screen">
        <!-- Main Content -->
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Tipos de Misa
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400">
                    Gestiona los tipos de misas disponibles
                  </p>
                </div>
                <button
                  @click="abrirModalCrear"
                  class="w-full sm:w-auto px-6 py-3 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#C88A2A] dark:focus:ring-offset-gray-900 flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:plus" class="w-5 h-5 shrink-0" aria-hidden="true" />
                  Nuevo Tipo de Misa
                </button>
              </div>
            </div>

            <!-- Filters Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- Búsqueda -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar
                  </label>
                  <input
                    v-model="filtros.busqueda"
                    type="text"
                    placeholder="Nombre del tipo de misa..."
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Ordenar -->
                <div class="sm:w-64">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ordenar por
                  </label>
                  <select 
                    v-model="filtros.orden"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option value="nombre">Nombre (A-Z)</option>
                    <option value="nombre-desc">Nombre (Z-A)</option>
                    <option value="precio">Precio (menor a mayor)</option>
                    <option value="precio-desc">Precio (mayor a menor)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <!-- Total -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Tipos</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ tiposMisa.length }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:package-variant" class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <!-- Precio Promedio -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Precio Promedio</p>
                    <p class="text-2xl font-bold text-[#C88A2A] mt-1">S/ {{ precioPromedio.toFixed(2) }}</p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:chart-timeline-variant" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <!-- Precio Máximo -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Precio Máximo</p>
                    <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">S/ {{ precioMaximo.toFixed(2) }}</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:trending-up" class="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-colors">
              <!-- Loading State -->
              <div v-if="loading" class="p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando tipos de misa...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="tiposMisaFiltrados.length === 0" class="p-12 text-center">
                <Icon icon="mdi:package-variant-closed" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <p class="mt-4 text-gray-600 dark:text-gray-400">No se encontraron tipos de misa</p>
                <button
                  @click="abrirModalCrear"
                  class="mt-4 px-4 py-2 bg-[#C88A2A] text-white rounded-lg hover:bg-[#B6791F] transition-colors"
                >
                  Crear el primero
                </button>
              </div>

              <!-- Desktop Table -->
              <div v-else class="hidden md:block overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Precio
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Fecha Creación
                      </th>
                      <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr 
                      v-for="tipo in tiposMisaFiltrados" 
                      :key="tipo.idtipomisa"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ tipo.idtipomisa }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ tipo.nombre }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-bold text-[#C88A2A]">S/ {{ Number(tipo.precio).toFixed(2) }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatearFecha(tipo.fechacreacion) }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            @click="editarTipoMisa(tipo.idtipomisa)"
                            class="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Icon icon="mdi:pencil-outline" class="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button 
                            @click="confirmarEliminar(tipo.idtipomisa)"
                            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Eliminar"
                          >
                            <Icon icon="mdi:delete-outline" class="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden p-4 space-y-4">
                <div 
                  v-for="tipo in tiposMisaFiltrados" 
                  :key="tipo.idtipomisa"
                  class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm transition-colors"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ tipo.idtipomisa }}</span>
                      <h3 class="text-base font-bold text-gray-900 dark:text-white mt-1">{{ tipo.nombre }}</h3>
                    </div>
                    <span class="text-lg font-bold text-[#C88A2A]">S/ {{ Number(tipo.precio).toFixed(2) }}</span>
                  </div>

                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Creado: {{ formatearFecha(tipo.fechacreacion) }}
                  </div>

                  <div class="flex gap-2">
                    <button 
                      @click="editarTipoMisa(tipo.idtipomisa)"
                      class="flex-1 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <Icon icon="mdi:pencil-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                      Editar
                    </button>
                    <button 
                      @click="confirmarEliminar(tipo.idtipomisa)"
                      class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Icon icon="mdi:delete-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modales -->
    <FormMassTypeModal
      :is-open="modalForm.isOpen"
      :tipo-misa-id="modalForm.tipoMisaId"
      @close="modalForm.isOpen = false"
      @saved="handleGuardado"
    />

    <ConfirmModal
      :is-open="modalConfirm.isOpen"
      :loading="modalConfirm.loading"
      type="danger"
      title="¿Eliminar Tipo de Misa?"
      message="Esta acción marcará el tipo de misa como inactivo. Las misas existentes de este tipo no se verán afectadas."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="handleEliminar"
      @cancel="modalConfirm.isOpen = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import FormMassTypeModal from '../components/FormMassTypeModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { listarTiposMisa, eliminarTipoMisa } from '../actions/tipoMisa.action';
import type { ITipoMisa } from '../interfaces/tipoMisa.interface';

/* ================================
   STATE
================================ */

const tiposMisa = ref<ITipoMisa[]>([]);
const loading = ref(false);

const filtros = ref({
  busqueda: '',
  orden: 'nombre' as 'nombre' | 'nombre-desc' | 'precio' | 'precio-desc',
});

const modalForm = ref({
  isOpen: false,
  tipoMisaId: null as number | null,
});

const modalConfirm = ref({
  isOpen: false,
  tipoMisaId: null as number | null,
  loading: false,
});

/* ================================
   COMPUTED
================================ */

const tiposMisaFiltrados = computed(() => {
  let resultado = [...tiposMisa.value];

  // Filtrar por búsqueda
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter(t => 
      t.nombre.toLowerCase().includes(busqueda)
    );
  }

  // Ordenar
  resultado.sort((a, b) => {
    switch (filtros.value.orden) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      case 'nombre-desc':
        return b.nombre.localeCompare(a.nombre);
      case 'precio':
        return a.precio - b.precio;
      case 'precio-desc':
        return b.precio - a.precio;
      default:
        return 0;
    }
  });

  return resultado;
});

const precioPromedio = computed(() => {
  if (tiposMisa.value.length === 0) return 0;
  const suma = tiposMisa.value.reduce((acc, t) => acc + Number(t.precio), 0);
  return suma / tiposMisa.value.length;
});

const precioMaximo = computed(() => {
  if (tiposMisa.value.length === 0) return 0;
  return Math.max(...tiposMisa.value.map(t => Number(t.precio)));
});

/* ================================
   METHODS
================================ */

const cargarTiposMisa = async () => {
  loading.value = true;
  try {
    tiposMisa.value = await listarTiposMisa();
  } catch (error) {
    console.error('Error cargando tipos de misa:', error);
  } finally {
    loading.value = false;
  }
};

const abrirModalCrear = () => {
  modalForm.value = {
    isOpen: true,
    tipoMisaId: null,
  };
};

const editarTipoMisa = (id: number) => {
  modalForm.value = {
    isOpen: true,
    tipoMisaId: id,
  };
};

const confirmarEliminar = (id: number) => {
  modalConfirm.value = {
    isOpen: true,
    tipoMisaId: id,
    loading: false,
  };
};

const handleEliminar = async () => {
  if (!modalConfirm.value.tipoMisaId) return;

  modalConfirm.value.loading = true;
  try {
    await eliminarTipoMisa(modalConfirm.value.tipoMisaId);
    await cargarTiposMisa();
    modalConfirm.value.isOpen = false;
  } catch (error) {
    console.error('Error eliminando tipo de misa:', error);
    alert('Error al eliminar el tipo de misa');
  } finally {
    modalConfirm.value.loading = false;
  }
};

const handleGuardado = async () => {
  await cargarTiposMisa();
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

/* ================================
   LIFECYCLE
================================ */

onMounted(() => {
  cargarTiposMisa();
});
</script>