<template>
  <div class="step-content">
    <div class="bg-white rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] mb-2 text-center">
        Menciones
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] rounded mx-auto mb-6"></div>

      <!-- Descripción -->
       <p class="text-sm text-[#7A7A7A] text-center mb-6">
        Agregue las menciones que desea incluir en la misa. Cada mención tiene un costo de 
        <span class="font-semibold text-[#C88A2A]">S/ {{ COSTO_MENCION.toFixed(2) }}</span>
      </p>
      
      <!-- Botón Agregar -->
      <div class="flex justify-end mb-4">
        <button
          @click="abrirModal"
          class="flex items-center gap-2 px-4 py-2 bg-[#3B5998] hover:bg-[#344e86] text-white rounded-lg transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo
        </button>
      </div>

      <!-- Lista de Menciones -->
      <div class="space-y-3 mb-6">
        <!-- Sin menciones -->
        <div v-if="store.solicitud.menciones.length === 0" class="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No hay menciones agregadas</p>
          <p class="text-sm mt-1">Haga clic en "+ Nuevo" para agregar una</p>
        </div>

        <!-- Lista -->
        <div 
          v-for="mencion in store.solicitud.menciones" 
          :key="mencion.id"
          class="border border-[#E0D5C5] rounded-lg overflow-hidden"
        >
          <!-- Header con costo -->
          <div class="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-[#E0D5C5]">
            <span class="text-xs text-gray-500">Mención</span>
            <span class="text-sm font-semibold text-[#4A4A4A]">Costo: S/ {{ mencion.costo }}</span>
          </div>
          
          <!-- Contenido -->
          <div class="p-4 flex justify-between items-start gap-3">
            <p class="text-[#4A4A4A] flex-1 break-words">{{ mencion.descripcion }}</p>
            
            <!-- Acciones -->
            <div class="flex gap-2 shrink-0">
              <button
                @click="editarMencion(mencion)"
                class="p-2 text-[#3B5998] hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmarEliminar(mencion.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Separador -->
      <div class="border-t border-[#E0D5C5] pt-4">
        <!-- Total -->
        <div class="flex justify-end items-center gap-2">
          <span class="text-lg text-[#4A4A4A]">Total:</span>
          <span class="text-2xl font-bold text-[#C88A2A]">S/ {{ store.totalMenciones.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Mensaje informativo -->
      <div v-if="store.solicitud.menciones.length > 0" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <svg class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-blue-700">
          Has agregado <strong>{{ store.solicitud.menciones.length }}</strong> mención(es). 
          El costo de las menciones se sumará al monto total de la solicitud.
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
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-modal">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-serif font-bold text-[#C88A2A]">
              {{ editando ? 'Editar Mención' : 'Nueva Mención' }}
            </h3>
            <button 
              @click="cerrarModal"
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#4A4A4A] mb-1">
                Descripción <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="nuevaDescripcion"
                rows="4"
                maxlength="200"
                placeholder="Ej: En memoria de Juan Pérez, Por la salud de María..."
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C88A2A]/30 focus:border-[#C88A2A] transition-all resize-none"
                :class="errorDescripcion ? 'border-red-300' : 'border-[#E0D5C5]'"
              ></textarea>
              <div class="flex justify-between items-center mt-1">
                <span v-if="errorDescripcion" class="text-sm text-red-500">{{ errorDescripcion }}</span>
                <span v-else class="text-sm text-gray-400"></span>
                <span class="text-xs text-gray-400">{{ nuevaDescripcion.length }}/200</span>
              </div>
            </div>

            <!-- Costo -->
            <div class="bg-[#FFF5E6] rounded-lg p-3 flex justify-between items-center">
              <span class="text-[#4A4A4A]">Costo de la mención:</span>
              <span class="font-bold text-[#C88A2A]">S/ {{ COSTO_MENCION.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6">
            <button
              @click="cerrarModal"
              class="flex-1 px-4 py-3 border border-[#BFBFBF] text-[#4A4A4A] rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
import { useSolicitudStore } from '../../stores/solicitud.store';
import { type IMencion } from '../../interfaces/solicitud.interface';

const store = useSolicitudStore();

const COSTO_MENCION = computed(() => store.solicitud.costoMencion || 0);

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
  if (confirm('¿Está seguro de eliminar esta mención?')) {
    store.eliminarMencion(id);
  }
};

// Exponer método de validación para el wizard
defineExpose({
  validate: async () => {
    // Las menciones son opcionales, siempre válido
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
