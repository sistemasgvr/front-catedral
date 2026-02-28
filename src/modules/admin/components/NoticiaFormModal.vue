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
        @click.self="cerrar"
      >
        <!-- Backdrop -->
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
              class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[99999]"
              @click.stop
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {{ isEditing ? 'Editar Noticia' : 'Nueva Noticia' }}
                </h2>
                <button
                  @click="cerrar"
                  class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <!-- Título -->
                <InputText
                  v-model="form.titulo"
                  name = ""
                  label="Título *"
                  placeholder="Ingresa el título de la noticia"
                  :error="errores.titulo"
                />

                <!-- Contenido -->
                <InputTextarea
                  v-model="form.contenido"
                  name = "contenido"
                  label="Contenido *"
                  placeholder="Escribe el contenido del anuncio..."
                  :rows="4"
                  :error="errores.contenido"
                />

                <!-- Fechas -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputDate
                    v-model="form.fecha_publicacion"
                    name ="fecha_publicacion"
                    label="Fecha de publicación *"
                    :error="errores.fecha_publicacion"
                  />
                  <InputDate
                    v-model="form.fecha_evento"
                    name="fecha_evento"
                    label="Fecha del evento (opcional)"
                  />
                </div>

                <!-- Destacada -->
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="form.destacada = !form.destacada"
                    :class="form.destacada
                      ? 'bg-[#C88A2A] border-[#C88A2A]'
                      : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'"
                    class="relative w-11 h-6 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C88A2A] focus:ring-offset-2"
                  >
                    <span
                      :class="form.destacada ? 'translate-x-5' : 'translate-x-0'"
                      class="inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"
                    />
                  </button>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" @click="form.destacada = !form.destacada">
                    Marcar como destacada
                  </label>
                </div>

                <!-- Imagen -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Imagen (opcional)
                  </label>

                  <!-- Preview imagen actual -->
                  <div v-if="previewUrl || form.imagen" class="mb-3 relative inline-block">
                    <img
                      :src="previewUrl || form.imagen || ''"
                      alt="Preview"
                      class="h-32 w-auto rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      @click="quitarImagen"
                      class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Input URL imagen o subir archivo -->
                  <div class="space-y-2">
                    <div class="flex gap-2">
                      <input
                        v-model="urlManual"
                        type="url"
                        placeholder="https://... (URL de imagen)"
                        class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        @input="aplicarUrlManual"
                      />
                    </div>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      Ingresa la URL de la imagen que deseas mostrar.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="cerrar"
                  :disabled="loading"
                  class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  @click="guardar"
                  :disabled="loading"
                  class="flex-1 px-4 py-2.5 bg-[#C88A2A] hover:bg-[#B6791F] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Noticia') }}
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
import { ref, watch, computed } from 'vue';
import InputText from '@/components/inputs/InputText.vue';
import InputTextarea from '@/components/inputs/InputTextarea.vue';
import InputDate from '@/components/inputs/InputDate.vue';

import type { INoticia, INoticiaForm } from '@/interfaces/noticia.interface';

interface Props {
  isOpen: boolean;
  noticia?: INoticia | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  noticia: null,
  loading: false,
});

const emit = defineEmits<{
  close: [];
  save: [form: INoticiaForm];
}>();

const isEditing = computed(() => !!props.noticia);

const formInicial = (): INoticiaForm => ({
  titulo: '',
  contenido: '',
  imagen: null,
  fecha_publicacion: new Date().toISOString().split('T')[0]!,
  fecha_evento: '',
  destacada: false,
});

const form = ref<INoticiaForm>(formInicial());
const errores = ref<Partial<Record<keyof INoticiaForm, string>>>({});
const previewUrl = ref<string | null>(null);
const urlManual = ref('');

// Rellenar form cuando se abre en modo edición
watch(
  () => [props.isOpen, props.noticia],
  () => {
    if (props.isOpen) {
      if (props.noticia) {
        form.value = {
          titulo: props.noticia.titulo,
          contenido: props.noticia.contenido,
          imagen: props.noticia.imagen ?? null,
          fecha_publicacion: props.noticia.fecha_publicacion,
          fecha_evento: props.noticia.fecha_evento ?? null,
          destacada: props.noticia.destacada,
        };
        urlManual.value = props.noticia.imagen ?? '';
        previewUrl.value = null;
      } else {
        form.value = formInicial();
        previewUrl.value = null;
        urlManual.value = '';
      }
      errores.value = {};
    }
  },
  { immediate: true }
);

const aplicarUrlManual = () => {
  const url = urlManual.value.trim();
  if (url) {
    form.value.imagen = url;
    previewUrl.value = url;
  } else {
    form.value.imagen = null;
    previewUrl.value = null;
  }
};

const quitarImagen = () => {
  form.value.imagen = null;
  previewUrl.value = null;
  urlManual.value = '';
};

const validar = (): boolean => {
  errores.value = {};
  if (!form.value.titulo.trim()) errores.value.titulo = 'El título es obligatorio';
  if (!form.value.contenido.trim()) errores.value.contenido = 'El contenido es obligatorio';
  if (!form.value.fecha_publicacion) errores.value.fecha_publicacion = 'La fecha de publicación es obligatoria';
  return Object.keys(errores.value).length === 0;
};

const guardar = () => {
  if (!validar()) return;
  emit('save', { ...form.value });
};

const cerrar = () => {
  if (!props.loading) emit('close');
};
</script>