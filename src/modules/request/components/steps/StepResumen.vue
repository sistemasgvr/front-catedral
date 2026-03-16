<template>
  <div class="step-content">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E0D5C5] dark:border-gray-700 p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Success Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-serif font-bold text-[#C88A2A] dark:text-[#E5A84A]">
          ¡Solicitud Registrada!
        </h2>
        <p class="text-[#4A4A4A] dark:text-gray-300 mt-2">Su solicitud ha sido registrada exitosamente</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Nos comunicaremos con usted a la brevedad posible</p>
      </div>

      <!-- Secciones de Resumen en grid para desktop -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Datos del Solicitante -->
        <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-4 border border-[#D39E3A]/20 dark:border-amber-700/30">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-[#C88A2A]/20 dark:bg-[#C88A2A]/10 rounded-full flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-[#C88A2A] dark:text-[#E5A84A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-[#4A4A4A] dark:text-gray-200 text-sm">Datos del Solicitante</h3>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Nombre</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ store.solicitud.nombres }} {{ store.solicitud.apellidos }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Documento</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ tipoDocumentoNombre }}: {{ store.solicitud.nroDocumento }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Teléfono</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ store.solicitud.celular }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Correo</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200 truncate">{{ store.solicitud.correo }}</p>
            </div>
          </div>
        </div>

        <!-- Datos de la Celebración -->
        <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-4 border border-[#D39E3A]/20 dark:border-amber-700/30">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-[#C88A2A]/20 dark:bg-[#C88A2A]/10 rounded-full flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-[#C88A2A] dark:text-[#E5A84A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="font-semibold text-[#4A4A4A] dark:text-gray-200 text-sm">Datos de la Celebración</h3>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Fecha</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ formatDate(store.solicitud.fechaCelebracion) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Horario</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ horarioNombre }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-500 dark:text-gray-400">Tipo de Misa</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200">{{ store.esMisaPrivada ? 'Misa Privada' : 'Misa Comunitaria' }}</p>
            </div>
            <div v-if="store.esMisaPrivada && store.solicitud.intencion" class="col-span-2">
              <p class="text-gray-500 dark:text-gray-400">Intención</p>
              <p class="font-medium text-[#4A4A4A] dark:text-gray-200 line-clamp-2">{{ store.solicitud.intencion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Segunda fila: Menciones y Pago -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Menciones (solo si hay) -->
        <div v-if="!store.esMisaPrivada && store.solicitud.menciones.length > 0" class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-4 border border-[#D39E3A]/20 dark:border-amber-700/30">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-[#C88A2A]/20 dark:bg-[#C88A2A]/10 rounded-full flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#C88A2A] dark:text-[#E5A84A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="font-semibold text-[#4A4A4A] dark:text-gray-200 text-sm">Menciones ({{ store.solicitud.menciones.length }})</h3>
            </div>
            <span class="text-xs text-[#C88A2A] dark:text-[#E5A84A] font-medium">S/ {{ COSTO_MENCION.toFixed(2) }} c/u</span>
          </div>
          <div class="space-y-1 max-h-24 overflow-y-auto">
            <div 
              v-for="(mencion, index) in store.solicitud.menciones" 
              :key="mencion.id"
              class="flex justify-between items-center text-xs py-1 border-b border-[#D39E3A]/10 dark:border-amber-700/20 last:border-0"
            >
              <span class="text-[#4A4A4A] dark:text-gray-300 truncate mr-2">{{ index + 1 }}. {{ mencion.descripcion }}</span>
              <span class="text-gray-500 dark:text-gray-400 shrink-0">S/ {{ mencion.costo.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Información de Pago -->
        <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-4 border border-[#D39E3A]/20 dark:border-amber-700/30" :class="{ 'md:col-span-2': store.esMisaPrivada || store.solicitud.menciones.length === 0 }">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-[#C88A2A]/20 dark:bg-[#C88A2A]/10 rounded-full flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-[#C88A2A] dark:text-[#E5A84A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-[#4A4A4A] dark:text-gray-200 text-sm">Información de Pago</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Comprobante: {{ store.solicitud.voucherPago }}</p>
            </div>
          </div>
          
          <div class="space-y-2 text-xs">
            <div v-if="store.esMisaPrivada" class="flex justify-between">
              <span class="text-[#4A4A4A] dark:text-gray-300">Misa Privada</span>
              <span class="text-[#4A4A4A] dark:text-gray-300">S/ {{ store.solicitud.montoTotal.toFixed(2) }}</span>
            </div>
            <div v-else class="flex justify-between">
              <span class="text-[#4A4A4A] dark:text-gray-300">Menciones ({{ store.solicitud.menciones.length }} x S/ {{ COSTO_MENCION.toFixed(2) }})</span>
              <span class="text-[#4A4A4A] dark:text-gray-300">S/ {{ store.totalMenciones.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-[#D39E3A]/20 dark:border-amber-700/30">
              <span class="font-bold text-[#4A4A4A] dark:text-gray-200">Total Pagado</span>
              <span class="font-bold text-lg text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ totalPagado.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <button
          @click.stop="$emit('ir-inicio')"
          class="px-6 py-3 border border-[#C88A2A] dark:border-[#E5A84A] text-[#C88A2A] dark:text-[#E5A84A] hover:bg-[#FFF5E6] dark:hover:bg-amber-900/20 rounded-lg font-medium transition-colors"
        >
          Ir al inicio
        </button>
        <!-- <button
          @click.stop="$emit('nueva-solicitud')"
          class="px-6 py-3 bg-[#C88A2A] hover:bg-[#B6791F] text-white rounded-lg font-medium transition-colors"
        >
          Nueva solicitud
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { COSTO_MENCION } from '../../interfaces/solicitud.interface';
import { getOpcionesLista } from '../../actions/getOpcionesLista.action';
import { mapOpcionToSelect } from '../../interfaces/opcionLista.interface';

const store = useSolicitudStore();
const router = useRouter();

const ID_LISTA_TIPOS_DOCUMENTO = 1;
const ID_LISTA_HORARIOS = 5;

const tiposDocumento = ref<{ id: number; nombre: string }[]>([]);
const horarios = ref<{ id: number; nombre: string }[]>([]);

defineEmits(['ir-inicio', 'nueva-solicitud']);

onMounted(async () => {
  try {
    const [docs, hors] = await Promise.all([
      getOpcionesLista(ID_LISTA_TIPOS_DOCUMENTO).then(opts => opts.map(mapOpcionToSelect)),
      getOpcionesLista(ID_LISTA_HORARIOS).then(opts => opts.map(mapOpcionToSelect)),
    ]);
    tiposDocumento.value = docs;
    horarios.value = hors;
  } catch {
    // Fallback estático si falla la carga
    tiposDocumento.value = [{ id: 1, nombre: 'DNI' }, { id: 2, nombre: 'CE' }, { id: 3, nombre: 'Pasaporte' }];
    horarios.value = [
      { id: 1, nombre: '07:00 AM' }, { id: 2, nombre: '09:00 AM' }, { id: 3, nombre: '11:00 AM' },
      { id: 4, nombre: '05:00 PM' }, { id: 5, nombre: '07:00 PM' },
    ];
  }
});

// Computed
const totalPagado = computed(() => {
  if (store.esMisaPrivada) {
    return store.solicitud.montoTotal;
  }
  return store.totalMenciones;
});

const tipoDocumentoNombre = computed(() => {
  const tipo = tiposDocumento.value.find(t => t.id === store.solicitud.idTipoDocumento);
  return tipo?.nombre || '';
});

const horarioNombre = computed(() => {
  const h = horarios.value.find(h => h.id === store.solicitud.idHorario);
  return h?.nombre || '';
});

// Formatear fecha
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Nueva solicitud
// const nuevaSolicitud = () => {
//   store.resetSolicitud();
//   router.push('/nueva-solicitud');
// };
</script>

<style scoped>
</style>
