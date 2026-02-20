<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- BIENVENIDA -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#C88A2A] to-[#B6791F] p-8 shadow-lg animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              ¡Bienvenido, {{ user?.nombre || 'Administrador' }}!
            </h1>
            <p class="text-white/90">
              Panel de Administración de la Catedral
            </p>
          </div>
          <div class="hidden md:block">
            <svg class="w-20 h-20 text-white/20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#C88A2A]"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>

      <!-- CONTENT -->
      <template v-else>
        <!-- MÉTRICAS PRINCIPALES -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <!-- TOTAL -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Solicitudes
                </p>
                <h4 class="text-3xl font-bold text-gray-900 dark:text-white mt-2 animate-count-up">
                  {{ dashboardData.metrics.total }}
                </h4>
              </div>
              <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- EN REVISIÓN -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.2s">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  En Revisión
                </p>
                <h4 class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2 animate-count-up">
                  {{ dashboardData.metrics.pendientes }}
                </h4>
              </div>
              <div class="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- APROBADAS -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.3s">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Aprobadas
                </p>
                <h4 class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2 animate-count-up">
                  {{ dashboardData.metrics.aprobadas }}
                </h4>
              </div>
              <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- DENEGADAS -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.4s">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Denegadas
                </p>
                <h4 class="text-3xl font-bold text-red-600 dark:text-red-400 mt-2 animate-count-up">
                  {{ dashboardData.metrics.denegadas }}
                </h4>
              </div>
              <div class="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- GRÁFICOS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Solicitudes por mes -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg animate-slide-up" style="animation-delay: 0.5s">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Solicitudes por Mes
            </h3>
            <div class="h-64">
              <ChartComponent 
                type="line" 
                :data="chartSolicitudesMes" 
                :options="lineChartOptions"
              />
            </div>
          </div>

          <!-- Solicitudes por tipo de misa -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg animate-slide-up" style="animation-delay: 0.6s">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Solicitudes por Tipo de Misa
            </h3>
            <div class="h-64">
              <ChartComponent 
                type="doughnut" 
                :data="chartTipoMisa" 
                :options="doughnutChartOptions"
              />
            </div>
          </div>
        </div>

        <!-- MISAS E INGRESOS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Misas Próximas -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg animate-slide-up" style="animation-delay: 0.7s">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Misas Próximas
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">Esta Semana</span>
                <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ dashboardData.misasProximas.estaSemana }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">Este Mes</span>
                <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ dashboardData.misasProximas.esteMes }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">Total Programadas</span>
                <span class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ dashboardData.misasProximas.total }}</span>
              </div>
            </div>
          </div>

          <!-- Ingresos Totales -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#C88A2A] to-[#B6791F] p-6 shadow-lg animate-slide-up" style="animation-delay: 0.8s">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ingresos Totales
            </h3>
            <div class="text-center py-6">
              <p class="text-4xl font-bold text-white animate-count-up">
                S/ {{ formatearMonto(dashboardData.ingresosTotales) }}
              </p>
              <p class="text-white/80 text-sm mt-2">
                De solicitudes aprobadas
              </p>
            </div>
          </div>

          <!-- Distribución por tipo -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg animate-slide-up" style="animation-delay: 0.9s">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ingresos por Tipo
            </h3>
            <div class="space-y-3">
              <div 
                v-for="tipo in dashboardData.solicitudesPorTipoMisa.slice(0, 3)" 
                :key="tipo.tipo"
                class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ tipo.tipo }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ tipo.cantidad }} solicitudes</p>
                </div>
                <span class="text-sm font-bold text-[#C88A2A]">S/ {{ formatearMonto(tipo.monto) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SOLICITUDES RECIENTES -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg animate-slide-up" style="animation-delay: 1s">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Solicitudes Recientes
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Código</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Solicitante</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="solicitud in dashboardData.solicitudesRecientes" 
                  :key="solicitud.idsolicitud"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ solicitud.idsolicitud }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ solicitud.nombres }} {{ solicitud.apellidos }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatearFecha(solicitud.fechasolicitud) }}
                  </td>
                  <td class="px-4 py-3">
                    <span :class="getEstadoClass(solicitud.estado)">
                      {{ solicitud.estado || 'Sin estado' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import ChartComponent from "../components/ChartComponent.vue";
import { getDashboardData } from "../actions/dashboard.actions";
import type { IDashboardData } from "../interfaces/dashboard.interface";

const user = ref<any>(null);
const loading = ref(false);
let intervalId: number | null = null;

const dashboardData = ref<IDashboardData>({
  metrics: {
    pendientes: 0,
    aprobadas: 0,
    denegadas: 0,
    total: 0
  },
  solicitudesPorMes: [],
  solicitudesPorTipoMisa: [],
  misasProximas: {
    total: 0,
    estaSemana: 0,
    esteMes: 0,
  },
  ingresosTotales: 0,
  solicitudesRecientes: [],
});

const loadDashboard = async () => {
  try {
    loading.value = true;
    dashboardData.value = await getDashboardData();
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  } finally {
    loading.value = false;
  }
};

// Configuración de gráficos
const chartSolicitudesMes = computed(() => ({
  labels: dashboardData.value.solicitudesPorMes.map(d => d.mes),
  datasets: [{
    label: 'Solicitudes',
    data: dashboardData.value.solicitudesPorMes.map(d => d.cantidad),
    borderColor: '#C88A2A',
    backgroundColor: 'rgba(200, 138, 42, 0.1)',
    tension: 0.4,
    fill: true,
  }]
}));

const chartTipoMisa = computed(() => ({
  labels: dashboardData.value.solicitudesPorTipoMisa.map(d => d.tipo),
  datasets: [{
    data: dashboardData.value.solicitudesPorTipoMisa.map(d => d.cantidad),
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)',
    ],
    borderWidth: 2,
  }]
}));

const lineChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

const doughnutChartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

const formatearMonto = (monto: number): string => {
  return monto.toFixed(2);
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

const getEstadoClass = (estado: string | null): string => {
  if (!estado) return 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  
  const estadoUpper = estado.toUpperCase();
  
  if (estadoUpper.includes('APROBADA') || estadoUpper.includes('APROBADO')) {
    return 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  }
  
  if (estadoUpper.includes('DENEGADA') || estadoUpper.includes('DENEGADO')) {
    return 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  }
  
  if (estadoUpper.includes('REVISIÓN') || estadoUpper.includes('REVISION') || estadoUpper.includes('PENDIENTE')) {
    return 'px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
  }

  return 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
};

onMounted(async () => {
  // Usuario desde localStorage
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }

  // Cargar dashboard
  await loadDashboard();

  // Actualizar cada 30 segundos
  // intervalId = window.setInterval(() => {
  //   loadDashboard();
  // }, 30000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes count-up {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-count-up {
  animation: count-up 0.5s ease-out;
}
</style>