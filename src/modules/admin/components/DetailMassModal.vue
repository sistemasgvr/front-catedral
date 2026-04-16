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
      <div v-if="isOpen" class="fixed inset-0 z-[99999] overflow-y-auto" @click.self="closeModal">
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
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
              :style="{ zoom: detailTextZoom }"
              @click.stop
            >
              <!-- Header -->
              <div class="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="min-w-0">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Detalle de Misa</h2>
                </div>
                <div class="flex items-center gap-2">
                  <DetailModalTextSizeControl v-model="detailTextZoom" :is-modal-open="isOpen" />
                  <button
                    @click="closeModal"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Icon icon="mdi:close" class="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">

                <!-- Loading -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles...</p>
                  </div>
                </div>

                <!-- Error -->
                <div v-else-if="error" class="text-center py-12">
                  <Icon icon="mdi:alert-circle-outline" class="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
                  <p class="mt-4 text-red-600 dark:text-red-400">{{ error }}</p>
                  <button @click="cargarDetalle" class="mt-4 px-4 py-2 bg-[#C88A2A] text-white rounded-lg hover:bg-[#B6791F] transition-colors">
                    Reintentar
                  </button>
                </div>

                <!-- Content -->
                <div v-else-if="misa" class="space-y-6">

                  <!-- Información de la Misa -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:information-outline" class="w-5 h-5 mr-2 text-[#C88A2A]" aria-hidden="true" />
                      Información de la Misa
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Título</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ misa.titulo || 'Sin título' }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Misa</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ misa.tipomisa.nombre }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Celebración</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatearFecha(misa.fechacelebracion) }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Horario</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearHora(misa.horainicio) }} - {{ formatearHora(misa.horafin) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Precio</label>
                        <p class="text-sm font-medium text-[#C88A2A]">S/ {{ Number(misa.tipomisa.precio).toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Menciones con datos del solicitante -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:account-group-outline" class="w-5 h-5 mr-2 text-[#C88A2A]" aria-hidden="true" />
                      Menciones
                      <span class="ml-2 px-2 py-0.5 text-xs font-bold bg-[#C88A2A]/10 text-[#C88A2A] rounded-full">
                        {{ misa.menciones?.length ?? 0 }}
                      </span>
                    </h3>

                    <!-- Sin menciones -->
                    <div
                      v-if="!misa.menciones || misa.menciones.length === 0"
                      class="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 italic"
                    >
                      <Icon icon="mdi:emoticon-sad-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                      No hay menciones registradas para esta misa.
                    </div>

                    <!-- Lista -->
                    <ul v-else class="space-y-3">
                      <li
                        v-for="(item, index) in misa.menciones"
                        :key="item.idmencionmisa"
                        class="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <!-- Número -->
                        <span class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#C88A2A]/10 text-[#C88A2A] text-xs font-bold mt-0.5">
                          {{ index + 1 }}
                        </span>

                        <div class="flex-1 min-w-0 space-y-2">
                          <!-- Nombre -->
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ item.mencion.solicitud.nombres }} {{ item.mencion.solicitud.apellidos }}
                          </p>

                          <!-- Intención -->
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ item.mencion.solicitud.intencion || item.mencion.descripcion || 'Sin intención especificada' }}
                          </p>

                          <!-- Datos de contacto -->
                          <div class="flex flex-wrap gap-3 pt-1">
                            <span
                              v-if="item.mencion.solicitud.celular"
                              class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                            >
                              <Icon icon="mdi:phone-outline" class="w-3.5 h-3.5 text-[#C88A2A] shrink-0" aria-hidden="true" />
                              {{ item.mencion.solicitud.celular }}
                            </span>
                            <span
                              v-if="item.mencion.solicitud.correo"
                              class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                            >
                              <Icon icon="mdi:email-outline" class="w-3.5 h-3.5 text-[#C88A2A] shrink-0" aria-hidden="true" />
                              {{ item.mencion.solicitud.correo }}
                            </span>
                            <span
                              v-if="item.mencion.solicitud.nrodocumento"
                              class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                            >
                              <Icon icon="mdi:card-account-details-outline" class="w-3.5 h-3.5 text-[#C88A2A] shrink-0" aria-hidden="true" />
                              Doc: {{ item.mencion.solicitud.nrodocumento }}
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- Auditoría -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:history" class="w-5 h-5 mr-2 text-[#C88A2A]" aria-hidden="true" />
                      Información de Auditoría
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Creación</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatearFechaHora(misa.fechacreacion) }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Última Modificación</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ misa.fechamodificacion ? formatearFechaHora(misa.fechamodificacion) : 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Footer -->
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
import { Icon } from '@iconify/vue';
import DetailModalTextSizeControl from './DetailModalTextSizeControl.vue';
import { obtenerDetalleMisa } from '../actions/crudMisa.action';
import type { IMisaDetalle } from '../interfaces/misa.interface';

interface Props {
  isOpen: boolean;
  misaId: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const detailTextZoom = ref(1.12);

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
  } finally {
    loading.value = false;
  }
};

const closeModal = () => emit('close');

const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
};

const formatearHora = (hora: string): string => {
  if (!hora || !hora.includes(':')) return 'N/A';
  const [hh = '0', mm = '0'] = hora.split(':');
  const d = new Date();
  d.setHours(parseInt(hh, 10), parseInt(mm, 10));
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatearFechaHora = (fecha: string): string => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

watch(() => props.isOpen, (val) => {
  if (val && props.misaId) cargarDetalle();
});
</script>