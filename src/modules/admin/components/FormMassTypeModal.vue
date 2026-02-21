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
        @click.self="handleClose"
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
              class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[100000]"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ modoEdicion ? 'Editar Tipo de Misa' : 'Nuevo Tipo de Misa' }}
                </h2>
                <button
                  @click="handleClose"
                  class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    required
                    placeholder="Ej: Misa Funeral, Misa de Boda..."
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Precio -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio (S/) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      S/
                    </span>
                    <input
                      v-model.number="form.precio"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Ingrese el precio de la misa
                  </p>
                </div>

                <!-- Validation Error -->
                <div v-if="validationError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="handleClose"
                    :disabled="guardando"
                    class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="guardando"
                    class="flex-1 px-4 py-2.5 bg-[#C88A2A] hover:bg-[#B6791F] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <div v-if="guardando" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { crearTipoMisa, actualizarTipoMisa, obtenerTipoMisa } from '../actions/tipoMisa.action';

interface Props {
  isOpen: boolean;
  tipoMisaId?: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const guardando = ref(false);
const validationError = ref<string | null>(null);

const modoEdicion = computed(() => !!props.tipoMisaId);

const form = ref({
  nombre: '',
  precio: 0,
});

const resetForm = () => {
  form.value = {
    nombre: '',
    precio: 0,
  };
  validationError.value = null;
};

const cargarTipoMisa = async () => {
  if (!props.tipoMisaId) return;

  try {
    const tipoMisa = await obtenerTipoMisa(props.tipoMisaId);
    form.value = {
      nombre: tipoMisa.nombre,
      precio: tipoMisa.precio,
    };
  } catch (error) {
    console.error('Error cargando tipo de misa:', error);
    validationError.value = 'Error al cargar los datos';
  }
};

const validarFormulario = (): boolean => {
  validationError.value = null;

  if (!form.value.nombre.trim()) {
    validationError.value = 'El nombre es requerido';
    return false;
  }

  if (form.value.nombre.trim().length < 3) {
    validationError.value = 'El nombre debe tener al menos 3 caracteres';
    return false;
  }

  if (form.value.precio <= 0) {
    validationError.value = 'El precio debe ser mayor a 0';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;

  guardando.value = true;
  try {
    if (modoEdicion.value && props.tipoMisaId) {
      await actualizarTipoMisa(props.tipoMisaId, form.value);
    } else {
      await crearTipoMisa(form.value);
    }
    
    emit('saved');
    handleClose();
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : 'Error al guardar';
    console.error('Error guardando tipo de misa:', error);
  } finally {
    guardando.value = false;
  }
};

const handleClose = () => {
  if (!guardando.value) {
    resetForm();
    emit('close');
  }
};

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      if (modoEdicion.value) {
        await cargarTipoMisa();
      } else {
        resetForm();
      }
    }
  }
);
</script>