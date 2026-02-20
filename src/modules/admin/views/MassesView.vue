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
                    Gestión de Misas
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400">
                    Administra el calendario de misas y celebraciones
                  </p>
                </div>
                <button
                  @click="abrirModalCrear"
                  class="w-full sm:w-auto px-6 py-3 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#C88A2A] dark:focus:ring-offset-gray-900 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Misa
                </button>
              </div>
            </div>

            <!-- Filters Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtros</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Búsqueda -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar
                  </label>
                  <input
                    v-model="filtros.busqueda"
                    type="text"
                    placeholder="Tipo, intención, solicitante..."
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Tipo de Misa -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Misa
                  </label>
                  <select 
                    v-model="filtros.tipoMisa"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option :value="null">Todas</option>
                    <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                      {{ tipo.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Mes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mes
                  </label>
                  <select 
                    v-model="filtros.mes"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option :value="null">Todos</option>
                    <option v-for="mes in mesesDisponibles" :key="mes.valor" :value="mes.valor">
                      {{ mes.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Estado -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select 
                    v-model="filtros.estado"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option :value="null">Todos</option>
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <!-- Total Misas -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Misas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.total }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Este Mes -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Este Mes</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.esteMes }}</p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Próximas -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Próximas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.proximas }}</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Activas -->
              <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Activas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.activas }}</p>
                  </div>
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-colors">
              <!-- Loading State -->
              <div v-if="loading" class="p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando misas...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="misasFiltradas.length === 0" class="p-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-4 text-gray-600 dark:text-gray-400">No se encontraron misas</p>
              </div>

              <!-- Desktop Table -->
              <div v-else class="hidden lg:block overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Código
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Misa
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Título / Intención
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr 
                      v-for="misa in misasFiltradas" 
                      :key="misa.idmisa"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ misa.idmisa }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">
                          <div class="font-medium text-gray-900 dark:text-white">{{ formatearFecha(misa.fechacelebracion) }}</div>
                          <div class="text-gray-500 dark:text-gray-400">{{ formatearHora(misa.horainicio) }} - {{ formatearHora(misa.horafin) }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm text-gray-900 dark:text-gray-200">{{ misa.tipomisa?.nombre || 'N/A' }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <div class="text-gray-900 dark:text-white">{{ misa.titulo || misa.solicitud?.intencion || 'Sin título' }}</div>
                          <div v-if="misa.solicitud" class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Sol: {{ misa.solicitud.nombres }} {{ misa.solicitud.apellidos }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="misa.estado ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ misa.estado ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            @click="verDetalle(misa.idmisa)"
                            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                            title="Ver"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            @click="editarMisa(misa.idmisa)"
                            class="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            @click="confirmarEliminar(misa.idmisa)"
                            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Eliminar"
                          >
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

              <!-- Mobile/Tablet Cards -->
              <div class="lg:hidden p-4 space-y-4">
                <div 
                  v-for="misa in misasFiltradas" 
                  :key="misa.idmisa"
                  class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm transition-colors"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ misa.idmisa }}</span>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ formatearFecha(misa.fechacelebracion) }} - {{ formatearHora(misa.horainicio) }}
                      </div>
                    </div>
                    <span :class="misa.estado ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'" class="px-2 py-1 text-xs font-semibold rounded-full">
                      {{ misa.estado ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>

                  <div class="space-y-2 mb-3">
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                      <span class="text-sm text-gray-900 dark:text-white ml-1 font-medium">{{ misa.tipomisa?.nombre || 'N/A' }}</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Título:</span>
                      <div class="text-sm text-gray-900 dark:text-white mt-0.5">{{ misa.titulo || misa.solicitud?.intencion || 'Sin título' }}</div>
                    </div>
                    <div v-if="misa.solicitud">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Solicitante:</span>
                      <span class="text-sm text-gray-900 dark:text-white ml-1">{{ misa.solicitud.nombres }} {{ misa.solicitud.apellidos }}</span>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button 
                      @click="verDetalle(misa.idmisa)"
                      class="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button 
                      @click="editarMisa(misa.idmisa)"
                      class="flex-1 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button 
                      @click="confirmarEliminar(misa.idmisa)"
                      class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { listarMisas } from '../actions/listarMisas.action';
import { eliminarMisa } from '../actions/eliminarMisa.action';
import { getTiposMisa } from '../actions/getTiposMisa.action';
import type { IMisaConRelaciones } from '../interfaces/misa.interface';
import type { ITipoMisa } from '../interfaces/tipoMisa.interface';

/* ================================
   STATE
================================ */

const misas = ref<IMisaConRelaciones[]>([]);
const tiposMisa = ref<ITipoMisa[]>([]);
const loading = ref(false);

const filtros = ref({
  busqueda: '',
  tipoMisa: null as number | null,
  mes: null as string | null,
  estado: null as boolean | null,
});

/* ================================
   COMPUTED
================================ */

const misasFiltradas = computed(() => {
  let resultado = [...misas.value];

  // Filtrar por búsqueda
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter(m => 
      m.tipomisa?.nombre.toLowerCase().includes(busqueda) ||
      m.titulo?.toLowerCase().includes(busqueda) ||
      m.solicitud?.intencion?.toLowerCase().includes(busqueda) ||
      m.solicitud?.nombres.toLowerCase().includes(busqueda) ||
      m.solicitud?.apellidos.toLowerCase().includes(busqueda)
    );
  }

  // Filtrar por tipo de misa
  if (filtros.value.tipoMisa !== null) {
    resultado = resultado.filter(m => m.idtipomisa === filtros.value.tipoMisa);
  }

  // Filtrar por mes
  if (filtros.value.mes) {
    resultado = resultado.filter(m => 
      m.fechacelebracion.startsWith(filtros.value.mes!)
    );
  }

  // Filtrar por estado
  if (filtros.value.estado !== null) {
    resultado = resultado.filter(m => m.estado === filtros.value.estado);
  }

  return resultado;
});

const mesesDisponibles = computed(() => {
  const meses: { valor: string; nombre: string }[] = [];
  const hoy = new Date();
  
  for (let i = -2; i <= 12; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const valor = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const nombre = fecha.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    meses.push({ valor, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1) });
  }
  
  return meses;
});

const estadisticas = computed(() => {
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  
  return {
    total: misas.value.length,
    esteMes: misas.value.filter(m => m.fechacelebracion.startsWith(mesActual)).length,
    proximas: misas.value.filter(m => new Date(m.fechacelebracion) >= hoy).length,
    activas: misas.value.filter(m => m.estado).length,
  };
});

/* ================================
   METHODS
================================ */

const cargarMisas = async () => {
  loading.value = true;
  try {
    misas.value = await listarMisas();
  } catch (error) {
    console.error('Error cargando misas:', error);
  } finally {
    loading.value = false;
  }
};

const cargarTiposMisa = async () => {
  try {
    tiposMisa.value = await getTiposMisa();
  } catch (error) {
    console.error('Error cargando tipos de misa:', error);
  }
};

const abrirModalCrear = () => {
  console.log('Abrir modal crear misa');
  // TODO: Implementar modal de creación
};

const verDetalle = (idMisa: number) => {
  console.log('Ver detalle misa:', idMisa);
  // TODO: Implementar vista de detalle
};

const editarMisa = (idMisa: number) => {
  console.log('Editar misa:', idMisa);
  // TODO: Implementar modal de edición
};

const confirmarEliminar = async (idMisa: number) => {
  const confirmacion = confirm('¿Está seguro de eliminar esta misa?');
  if (!confirmacion) return;

  try {
    await eliminarMisa(idMisa);
    await cargarMisas(); // Recargar lista
  } catch (error) {
    console.error('Error eliminando misa:', error);
    alert('Error al eliminar la misa');
  }
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    weekday: 'short',
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

const formatearHora = (hora: string): string => {
  if (!hora || !hora.includes(':')) return 'N/A';

  // Al asignar strings vacíos por defecto, evitamos el error de 'undefined'
  const [hh = '0', mm = '0'] = hora.split(':');
  
  const date = new Date();
  date.setHours(parseInt(hh), parseInt(mm));

  return date.toLocaleTimeString('es-PE', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

/* ================================
   LIFECYCLE
================================ */

onMounted(async () => {
  await Promise.all([
    cargarTiposMisa(),
    cargarMisas(),
  ]);
});
</script>