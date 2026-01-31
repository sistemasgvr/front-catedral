<template>
  <div class="step-content">
    <div class="bg-white rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Resumen del Concepto -->
      <div class="bg-gradient-to-r from-[#C88A2A] to-[#D39E3A] rounded-xl p-5 text-white mb-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm opacity-90">Concepto:</p>
            <h3 class="text-xl font-bold">
              {{ store.esMisaPrivada ? 'Misa Privada' : `Menciones (${store.solicitud.menciones.length})` }}
            </h3>
            <p v-if="!store.esMisaPrivada && store.solicitud.menciones.length > 0" class="text-sm opacity-80 mt-1">
              S/ {{ COSTO_MENCION.toFixed(2) }} por mención
            </p>
            <p v-if="store.esMisaPrivada" class="text-sm opacity-80 mt-1">
              {{ store.solicitud.intencion ? store.solicitud.intencion.substring(0, 50) + '...' : '' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-90">Total a pagar:</p>
            <p class="text-3xl font-bold">S/ {{ totalPagar.toFixed(0) }}</p>
          </div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Instrucciones -->
        <div class="bg-[#FFF5E6] rounded-xl p-5 border border-[#D39E3A]/30">
          <div class="flex items-center gap-2 mb-4">
            <!-- Yape Icon -->
            <div class="w-8 h-8 bg-[#742284] rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">Y</span>
            </div>
            <h4 class="font-semibold text-[#4A4A4A]">Pagar con Yape</h4>
          </div>
          <ol class="space-y-4 text-sm text-[#4A4A4A]">
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
              <span>Ingresa el monto: <strong class="text-[#C88A2A]">S/ {{ totalPagar.toFixed(2) }}</strong></span>
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
      <div class="bg-[#4A4A4A] rounded-xl p-4 mb-6">
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
          class="border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer"
          :class="[
            archivoSeleccionado 
              ? 'border-green-400 bg-green-50' 
              : fieldErrors.voucher 
                ? 'border-red-300 bg-red-50'
                : 'border-[#C88A2A] bg-[#FFF5E6] hover:bg-[#FFF0D9]'
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
            <div v-if="archivoSeleccionado" class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div v-else class="w-12 h-12 bg-[#C88A2A]/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          <!-- Texto -->
          <p class="font-semibold text-[#4A4A4A]">
            {{ archivoSeleccionado ? archivoSeleccionado.name : 'Subir Comprobante' }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ archivoSeleccionado ? 'Click para cambiar' : 'Click o arrastra archivo' }}
          </p>
          <p class="text-xs text-gray-400 mt-2">JPG, PNG, PDF (Máx. 5MB)</p>
          
          <!-- Error Message -->
          <p v-if="fieldErrors.voucher" class="text-sm text-red-500 mt-2">
            {{ fieldErrors.voucher }}
          </p>

          <!-- Preview del archivo si es imagen -->
          <div v-if="previewUrl" class="mt-3 flex justify-center">
            <div class="relative">
              <img :src="previewUrl" alt="Preview" class="max-h-24 rounded-lg border border-gray-200" />
              <button 
                @click.stop="eliminarArchivo"
                class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen de precios -->
        <div class="bg-[#FFF5E6] rounded-xl p-5 border border-[#D39E3A]/30">
          <h4 class="font-semibold text-[#4A4A4A] mb-4">Resumen de Pago</h4>
          <div class="space-y-3">
            <div v-if="store.esMisaPrivada" class="flex justify-between text-[#4A4A4A]">
              <span>Misa Privada</span>
              <span>S/ {{ store.solicitud.montoTotal.toFixed(2) }}</span>
            </div>
            <div v-else-if="store.solicitud.menciones.length > 0">
              <div class="flex justify-between text-[#4A4A4A] mb-2">
                <span>Menciones ({{ store.solicitud.menciones.length }})</span>
                <span>S/ {{ store.totalMenciones.toFixed(2) }}</span>
              </div>
              <div class="text-xs text-gray-500 pl-2 space-y-1 max-h-20 overflow-y-auto">
                <p v-for="(m, i) in store.solicitud.menciones" :key="m.id">
                  {{ i + 1 }}. {{ m.descripcion.substring(0, 30) }}{{ m.descripcion.length > 30 ? '...' : '' }}
                </p>
              </div>
            </div>
            <div class="flex justify-between text-xl font-bold text-[#C88A2A] pt-3 border-t border-[#D39E3A]/30">
              <span>Total</span>
              <span>S/ {{ totalPagar.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Message -->
      <div 
        v-if="hasInteracted && hasErrors" 
        class="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3"
      >
        <svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-amber-700 text-sm">Debe subir el comprobante de pago para continuar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { COSTO_MENCION } from '../../interfaces/solicitud.interface';

const store = useSolicitudStore();

// Refs
const fileInput = ref<HTMLInputElement | null>(null);
const archivoSeleccionado = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isDragging = ref(false);
const hasInteracted = ref(false);
const fieldErrors = reactive<Record<string, string | undefined>>({});

// Computed
const totalPagar = computed(() => {
  if (store.esMisaPrivada) {
    return store.solicitud.montoTotal;
  }
  return store.totalMenciones;
});

const hasErrors = computed(() => Object.values(fieldErrors).some(e => e));

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

  if (!archivoSeleccionado.value) {
    fieldErrors.voucher = 'Debe subir el comprobante de pago';
    return false;
  }

  return true;
};

// Registrar solicitud (por ahora en consola)
const registrarSolicitud = async () => {
  console.log('='.repeat(50));
  console.log('REGISTRO DE SOLICITUD');
  console.log('='.repeat(50));
  console.log('Datos del Solicitante:', {
    tipoDocumento: store.solicitud.idTipoDocumento,
    nroDocumento: store.solicitud.nroDocumento,
    nombres: store.solicitud.nombres,
    apellidos: store.solicitud.apellidos,
    celular: store.solicitud.celular,
    correo: store.solicitud.correo,
  });
  console.log('Datos de la Celebración:', {
    tipoMisa: store.esMisaPrivada ? 'Misa Privada' : 'Misa Comunitaria',
    fechaCelebracion: store.solicitud.fechaCelebracion,
    idHorario: store.solicitud.idHorario,
    intencion: store.solicitud.intencion,
  });
  if (!store.esMisaPrivada) {
    console.log('Menciones:', store.solicitud.menciones);
  }
  console.log('Pago:', {
    voucher: store.solicitud.voucherPago,
    montoTotal: totalPagar.value,
  });
  console.log('JSON Completo:', store.getSolicitudJSON());
  console.log('='.repeat(50));
};

// Exponer método de validación
defineExpose({
  validate: async () => {
    hasInteracted.value = true;
    const isValid = validateForm();
    
    if (isValid) {
      // Registrar solicitud antes de pasar al resumen
      await registrarSolicitud();
    }
    
    return isValid;
  },
});
</script>

<style scoped>
</style>
