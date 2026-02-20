<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[99999] overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Backdrop con Blur -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-all"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[100000]"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalle de Misa
                  </h2>
                  <p v-if="misa" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ID: {{ misa.idmisa }}
                  </p>
                </div>
                <button
                  @click="closeModal"
                  class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles...</p>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="mt-4 text-red-600 dark:text-red-400">{{ error }}</p>
                  <button
                    @click="cargarDetalle"
                    class="mt-4 px-4 py-2 bg-[#C88A2A] text-white rounded-lg hover:bg-[#B6791F] transition-colors"
                  >
                    Reintentar
                  </button>
                </div>

                <!-- Content -->
                <div v-else-if="misa" class="space-y-6">
                  <!-- Información Principal -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Información de la Misa
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Título
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ misa.titulo || 'Sin título' }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Tipo de Misa
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ misa.tipomisa.nombre }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fecha de Celebración
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFecha(misa.fechacelebracion) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Horario
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearHora(misa.horainicio) }} - {{ formatearHora(misa.horafin) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Precio
                        </label>
                        <p class="text-sm font-medium text-[#C88A2A]">
                          S/ {{ Number(misa.tipomisa.precio).toFixed(2) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Estado
                        </label>
                        <span :class="misa.estado ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'" class="px-2 py-1 text-xs font-semibold rounded-full">
                          {{ misa.estado ? 'Activa' : 'Inactiva' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Menciones -->
                  <div v-if="misa.menciones && misa.menciones.length > 0" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Menciones ({{ misa.menciones.length }})
                    </h3>
                    <div class="space-y-3">
                      <div 
                        v-for="mencion in misa.menciones" 
                        :key="mencion.idmencion"
                        class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {{ mencion.solicitud.nombres }} {{ mencion.solicitud.apellidos }}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          {{ mencion.solicitud.intencion || mencion.descripcion || 'Sin intención especificada' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Auditoría -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Información de Auditoría
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fecha de Creación
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFechaHora(misa.fechacreacion) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Última Modificación
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ misa.fechamodificacion ? formatearFechaHora(misa.fechamodificacion) : 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="closeModal"
                  class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { obtenerDetalleMisa } from '../actions/crudMisa.action';
import type { IMisaDetalle } from '../interfaces/misa.interface';

interface Props {
  isOpen: boolean;
  misaId: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const misa = ref<IMisaDetalle | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const cargarDetalle = async () => {
  if (!props.misaId) return;

  loading.value = true;
  error.value = null;
  misa.value = null;

  try {
    misa.value = await obtenerDetalleMisa(props.misaId);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el detalle';
    console.error('Error cargando detalle:', err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    weekday: 'long',
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

const formatearHora = (hora: string): string => {
  if (!hora || !hora.includes(':')) return 'N/A';

  // Asignamos '' por defecto para que TS sepa que siempre será un string
  const [hh = '', mm = ''] = hora.split(':');

  const date = new Date();
  
  // Usamos Number() o parseInt() con los strings ya asegurados
  date.setHours(parseInt(hh, 10), parseInt(mm, 10));

  return date.toLocaleTimeString('es-PE', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
};

const formatearFechaHora = (fecha: string): string => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.misaId) {
      cargarDetalle();
    }
  }
);
</script>