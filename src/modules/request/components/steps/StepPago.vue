<template>
  <div class="step-content">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E0D5C5] dark:border-gray-700 p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Resumen del Concepto -->
      <div class="bg-gradient-to-r from-[#C88A2A] to-[#D39E3A] rounded-xl p-5 text-white mb-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm opacity-90">Concepto:</p>
            <h3 class="text-xl font-bold">
              {{
                store.esPagoSoloTarifaPlana
                  ? (store.solicitud.nombreTipoMisa || 'Celebración')
                  : `${store.etiquetaPasoLineas} (${store.solicitud.menciones.length})`
              }}
            </h3>
            <p
              v-if="!store.esPagoSoloTarifaPlana && store.solicitud.menciones.length > 0"
              class="text-sm opacity-80 mt-1"
            >
              S/ {{ unitCostoLinea.toFixed(2) }} por {{ etiquetaUnidad }}
            </p>
            <p v-if="store.esPagoSoloTarifaPlana" class="text-sm opacity-80 mt-1">
              {{ store.solicitud.intencion ? store.solicitud.intencion.substring(0, 50) + '...' : '' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-90">Total a pagar:</p>
            <p class="text-3xl font-bold">S/ {{ totalPagar.toFixed(0) }}</p>
          </div>
        </div>
      </div>

      <!-- Método de pago -->
      <div class="mb-6">
        <p class="text-sm font-semibold text-[#4A4A4A] dark:text-gray-200 mb-3">Método de pago</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88A2A] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            :class="
              !esPagoEfectivo
                ? 'border-[#C88A2A] bg-[#FFF5E6] dark:bg-amber-900/25 shadow-sm'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/80 hover:border-[#C88A2A]/50'
            "
            @click="setMetodoPago('digital')"
          >
            <div class="flex items-start gap-3">
              <Icon icon="mdi:bank-transfer" class="w-7 h-7 shrink-0 text-[#C88A2A] dark:text-[#E5A84A]" aria-hidden="true" />
              <div>
                <p class="font-semibold text-[#4A4A4A] dark:text-gray-200">Yape o transferencia</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  Paga con Yape o depósito y sube tu comprobante (captura o PDF).
                </p>
              </div>
            </div>
          </button>
          <button
            type="button"
            class="rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88A2A] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            :class="
              esPagoEfectivo
                ? 'border-[#C88A2A] bg-[#FFF5E6] dark:bg-amber-900/25 shadow-sm'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/80 hover:border-[#C88A2A]/50'
            "
            @click="setMetodoPago('efectivo')"
          >
            <div class="flex items-start gap-3">
              <Icon icon="mdi:cash-multiple" class="w-7 h-7 shrink-0 text-[#C88A2A] dark:text-[#E5A84A]" aria-hidden="true" />
              <div>
                <p class="font-semibold text-[#4A4A4A] dark:text-gray-200">Pago en efectivo</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  Pagará en la iglesia / secretaría. No se solicita comprobante digital; la parroquia gestionará el cobro.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div v-if="!esPagoEfectivo" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Instrucciones -->
        <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-5 border border-[#D39E3A]/30 dark:border-amber-700/30">
          <div class="flex items-center gap-2 mb-4">
            <!-- Yape Icon -->
            <div class="w-8 h-8 bg-[#742284] rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">Y</span>
            </div>
            <h4 class="font-semibold text-[#4A4A4A] dark:text-gray-200">Pagar con Yape</h4>
          </div>
          <ol class="space-y-4 text-sm text-[#4A4A4A] dark:text-gray-300">
            <li class="flex gap-3">
              <span class="w-6 h-6 bg-[#C88A2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Abre tu aplicación de <strong>Yape</strong> en tu celular</span>
            </li>
            <li class="flex gap-3">
              <span class="w-6 h-6 bg-[#C88A2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Selecciona <strong>"Escanear QR"</strong> y apunta al código</span>
            </li>
            <li class="flex gap-3">
              <span class="w-6 h-6 bg-[#C88A2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Ingresa el monto: <strong class="text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ totalPagar.toFixed(2) }}</strong></span>
            </li>
            <li class="flex gap-3">
              <span class="w-6 h-6 bg-[#C88A2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <span>Confirma el pago y <strong>toma una captura de pantalla</strong></span>
            </li>
            <li class="flex gap-3">
              <span class="w-6 h-6 bg-[#C88A2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">5</span>
              <span><strong>Sube la captura</strong> en el botón de abajo</span>
            </li>
          </ol>
        </div>

        <!-- QR Code -->
        <div class="bg-[#742284] rounded-xl p-4 flex items-center justify-center">
          <img 
            src="/images/qr_yape.jpeg" 
            alt="QR Yape" 
            class="w-full h-full max-h-64 object-contain rounded-lg"
          />
        </div>
      </div>

      <!-- Datos Bancarios -->
      <div v-if="!esPagoEfectivo" class="bg-[#4A4A4A] dark:bg-gray-700 rounded-xl p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span class="text-[#0033A0] font-bold text-sm">BCP</span>
            </div>
            <div>
              <p class="text-white font-semibold">Banco de Crédito del Perú</p>
              <p class="text-gray-300 text-sm">Iglesia San Pedro de Lambayeque</p>
            </div>
          </div>
          <div class="text-left md:text-right">
            <p class="text-gray-400 text-xs">Cuenta Corriente</p>
            <p class="text-white font-mono text-lg">XXX-XXXXXXX-X-XX</p>
            <p class="text-gray-400 text-xs mt-1">CCI: 002-XXX-XXXXXXX-X-XX</p>
          </div>
        </div>
      </div>

      <!-- Upload y Resumen en fila -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Upload Zone -->
        <div 
          v-if="!esPagoEfectivo"
          class="border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer"
          :class="[
            archivoSeleccionado 
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
              : fieldErrors.voucher 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-500/50'
                : 'border-[#C88A2A] bg-[#FFF5E6] dark:bg-amber-900/20 dark:border-[#E5A84A]/50 hover:bg-[#FFF0D9] dark:hover:bg-amber-900/30'
          ]"
          @click="triggerFileInput"
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
        >
          <input 
            ref="fileInput"
            type="file" 
            accept=".jpg,.jpeg,.png,.pdf"
            class="hidden"
            @change="handleFileSelect"
          />
          
          <!-- Icono -->
          <div class="flex justify-center mb-3">
            <div v-if="archivoSeleccionado" class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Icon icon="mdi:check-circle-outline" class="w-6 h-6 text-green-500 dark:text-green-400" aria-hidden="true" />
            </div>
            <div v-else class="w-12 h-12 bg-[#C88A2A]/20 dark:bg-[#C88A2A]/10 rounded-full flex items-center justify-center">
              <Icon icon="mdi:cloud-upload-outline" class="w-6 h-6 text-[#C88A2A] dark:text-[#E5A84A]" aria-hidden="true" />
            </div>
          </div>

          <!-- Texto -->
          <p class="font-semibold text-[#4A4A4A] dark:text-gray-200">
            {{ archivoSeleccionado ? archivoSeleccionado.name : 'Subir Comprobante' }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ archivoSeleccionado ? 'Click para cambiar' : 'Click o arrastra archivo' }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">JPG, PNG, PDF (Máx. 5MB)</p>
          
          <!-- Error Message -->
          <p v-if="fieldErrors.voucher" class="text-sm text-red-500 dark:text-red-400 mt-2">
            {{ fieldErrors.voucher }}
          </p>

          <!-- Preview del archivo si es imagen -->
          <div v-if="previewUrl" class="mt-3 flex justify-center">
            <div class="relative">
              <img :src="previewUrl" alt="Preview" class="max-h-24 rounded-lg border border-gray-200 dark:border-gray-600" />
              <button 
                @click.stop="eliminarArchivo"
                class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <Icon icon="mdi:close" class="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border border-emerald-200 bg-emerald-50/90 dark:border-emerald-700/50 dark:bg-emerald-900/20 p-6 flex flex-col gap-3"
        >
          <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
            <Icon icon="mdi:cash-check" class="w-8 h-8 shrink-0" aria-hidden="true" />
            <h4 class="font-semibold">Pago en efectivo en la iglesia</h4>
          </div>
          <p class="text-sm text-emerald-900/95 dark:text-emerald-100/90 leading-relaxed">
            Al finalizar, la solicitud quedará registrada. El monto indicado lo cancelará directamente en la parroquia;
            el personal de la iglesia llevará el registro del pago. No necesita adjuntar voucher ni captura.
          </p>
        </div>

        <!-- Resumen de precios -->
        <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-xl p-5 border border-[#D39E3A]/30 dark:border-amber-700/30">
          <h4 class="font-semibold text-[#4A4A4A] dark:text-gray-200 mb-4">Resumen de Pago</h4>
          <div class="space-y-3">
            <div v-if="store.esPagoSoloTarifaPlana" class="flex justify-between text-[#4A4A4A] dark:text-gray-300">
              <span>{{ store.solicitud.nombreTipoMisa || 'Tarifa' }}</span>
              <span>S/ {{ store.solicitud.montoTotal.toFixed(2) }}</span>
            </div>
            <div v-else-if="store.solicitud.menciones.length > 0">
              <div class="flex justify-between text-[#4A4A4A] dark:text-gray-300 mb-2">
                <span>{{ store.etiquetaPasoLineas }} ({{ store.solicitud.menciones.length }})</span>
                <span>S/ {{ store.totalMenciones.toFixed(2) }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 pl-2 space-y-1 max-h-20 overflow-y-auto">
                <p v-for="(m, i) in store.solicitud.menciones" :key="m.id">
                  {{ i + 1 }}. {{ m.descripcion.substring(0, 30) }}{{ m.descripcion.length > 30 ? '...' : '' }}
                </p>
              </div>
            </div>
            <div class="flex justify-between text-xl font-bold text-[#C88A2A] dark:text-[#E5A84A] pt-3 border-t border-[#D39E3A]/30 dark:border-amber-700/30">
              <span>Total</span>
              <span>S/ {{ totalPagar.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Message -->
      <div 
        v-if="hasInteracted && hasErrors && !esPagoEfectivo" 
        class="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 flex items-center gap-3"
      >
        <Icon icon="mdi:alert-outline" class="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true" />
        <p class="text-amber-700 dark:text-amber-300 text-sm">Debe subir el comprobante de pago para continuar</p>
      </div>

      <!-- Error de registro -->
      <div 
        v-if="submitError" 
        class="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4 flex items-start gap-3"
      >
        <Icon icon="mdi:alert-circle-outline" class="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p class="text-red-700 dark:text-red-300 text-sm">{{ submitError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { COSTO_MENCION } from '../../interfaces/solicitud.interface';
import { registrarSolicitudCompleta } from '../../actions/registrarSolicitudCompleta.action';

const store = useSolicitudStore();

const esPagoEfectivo = computed(
  () => store.solicitud.metodoPago === 'efectivo',
);

function setMetodoPago(m: 'digital' | 'efectivo') {
  store.updatePago({ metodoPago: m });
}

watch(
  () => store.solicitud.metodoPago,
  (m) => {
    if (m === 'efectivo') {
      archivoSeleccionado.value = null;
      previewUrl.value = null;
      fieldErrors.voucher = undefined;
      store.solicitud.voucherPago = '';
      if (fileInput.value) fileInput.value.value = '';
    }
  },
);

const unitCostoLinea = computed(() =>
  store.solicitud.costoMencion > 0 ? store.solicitud.costoMencion : COSTO_MENCION,
);

const etiquetaUnidad = computed(() => {
  const m = store.modoRegistroLineas;
  if (m === 'nino') return 'niño/a';
  if (m === 'pareja') return 'pareja';
  return 'mención';
});

// Refs
const fileInput = ref<HTMLInputElement | null>(null);
const archivoSeleccionado = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isDragging = ref(false);
const hasInteracted = ref(false);
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const fieldErrors = reactive<Record<string, string | undefined>>({});

// Computed
const totalPagar = computed(() => {
  if (store.esPagoSoloTarifaPlana) {
    return store.solicitud.montoTotal;
  }
  return store.totalMenciones;
});

const hasErrors = computed(() => {
  if (store.solicitud.metodoPago === 'efectivo') return false;
  return Object.values(fieldErrors).some((e) => e);
});

// Métodos
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
};

const processFile = (file: File) => {
  // Validar tipo
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    fieldErrors.voucher = 'Formato no válido. Use JPG, PNG o PDF';
    return;
  }

  // Validar tamaño (5MB)
  if (file.size > 5 * 1024 * 1024) {
    fieldErrors.voucher = 'El archivo excede el tamaño máximo de 5MB';
    return;
  }

  archivoSeleccionado.value = file;
  fieldErrors.voucher = undefined;

  // Crear preview si es imagen
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    previewUrl.value = null;
  }

  // Guardar nombre en store
  store.solicitud.voucherPago = file.name;
};

const eliminarArchivo = () => {
  archivoSeleccionado.value = null;
  previewUrl.value = null;
  store.solicitud.voucherPago = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const validateForm = (): boolean => {
  fieldErrors.voucher = undefined;

  if (store.solicitud.metodoPago === 'efectivo') {
    return true;
  }

  if (!archivoSeleccionado.value) {
    fieldErrors.voucher = 'Debe subir el comprobante de pago';
    return false;
  }

  return true;
};

// Registrar solicitud en Supabase
const registrarSolicitud = async (): Promise<boolean> => {
  const efectivo = store.solicitud.metodoPago === 'efectivo';
  if (!efectivo && !archivoSeleccionado.value) return false;

  isSubmitting.value = true;
  submitError.value = null;

  try {
    await registrarSolicitudCompleta(
      { ...store.solicitud, montoTotal: totalPagar.value },
      efectivo ? null : archivoSeleccionado.value,
    );
    localStorage.setItem("solicitud_registered", "true");
    archivoSeleccionado.value = null;
    previewUrl.value = null;
    if (fileInput.value) fileInput.value.value = "";
    if (!efectivo) {
      store.solicitud.voucherPago = "";
    }
    return true;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : 'Error al registrar la solicitud';
    return false;
  } finally {
    isSubmitting.value = false;
  }
};

// Exponer método de validación
defineExpose({
  validate: async () => {
    hasInteracted.value = true;
    submitError.value = null;
    const isValid = validateForm();

    if (!isValid) return false;

    const registered = await registrarSolicitud();
    return registered;
  },
  isSubmitting,
});
</script>

<style scoped>
</style>
