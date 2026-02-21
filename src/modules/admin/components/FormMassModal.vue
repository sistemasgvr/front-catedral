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
              class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[100000]"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ modoEdicion ? 'Editar Misa' : 'Nueva Misa' }}
                </h2>
                <button
                  @click="handleClose"
                  class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                <!-- Tipo de Misa -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Misa <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.idtipomisa"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option value="">Seleccione un tipo de misa</option>
                    <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                      {{ tipo.nombre }} - S/ {{ Number(tipo.precio).toFixed(2) }}
                    </option>
                  </select>
                </div>

                <!-- Título -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.titulo"
                    type="text"
                    required
                    placeholder="Ej: Misa Dominical, Misa de Difuntos..."
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Fecha de Celebración -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Celebración <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.fechacelebracion"
                    type="date"
                    required
                    :min="minFecha"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Horarios -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Inicio <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.horainicio"
                      type="time"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Fin <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.horafin"
                      type="time"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <!-- Estado -->
                <div class="flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="form.estado" 
                      type="checkbox" 
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C88A2A]/20 dark:peer-focus:ring-[#C88A2A]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#C88A2A]"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-white">
                      {{ form.estado ? 'Misa Activa' : 'Misa Inactiva' }}
                    </span>
                  </label>
                </div>

                <!-- Validation Error -->
                <div v-if="validationError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
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
                    {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Misa') }}
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
import { crearMisa, actualizarMisa, obtenerDetalleMisa } from '../actions/crudMisa.action';
import { listarTiposMisa } from '../actions/tipoMisa.action';
import type { ICrearMisaForm, IEditarMisaForm } from '../interfaces/misa.interface';
import type { ITipoMisa } from '../interfaces/tipoMisa.interface';

interface Props {
  isOpen: boolean;
  misaId?: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const tiposMisa = ref<ITipoMisa[]>([]);
const guardando = ref(false);
const validationError = ref<string | null>(null);

const modoEdicion = computed(() => !!props.misaId);

const form = ref<ICrearMisaForm>({
  idtipomisa: 0,
  titulo: '',
  fechacelebracion: '',
  horainicio: '',
  horafin: '',
  estado: true,
});

const minFecha = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const resetForm = () => {
  form.value = {
    idtipomisa: 0,
    titulo: '',
    fechacelebracion: '',
    horainicio: '',
    horafin: '',
    estado: true,
  };
  validationError.value = null;
};

const cargarTiposMisa = async () => {
  try {
    tiposMisa.value = await listarTiposMisa();
  } catch (error) {
    console.error('Error cargando tipos de misa:', error);
  }
};

const cargarMisa = async () => {
  if (!props.misaId) return;

  try {
    const misa = await obtenerDetalleMisa(props.misaId);
    form.value = {
      idtipomisa: misa.idtipomisa,
      titulo: misa.titulo || '',
      fechacelebracion: misa.fechacelebracion,
      horainicio: misa.horainicio,
      horafin: misa.horafin,
      estado: misa.estado,
    };
  } catch (error) {
    console.error('Error cargando misa:', error);
  }
};

const validarFormulario = (): boolean => {
  validationError.value = null;

  if (!form.value.idtipomisa) {
    validationError.value = 'Debe seleccionar un tipo de misa';
    return false;
  }

  if (!form.value.titulo.trim()) {
    validationError.value = 'El título es requerido';
    return false;
  }

  if (!form.value.fechacelebracion) {
    validationError.value = 'La fecha de celebración es requerida';
    return false;
  }

  if (!form.value.horainicio || !form.value.horafin) {
    validationError.value = 'Debe especificar el horario de inicio y fin';
    return false;
  }

  if (form.value.horainicio >= form.value.horafin) {
    validationError.value = 'La hora de fin debe ser posterior a la hora de inicio';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;

  guardando.value = true;
  try {
    if (modoEdicion.value && props.misaId) {
      const dataEditar: IEditarMisaForm = {
        idmisa: props.misaId,
        ...form.value,
      };
      await actualizarMisa(dataEditar);
    } else {
      await crearMisa(form.value);
    }
    
    emit('saved');
    handleClose();
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : 'Error al guardar la misa';
    console.error('Error guardando misa:', error);
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
      await cargarTiposMisa();
      if (modoEdicion.value) {
        await cargarMisa();
      } else {
        resetForm();
      }
    }
  }
);
</script>