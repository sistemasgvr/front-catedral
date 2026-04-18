<template>
  <div class="step-content">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E0D5C5] dark:border-gray-700 p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] dark:text-[#E5A84A] mb-2 text-center">
        {{ tituloPaso }}
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] dark:bg-[#E5A84A] rounded mx-auto mb-6"></div>

      <!-- Descripción -->
      <p class="text-sm text-[#7A7A7A] dark:text-gray-400 text-center mb-6">
        {{ descripcionPaso }}
        <template v-if="store.modoRegistroLineas === 'mencion'">
          Cada mención tiene un costo de
          <span class="font-semibold text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ COSTO_UNITARIO.toFixed(2) }}</span>.
        </template>
        <template v-else>
          Cada registro tiene un costo de
          <span class="font-semibold text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ COSTO_UNITARIO.toFixed(2) }}</span>.
        </template>
      </p>
      <p
        v-if="modoLineas === 'nino' || modoLineas === 'pareja'"
        class="mx-auto max-w-xl text-center text-xs sm:text-sm text-amber-900 dark:text-amber-100/95 bg-amber-50/90 dark:bg-amber-950/35 border border-amber-200/90 dark:border-amber-800/50 rounded-lg px-3 py-2.5 mb-5"
      >
        <template v-if="modoLineas === 'nino'">
          Cada registro corresponde a <strong>un solo niño o niña</strong>. Use «Nuevo» por cada bautizado adicional. En el formulario se le recordará qué datos conviene incluir.
        </template>
        <template v-else>
          Cada registro corresponde a <strong>una sola pareja</strong>. Use «Nuevo» por cada matrimonio adicional. En el formulario se le recordará qué datos conviene incluir.
        </template>
      </p>
      
      <!-- Botón Agregar -->
      <div class="flex justify-end mb-4">
        <button
          @click="abrirModal"
          class="flex items-center gap-2 px-4 py-2 bg-[#3B5998] hover:bg-[#344e86] text-white rounded-lg transition-colors font-medium"
        >
          <Icon icon="mdi:plus" class="w-5 h-5" aria-hidden="true" />
          Nuevo
        </button>
      </div>

      <!-- Lista de Menciones -->
      <div class="space-y-3 mb-6">
        <!-- Sin menciones -->
        <div v-if="store.solicitud.menciones.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
          <Icon icon="mdi:clipboard-text-outline" class="w-12 h-12 mx-auto mb-2 opacity-60" aria-hidden="true" />
          <p>Aún no ha agregado ningún registro</p>
          <p class="text-sm mt-1">Use «Nuevo» para agregar {{ articuloNuevo }}</p>
        </div>

        <!-- Lista -->
        <div 
          v-for="mencion in store.solicitud.menciones" 
          :key="mencion.id"
          class="border border-[#E0D5C5] dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <!-- Header con costo -->
          <div class="bg-gray-50 dark:bg-gray-700/60 px-4 py-2 flex justify-between items-center border-b border-[#E0D5C5] dark:border-gray-700">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ etiquetaLinea }}</span>
            <span class="text-sm font-semibold text-[#4A4A4A] dark:text-gray-200">Costo: S/ {{ mencion.costo.toFixed(2) }}</span>
          </div>
          
          <!-- Contenido -->
          <div class="p-4 flex justify-between items-start gap-3 bg-white dark:bg-gray-800">
            <p class="text-[#4A4A4A] dark:text-gray-200 flex-1 break-words">{{ mencion.descripcion }}</p>
            
            <!-- Acciones -->
            <div class="flex gap-2 shrink-0">
              <button
                @click="editarMencion(mencion)"
                class="p-2 text-[#3B5998] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar"
              >
                <Icon icon="mdi:pencil-outline" class="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                @click="confirmarEliminar(mencion.id)"
                class="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Icon icon="mdi:delete-outline" class="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Separador -->
      <div class="border-t border-[#E0D5C5] dark:border-gray-700 pt-4">
        <!-- Total -->
        <div class="flex justify-end items-center gap-2">
          <span class="text-lg text-[#4A4A4A] dark:text-gray-300">Total:</span>
          <span class="text-2xl font-bold text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ store.totalMenciones.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Mensaje informativo -->
      <div v-if="store.solicitud.menciones.length > 0" class="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 flex items-start gap-2">
        <Icon icon="mdi:information-outline" class="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p class="text-sm text-blue-700 dark:text-blue-300">
          Has agregado <strong>{{ store.solicitud.menciones.length }}</strong> {{ etiquetaLinea.toLowerCase() }}(s).
          El costo se sumará al monto total de la solicitud.
        </p>
      </div>
    </div>

    <!-- Modal Agregar/Editar -->
    <Teleport to="body">
      <div 
        v-if="modalVisible" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="cerrarModal"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50"></div>
        
        <!-- Modal -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-modal">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-serif font-bold text-[#C88A2A] dark:text-[#E5A84A]">
              {{ editando ? `Editar ${etiquetaLinea}` : `Nueva ${etiquetaLinea}` }}
            </h3>
            <button 
              @click="cerrarModal"
              class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <Icon icon="mdi:close" class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <!-- Aviso: un solo niño/a o una sola pareja por registro (evita varios nombres en un campo) -->
          <div
            v-if="modoLineas === 'nino'"
            class="mb-4 rounded-lg border border-amber-200 bg-amber-50/95 dark:border-amber-700/50 dark:bg-amber-950/30 p-3 text-sm text-amber-950 dark:text-amber-100"
            role="note"
          >
            <p class="font-semibold flex items-center gap-1.5">
              <Icon icon="mdi:alert-circle-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
              Un solo bautizado por registro
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-xs sm:text-sm leading-relaxed opacity-95">
              <li>No escriba varios nombres ni varios niños/as en este cuadro. Si debe registrar a más de uno, guarde este registro y use el botón «Nuevo» para cada niño/a adicional.</li>
              <li>Incluya los datos de <strong>esa única persona</strong>, por ejemplo: nombre completo, fecha de nacimiento, nombres de padres y de padrinos/madrinas, u otra información que le haya pedido la parroquia.</li>
            </ul>
          </div>
          <div
            v-else-if="modoLineas === 'pareja'"
            class="mb-4 rounded-lg border border-amber-200 bg-amber-50/95 dark:border-amber-700/50 dark:bg-amber-950/30 p-3 text-sm text-amber-950 dark:text-amber-100"
            role="note"
          >
            <p class="font-semibold flex items-center gap-1.5">
              <Icon icon="mdi:alert-circle-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
              Una sola pareja por registro
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-xs sm:text-sm leading-relaxed opacity-95">
              <li>No agrupe varias parejas en un solo texto. Si hay más de una pareja para la misa, guarde este registro y pulse «Nuevo» por cada pareja adicional.</li>
              <li>Escriba los datos referentes a <strong>esa única pareja</strong>, por ejemplo: nombres completos de ambos contrayentes y cualquier dato que la parroquia haya solicitado.</li>
            </ul>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#4A4A4A] dark:text-gray-300 mb-1">
                {{ etiquetaCampoDatosModal }} <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="nuevaDescripcion"
                rows="4"
                maxlength="200"
                :placeholder="placeholderLineaVal"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C88A2A]/30 focus:border-[#C88A2A] transition-all resize-none bg-white dark:bg-gray-700 text-[#4A4A4A] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                :class="errorDescripcion ? 'border-red-300 dark:border-red-500' : 'border-[#E0D5C5] dark:border-gray-600'"
              ></textarea>
              <div class="flex justify-between items-center mt-1">
                <span v-if="errorDescripcion" class="text-sm text-red-500 dark:text-red-400">{{ errorDescripcion }}</span>
                <span v-else class="text-sm text-gray-400"></span>
                <span class="text-xs text-gray-400 dark:text-gray-500">{{ nuevaDescripcion.length }}/200</span>
              </div>
            </div>

            <!-- Costo -->
            <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-lg p-3 flex justify-between items-center border border-transparent dark:border-amber-700/30">
              <span class="text-[#4A4A4A] dark:text-gray-200">Costo por {{ etiquetaLinea.toLowerCase() }}:</span>
              <span class="font-bold text-[#C88A2A] dark:text-[#E5A84A]">S/ {{ COSTO_UNITARIO.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6">
            <button
              @click="cerrarModal"
              class="flex-1 px-4 py-3 border border-[#BFBFBF] dark:border-gray-600 text-[#4A4A4A] dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              @click="guardarMencion"
              class="flex-1 px-4 py-3 bg-[#C88A2A] hover:bg-[#B6791F] text-white rounded-lg transition-colors font-medium"
            >
              {{ editando ? 'Guardar' : 'Agregar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { type IMencion } from '../../interfaces/solicitud.interface';
import {
  descripcionPasoRegistro,
  etiquetaLineaSingular,
  etiquetaPasoRegistro,
  getModoRegistroLineas,
  placeholderLinea,
} from '../../constants/tipoMisaRegistro';
import { COSTO_MENCION } from '../../interfaces/solicitud.interface';

const store = useSolicitudStore();

const tituloPaso = computed(() =>
  etiquetaPasoRegistro(store.solicitud.idTipoMisa, store.solicitud.nombreTipoMisa),
);
const descripcionPaso = computed(() =>
  descripcionPasoRegistro(store.solicitud.idTipoMisa, store.solicitud.nombreTipoMisa),
);
const etiquetaLinea = computed(() =>
  etiquetaLineaSingular(store.solicitud.idTipoMisa, store.solicitud.nombreTipoMisa),
);
const placeholderLineaVal = computed(() =>
  placeholderLinea(store.solicitud.idTipoMisa, store.solicitud.nombreTipoMisa),
);

const modoLineas = computed(() =>
  getModoRegistroLineas(store.solicitud.idTipoMisa, store.solicitud.nombreTipoMisa),
);

const etiquetaCampoDatosModal = computed(() => {
  if (modoLineas.value === 'nino') return 'Datos del niño/a (una sola persona)';
  if (modoLineas.value === 'pareja') return 'Datos de la pareja (un solo matrimonio)';
  return 'Datos';
});

const COSTO_UNITARIO = computed(() =>
  store.solicitud.costoMencion > 0 ? store.solicitud.costoMencion : COSTO_MENCION,
);

const articuloNuevo = computed(() => {
  const m = getModoRegistroLineas(
    store.solicitud.idTipoMisa,
    store.solicitud.nombreTipoMisa,
  );
  if (m === 'nino') return 'un niño/a';
  if (m === 'pareja') return 'una pareja';
  return 'una mención';
});

// Modal
const modalVisible = ref(false);
const editando = ref(false);
const mencionEditandoId = ref<number | null>(null);
const nuevaDescripcion = ref('');
const errorDescripcion = ref('');

const abrirModal = () => {
  editando.value = false;
  mencionEditandoId.value = null;
  nuevaDescripcion.value = '';
  errorDescripcion.value = '';
  modalVisible.value = true;
};

const editarMencion = (mencion: IMencion) => {
  editando.value = true;
  mencionEditandoId.value = mencion.id;
  nuevaDescripcion.value = mencion.descripcion;
  errorDescripcion.value = '';
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  nuevaDescripcion.value = '';
  errorDescripcion.value = '';
};

const validarDescripcion = (): boolean => {
  if (!nuevaDescripcion.value.trim()) {
    errorDescripcion.value = 'La descripción es requerida';
    return false;
  }
  if (nuevaDescripcion.value.trim().length < 5) {
    errorDescripcion.value = 'Mínimo 5 caracteres';
    return false;
  }
  errorDescripcion.value = '';
  return true;
};

const guardarMencion = () => {
  if (!validarDescripcion()) return;

  if (editando.value && mencionEditandoId.value) {
    store.actualizarMencion(mencionEditandoId.value, nuevaDescripcion.value.trim());
  } else {
    store.agregarMencion(nuevaDescripcion.value.trim());
  }
  
  cerrarModal();
};

const confirmarEliminar = (id: number) => {
  if (confirm(`¿Está seguro de eliminar ${etiquetaLinea.value.toLowerCase()}?`)) {
    store.eliminarMencion(id);
  }
};

defineExpose({
  validate: async () => {
    const modo = getModoRegistroLineas(
      store.solicitud.idTipoMisa,
      store.solicitud.nombreTipoMisa,
    );
    if (modo === 'nino' || modo === 'pareja') {
      if (store.solicitud.menciones.length < 1) {
        alert(`Debe registrar al menos ${articuloNuevo.value}`);
        return false;
      }
    }
    return true;
  },
});
</script>

<style scoped>
.animate-modal {
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
