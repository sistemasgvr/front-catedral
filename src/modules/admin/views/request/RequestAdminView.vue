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
                      <Icon icon="mdi:magnify" class="w-5 h-5 shrink-0" aria-hidden="true" />
                      Buscar
                    </span>
                  </button>

                  <button
                    type="button"
                    @click="limpiarFiltros"
                    class="flex-1 sm:flex-initial px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <Icon icon="mdi:close" class="w-5 h-5 shrink-0" aria-hidden="true" />
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
                <Icon icon="mdi:clipboard-text-off-outline" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
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
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Pago
                      </th>
                      <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr 
                      v-for="solicitud in solicitudesPagina" 
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
                          {{ getNombreTipoMisa(solicitud) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getEstadoClass(solicitud.idestadoproceso)">
                          {{ getNombreOpcion(solicitud.idestadoproceso) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">
                          S/ {{ Number(solicitud.montototal ?? 0).toFixed(2) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          v-if="solicitudEsPagoEfectivo(solicitud)"
                          class="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-200"
                          title="El solicitante pagará en la iglesia; la parroquia gestiona el cobro."
                        >
                          <Icon icon="mdi:cash" class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          Efectivo
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
                          title="Comprobante digital (Yape / transferencia)"
                        >
                          <Icon icon="mdi:receipt-text-outline" class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          Digital
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          @click="verDetalle(solicitud.idsolicitud)"
                          class="inline-flex items-center px-3 py-1.5 bg-[#C88A2A] text-white text-sm font-medium rounded-lg hover:bg-[#B6791F] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#C88A2A] dark:focus:ring-offset-gray-800"
                        >
                          <Icon icon="mdi:eye-outline" class="w-4 h-4 mr-1 shrink-0" aria-hidden="true" />
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
                  v-for="solicitud in solicitudesPagina" 
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
                    <span :class="getEstadoClass(solicitud.idestadoproceso)">
                      {{ getNombreOpcion(solicitud.idestadoproceso) }}
                    </span>
                  </div>

                  <div class="space-y-2 mb-3">
                    <div class="flex items-start">
                      <Icon icon="mdi:calendar-month-outline" class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 shrink-0" aria-hidden="true" />
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span class="text-sm text-gray-900 dark:text-white ml-1">
                          {{ getNombreTipoMisa(solicitud) }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <Icon icon="mdi:clock-outline" class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 shrink-0" aria-hidden="true" />
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Fecha:</span>
                        <span class="text-sm text-gray-900 dark:text-white ml-1">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <Icon icon="mdi:cash" class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 shrink-0" aria-hidden="true" />
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Monto:</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                          S/ {{ Number(solicitud.montototal ?? 0).toFixed(2) }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <Icon icon="mdi:wallet-outline" class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 shrink-0" aria-hidden="true" />
                      <div class="flex-1">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Medio de pago:</span>
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-white ml-1"
                          :class="solicitudEsPagoEfectivo(solicitud) ? 'text-emerald-700 dark:text-emerald-300' : ''"
                        >
                          {{ solicitudEsPagoEfectivo(solicitud) ? 'Efectivo (iglesia)' : 'Digital' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    @click="verDetalle(solicitud.idsolicitud)"
                    class="w-full flex items-center justify-center px-4 py-2 bg-[#C88A2A] text-white text-sm font-medium rounded-lg hover:bg-[#B6791F] transition-colors"
                  >
                    <Icon icon="mdi:eye-outline" class="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
                    Ver Detalles
                  </button>
                </div>
              </div>

              <PaginationBar
                v-model:page="solicitudesListadoPage"
                v-model:page-size="solicitudesListadoPageSize"
                :total="solicitudesListadoTotal"
                item-label="solicitudes"
              />
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
import { Icon } from "@iconify/vue";
import AdminLayout from "../../layouts/AdminLayout.vue";
import DetailRequestModal from "../../components/DetailRequestModal.vue";
import PaginationBar from "@/components/pagination/PaginationBar.vue";
import { useClientPagination } from "@/composables/useClientPagination";
import { getOpcionesLista } from "../../actions/getOpcionesLista.action";
import { listarSolicitudes } from "../../actions/listSolicitudes.action";
import { listarTiposMisa } from '../../actions/tipoMisa.action';
import { mapOpcionToSelect } from "../../interfaces/opcionLista.interface";
import type { ISelectOption } from "../../interfaces/opcionLista.interface";
import type { ISolicitudDb } from "../../interfaces/listSolicitudes.interface";
import type { ITipoMisa } from "../../interfaces/tipoMisa.interface";
import { resolveTipoMisaNombre } from "../../utils/resolveTipoMisaNombre";
import { esMarcadorPagoEfectivo } from "../../../request/constants/pagoSolicitud";

/** Mismo valor que `revision` en cambiarEstadoSolicitud.action (lista estados, id opción). */
const ID_ESTADO_EN_REVISION = 17;

function solicitudEsPagoEfectivo(s: ISolicitudDb): boolean {
  return esMarcadorPagoEfectivo(s.voucherpago);
}

/* ================================
   STATE
================================ */

const solicitudes = ref<ISolicitudDb[]>([]);
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
      s.idestadoproceso === filtros.value.estado
    );
  }

  if (filtros.value.fechaDesde) {
    resultado = resultado.filter(
      (s) =>
        s.fechamisadeseada &&
        s.fechamisadeseada >= filtros.value.fechaDesde,
    );
  }

  if (filtros.value.fechaHasta) {
    resultado = resultado.filter(
      (s) =>
        s.fechamisadeseada &&
        s.fechamisadeseada <= filtros.value.fechaHasta,
    );
  }

  resultado.sort((a, b) => {
    const aRevision = a.idestadoproceso === ID_ESTADO_EN_REVISION;
    const bRevision = b.idestadoproceso === ID_ESTADO_EN_REVISION;
    if (aRevision !== bRevision) return aRevision ? -1 : 1;

    const ta = Date.parse(a.fechacreacion) || 0;
    const tb = Date.parse(b.fechacreacion) || 0;
    if (tb !== ta) return tb - ta;

    return b.idsolicitud - a.idsolicitud;
  });

  return resultado;
});

const {
  page: solicitudesListadoPage,
  pageSize: solicitudesListadoPageSize,
  total: solicitudesListadoTotal,
  paginatedItems: solicitudesPagina,
} = useClientPagination(solicitudesFiltradas, { initialPageSize: 10 });

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
    tiposMisa.value = await listarTiposMisa();
  } catch (error) {
    console.error('Error cargando tipos de misa:', error);
  }
};

const cargarTodasLasOpciones = async (solicitudes: ISolicitudDb[]) => {
  const idsUnicos = new Set<number>();
  
  solicitudes.forEach(solicitud => {
    if (solicitud.idtipodocumento) idsUnicos.add(solicitud.idtipodocumento);
    if (solicitud.idhorario) idsUnicos.add(solicitud.idhorario);
    if (solicitud.idestadoproceso) idsUnicos.add(solicitud.idestadoproceso);
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

const buscarSolicitudes = async () => {
  await cargarSolicitudes();
};

const limpiarFiltros = () => {
  filtros.value = {
    numeroDocumento: "",
    estado: null,
    fechaDesde: "",
    fechaHasta: "",
  };
};

const getNombreOpcion = (id: number | null | undefined): string => {
  if (id == null) return "N/A";
  const opcion = opcionesCache.value.get(id);
  return opcion?.nombre || "N/A";
};

const getNombreTipoMisa = (s: ISolicitudDb): string =>
  resolveTipoMisaNombre(s.idtipomisa, s.tipomisa ?? null, tiposMisa.value);

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