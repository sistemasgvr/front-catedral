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
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-all"></div>

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

              <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Misa <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.idtipomisa"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all"
                  >
                    <option value="0">Seleccione un tipo de misa</option>
                    <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                      {{ tipo.nombre }} - S/ {{ Number(tipo.precio).toFixed(2) }}
                    </option>
                  </select>
                </div>

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

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Celebración <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.fechacelebracion"
                    type="date"
                    required
                    :min="minFecha"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora de Inicio <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.horainicio"
                      type="time"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
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
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>

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

                <div v-if="validationError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
                </div>

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

    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toast.visible" 
           class="fixed bottom-5 right-5 z-[100001] flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow-2xl dark:text-gray-400 dark:bg-gray-800 border-l-4"
           :class="toast.tipo === 'success' ? 'border-green-500' : 'border-red-500'">
        
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
             :class="toast.tipo === 'success' ? 'text-green-500 bg-green-100 dark:bg-green-800/30' : 'text-red-500 bg-red-100 dark:bg-red-800/30'">
          <svg v-if="toast.tipo === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>
        </div>
        <div class="ms-3 text-sm font-medium text-gray-900 dark:text-white">{{ toast.mensaje }}</div>
        <button @click="toast.visible = false" class="ms-auto bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 dark:hover:text-white">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { crearMisa, actualizarMisa, obtenerDetalleMisa } from '../actions/crudMisa.action';
import { listarTiposMisa } from '../actions/tipoMisa.action';
import type { ICrearMisaForm } from '../interfaces/misa.interface';
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

// --- ESTADO ---
const tiposMisa = ref<ITipoMisa[]>([]);
const guardando = ref(false);
const validationError = ref<string | null>(null);
const toast = ref({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });
let toastTimer: ReturnType<typeof setTimeout>;

const modoEdicion = computed(() => !!props.misaId);

const form = ref<ICrearMisaForm>({
  idtipomisa: 0,
  titulo: '',
  fechacelebracion: '',
  horainicio: '',
  horafin: '',
  estado: true,
});

const minFecha = computed(() => new Date().toISOString().split('T')[0]);

// --- MÉTODOS ---
const mostrarToast = (mensaje: string, tipo: 'success' | 'error') => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { visible: true, mensaje, tipo };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, 3500);
};

const resetForm = () => {
  form.value = { idtipomisa: 0, titulo: '', fechacelebracion: '', horainicio: '', horafin: '', estado: true };
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
  if (!form.value.idtipomisa) { validationError.value = 'Debe seleccionar un tipo de misa'; return false; }
  if (!form.value.titulo.trim()) { validationError.value = 'El título es requerido'; return false; }
  if (!form.value.fechacelebracion) { validationError.value = 'La fecha de celebración es requerida'; return false; }
  if (!form.value.horainicio || !form.value.horafin) { validationError.value = 'Debe especificar el horario'; return false; }
  if (form.value.horainicio >= form.value.horafin) { validationError.value = 'La hora de fin debe ser posterior'; return false; }
  return true;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;
  guardando.value = true;
  
  try {
    if (modoEdicion.value && props.misaId) {
      await actualizarMisa({ idmisa: props.misaId, ...form.value });
      mostrarToast('Misa actualizada correctamente', 'success');
    } else {
      await crearMisa(form.value);
      mostrarToast('Misa creada con éxito', 'success');
    }

    // 1. Notificamos al padre que se guardó (para que refresque la lista)
    emit('saved'); 
    
    // 2. IMPORTANTE: Forzamos el cierre manual llamando al emit de close directamente
    // o asegurándonos de que handleClose no tenga bloqueos.
    emit('close'); 
    
    // 3. Limpiamos el formulario después de emitir
    resetForm();

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al guardar';
    mostrarToast(msg, 'error');
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

// --- WATCHERS Y LIFECYCLE ---
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await cargarTiposMisa();
    if (modoEdicion.value) await cargarMisa();
    else resetForm();
  }
});

onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer); });
</script>