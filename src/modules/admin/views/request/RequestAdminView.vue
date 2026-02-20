<template>
  <AdminLayout> 
    <div class="min-h-screen flex flex-col relative">
      <!-- Content -->
      <div class="relative z-10 flex flex-col min-h-screen">
        <!-- Main Content -->
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-7xl mx-auto">
            <!-- Title Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Gestión de Solicitudes
              </h1>
            </div>

            <!-- Filters Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtros de búsqueda</h2>
              
              <form class="space-y-4" @submit.prevent="buscarSolicitudes">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Número de Documento -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Documento *
                    </label>
                    <input
                      v-model="filtros.numeroDocumento"
                      type="text"
                      placeholder="Ej: 12345678"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>

                  <!-- Estado dinámico -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select 
                      v-model="filtros.estado"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    >
                      <option :value="null">Todos</option>
                      <option
                        v-for="estado in estados"
                        :key="estado.id"
                        :value="estado.id"
                      >
                        {{ estado.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Fecha Desde -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Desde
                    </label>
                    <input
                      v-model="filtros.fechaDesde"
                      type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>

                  <!-- Fecha Hasta -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Hasta
                    </label>
                    <input
                      v-model="filtros.fechaHasta"
                      type="date"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    class="flex-1 sm:flex-initial px-6 py-2.5 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#C88A2A] dark:focus:ring-offset-gray-900"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Buscar
                    </span>
                  </button>

                  <button
                    type="button"
                    @click="limpiarFiltros"
                    class="flex-1 sm:flex-initial px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Limpiar
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Results Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 mt-6 transition-colors">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando solicitudes...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="solicitudesFiltradas.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="mt-2 text-gray-600 dark:text-gray-400">No se encontraron solicitudes</p>
              </div>

              <!-- Desktop Table -->
              <div v-else class="hidden md:block overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Código
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Solicitante
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Misa
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Fecha Deseada
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Monto
                      </th>
                      <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr 
                      v-for="solicitud in solicitudesFiltradas" 
                      :key="solicitud.idsolicitud"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.idsolicitud }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <div class="font-medium text-gray-900 dark:text-white">
                            {{ solicitud.nombres }} {{ solicitud.apellidos }}
                          </div>
                          <div class="text-gray-500 dark:text-gray-400">
                            {{ getNombreOpcion(solicitud.idtipodocumento) }}: {{ solicitud.nrodocumento }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm text-gray-900 dark:text-gray-200">
                          {{ getNombreTipoMisa(solicitud.idtipomisa) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getEstadoClass(solicitud.idEstadoProceso)">
                          {{ getNombreOpcion(solicitud.idEstadoProceso) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">
                          S/ {{ Number(solicitud.montototal).toFixed(2) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          @click="verDetalle(solicitud.idsolicitud)"
                          class="inline-flex items-center px-3 py-1.5 bg-[#C88A2A] text-white text-sm font-medium rounded-lg hover:bg-[#B6791F] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#C88A2A] dark:focus:ring-offset-gray-800"
                        >
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-4">
                <div 
                  v-for="solicitud in solicitudesFiltradas" 
                  :key="solicitud.idsolicitud"
                  class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm transition-colors"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">
                        {{ solicitud.idsolicitud }}
                      </span>
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {{ solicitud.nombres }} {{ solicitud.apellidos }}
                      </div>
                    </div>
                    <span :class="getEstadoClass(solicitud.idEstadoProceso)">
                      {{ getNombreOpcion(solicitud.idEstadoProceso) }}
                    </span>
                  </div>

                  <div class="space-y-2 mb-3">
                    <div class="flex items-start">
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span class="text-sm text-gray-900 dark:text-white ml-1">
                          {{ getNombreTipoMisa(solicitud.idtipomisa) }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Fecha:</span>
                        <span class="text-sm text-gray-900 dark:text-white ml-1">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Monto:</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                          S/ {{ Number(solicitud.montototal).toFixed(2) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    @click="verDetalle(solicitud.idsolicitud)"
                    class="w-full flex items-center justify-center px-4 py-2 bg-[#C88A2A] text-white text-sm font-medium rounded-lg hover:bg-[#B6791F] transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modal de Detalle -->
    <DetailRequestModal
      :is-open="modalDetalle.isOpen"
      :solicitud-id="modalDetalle.solicitudId"
      @close="cerrarModalDetalle"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AdminLayout from "../../layouts/AdminLayout.vue";
import DetailRequestModal from "../../components/DetailRequestModal.vue";
import { getOpcionesLista } from "../../actions/getOpcionesLista.action";
import { listarSolicitudes } from "../../actions/listSolicitudes.action";
import { getTiposMisa } from "../../actions/getTiposMisa.action";
import { mapOpcionToSelect } from "../../interfaces/opcionLista.interface";
import type { ISelectOption } from "../../interfaces/opcionLista.interface";
import type { ISolicitud } from "../../interfaces/listSolicitudes.interface";
import type { ITipoMisa } from "../../interfaces/tipoMisa.interface";

/* ================================
   STATE
================================ */

const solicitudes = ref<ISolicitud[]>([]);
const estados = ref<ISelectOption[]>([]);
const tiposMisa = ref<ITipoMisa[]>([]);
const opcionesCache = ref<Map<number, ISelectOption>>(new Map());
const loading = ref(false);

const filtros = ref({
  numeroDocumento: "",
  estado: null as number | null,
  fechaDesde: "",
  fechaHasta: "",
});

const modalDetalle = ref({
  isOpen: false,
  solicitudId: null as number | null,
});

/* ================================
   COMPUTED
================================ */

const solicitudesFiltradas = computed(() => {
  let resultado = [...solicitudes.value];

  if (filtros.value.numeroDocumento) {
    resultado = resultado.filter(s => 
      s.nrodocumento.includes(filtros.value.numeroDocumento)
    );
  }

  if (filtros.value.estado !== null) {
    resultado = resultado.filter(s => 
      s.idEstadoProceso === filtros.value.estado
    );
  }

  if (filtros.value.fechaDesde) {
    resultado = resultado.filter(s => 
      s.fechamisadeseada >= filtros.value.fechaDesde
    );
  }

  if (filtros.value.fechaHasta) {
    resultado = resultado.filter(s => 
      s.fechamisadeseada <= filtros.value.fechaHasta
    );
  }

  return resultado;
});

/* ================================
   METHODS
================================ */

const cargarOpcionesPorLista = async (idLista: number) => {
  try {
    const data = await getOpcionesLista(idLista);
    const opciones = data.map(mapOpcionToSelect);
    
    opciones.forEach(opcion => {
      opcionesCache.value.set(opcion.id, opcion);
    });
    
    return opciones;
  } catch (error) {
    console.error(`Error cargando opciones de lista ${idLista}:`, error);
    return [];
  }
};

const cargarEstados = async () => {
  try {
    estados.value = await cargarOpcionesPorLista(7);
  } catch (error) {
    console.error("Error cargando estados:", error);
  }
};

const cargarTiposMisa = async () => {
  try {
    tiposMisa.value = await getTiposMisa();
  } catch (error) {
    console.error("Error cargando tipos de misa:", error);
  }
};

const cargarTodasLasOpciones = async (solicitudes: ISolicitud[]) => {
  const idsUnicos = new Set<number>();
  
  solicitudes.forEach(solicitud => {
    if (solicitud.idtipodocumento) idsUnicos.add(solicitud.idtipodocumento);
    if (solicitud.idhorario) idsUnicos.add(solicitud.idhorario);
    if (solicitud.idEstadoProceso) idsUnicos.add(solicitud.idEstadoProceso);
  });

  const idsArray = Array.from(idsUnicos);
  await Promise.all(idsArray.map(id => cargarOpcionesPorLista(id)));
};

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    solicitudes.value = await listarSolicitudes();
    await cargarTodasLasOpciones(solicitudes.value);
  } catch (error) {
    console.error("Error cargando solicitudes:", error);
  } finally {
    loading.value = false;
  }
};

const buscarSolicitudes = () => {
  console.log("Buscando con filtros:", filtros.value);
};

const limpiarFiltros = () => {
  filtros.value = {
    numeroDocumento: "",
    estado: null,
    fechaDesde: "",
    fechaHasta: "",
  };
};

const getNombreOpcion = (id: number): string => {
  const opcion = opcionesCache.value.get(id);
  return opcion?.nombre || "N/A";
};

const getNombreTipoMisa = (id: number): string => {
  const tipo = tiposMisa.value.find(t => t.idtipomisa === id);
  return tipo?.nombre || "N/A";
};

const getEstadoClass = (idEstado: number): string => {
  const estado = getNombreOpcion(idEstado).toUpperCase();
  
  if (estado.includes('APROBADA') || estado.includes('APROBADO')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100/60 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600';
  }
  
  if (estado.includes('DENEGADA') || estado.includes('DENEGADO') || estado.includes('RECHAZ')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100/60 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-600';
  }
  
  if (estado.includes('REVISIÓN') || estado.includes('REVISION') || estado.includes('PENDIENTE')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-orange-100/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-600';
  }

  return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100/60 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return "N/A";
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const verDetalle = (idSolicitud: number) => {
  modalDetalle.value = {
    isOpen: true,
    solicitudId: idSolicitud,
  };
};

const cerrarModalDetalle = () => {
  modalDetalle.value = {
    isOpen: false,
    solicitudId: null,
  };
};

/* ================================
   LIFECYCLE
================================ */

onMounted(async () => {
  await Promise.all([
    cargarEstados(),
    cargarTiposMisa(),
  ]);
  await cargarSolicitudes();
});
</script>