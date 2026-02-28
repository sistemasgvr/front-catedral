<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col">
      <main class="flex-1 px-4 py-6">
        <div class="w-full max-w-7xl mx-auto space-y-6">

          <!-- ── Header ── -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                  Gestión de Noticias
                </h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                  Administra anuncios y eventos de la catedral
                </p>
              </div>
              <button @click="abrirModalCrear"
                class="w-full sm:w-auto px-6 py-3 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] transition-all flex items-center justify-center gap-2 shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Noticia
              </button>
            </div>
          </div>

          <!-- ── Filtros ── -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputText v-model="filtros.busqueda" name="busqueda" placeholder="Buscar por título o contenido..."
                label="Buscar" />
              <InputSelect v-model="filtros.destacada" name="destacada" label="Destacada" :options="[
                { id: 1, nombre: 'Sí' },
                { id: 0, nombre: 'No' }
              ]" />

              <InputSelect v-model="filtros.tieneEvento" name="tieneEvento" label="Con evento" :options="[
                { id: 1, nombre: 'Con evento' },
                { id: 0, nombre: 'Sin evento' }
              ]" />
              <InputSelect v-model="filtros.orden" name="orden" label="Orden" :options="[
                { id: 1, nombre: 'Más recientes' },
                { id: 0, nombre: 'Más antiguas' }
              ]" />
            </div>
          </div>

          <!-- ── Tabla ── -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">

            <!-- Loading -->
            <div v-if="isLoading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#C88A2A]">
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-3 text-sm">Cargando noticias...</p>
            </div>

            <!-- Error -->
            <div v-else-if="isError" class="p-12 text-center">
              <svg class="w-12 h-12 mx-auto text-red-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-red-500 font-medium">Error al cargar noticias</p>
              <button @click="() => refetch()" class="mt-3 text-sm text-[#C88A2A] hover:underline">
                Reintentar
              </button>
            </div>

            <!-- Vacío -->
            <div v-else-if="noticiasFiltradas.length === 0" class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">No se encontraron noticias</p>
              <p v-if="filtros.busqueda" class="text-sm text-gray-400 mt-1">
                Intenta con otros términos de búsqueda
              </p>
            </div>

            <!-- Tabla con datos -->
            <div v-else class="overflow-x-auto">
              <!-- Stats header -->
              <div
                class="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {{ noticiasFiltradas.length }} {{ noticiasFiltradas.length === 1 ? 'noticia' : 'noticias' }}
                  <span v-if="filtros.busqueda"> encontradas para "{{ filtros.busqueda }}"</span>
                </span>
                <button @click="() => refetch()" class="text-xs text-[#C88A2A] hover:underline flex items-center gap-1"
                  title="Actualizar">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </button>
              </div>

              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Noticia
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Publicación
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Evento
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Destacada
                    </th>
                    <th
                      class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <NoticiaTableRow v-for="noticia in noticiasFiltradas" :key="noticia.idnoticia" :noticia="noticia"
                    @editar="abrirModalEditar" @eliminar="solicitarEliminar" @ver-imagen="abrirImagenModal" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ── Modal Crear/Editar ── -->
    <NoticiaFormModal :is-open="modalFormAbierto" :noticia="noticiaSeleccionada" :loading="mutacionGuardando"
      @close="cerrarModalForm" @save="onGuardar" />

    <!-- ── Modal Confirmar Eliminar ── -->
    <ConfirmModal :is-open="modalEliminarAbierto" title="Eliminar Noticia"
      message="¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer."
      confirm-text="Sí, eliminar" loading-text="Eliminando..." :loading="mutacionEliminando" type="danger"
      @confirm="onEliminar" @cancel="cerrarModalEliminar" />

    <!-- ── Modal Imagen Ampliada ── -->
    <NoticiaImageModal :is-open="imagenModalAbierto" :src="imagenModalSrc" @close="imagenModalAbierto = false" />

    <!-- ── Toast ── -->
    <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
      <div v-if="toast.visible" :class="toast.tipo === 'success'
        ? 'bg-green-600'
        : 'bg-red-600'"
        class="fixed bottom-6 right-6 z-[200000] px-5 py-3 rounded-xl text-white shadow-2xl flex items-center gap-3 text-sm font-medium">
        <svg v-if="toast.tipo === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ toast.mensaje }}
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import InputText from '@/components/inputs/InputText.vue';
import InputSelect from '@/components/inputs/InputSelect.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import NoticiaFormModal from '../components/NoticiaFormModal.vue';
import NoticiaTableRow from '../components/NoticiaTableRow.vue';
import NoticiaImageModal from '@/components/NoticiaImageModal.vue';
import { useNoticiasQuery, useCrearNoticia, useActualizarNoticia, useEliminarNoticia } from '@/composables/useNoticias';

import type { INoticia, INoticiaForm } from '@/interfaces/noticia.interface';

// ── TanStack Query ──
const { data: noticias, isLoading, isError, refetch } = useNoticiasQuery();
const mutCrear = useCrearNoticia();
const mutActualizar = useActualizarNoticia();
const mutEliminar = useEliminarNoticia();

const mutacionGuardando = computed(() => mutCrear.isPending.value || mutActualizar.isPending.value);
const mutacionEliminando = computed(() => mutEliminar.isPending.value);

// ── Filtros ──
const filtros = ref({
  busqueda: '',
  destacada: null as number | null,
  tieneEvento: null as number | null,
  orden: 1 as 1 | 0,
});

const noticiasFiltradas = computed(() => {
  let lista = [...(noticias.value ?? [])];

  //  Búsqueda
  if (filtros.value.busqueda.trim()) {
    const q = filtros.value.busqueda.toLowerCase();
    lista = lista.filter(
      n =>
        n.titulo.toLowerCase().includes(q) ||
        n.contenido.toLowerCase().includes(q)
    );
  }

  //  Destacada (1 = true, 0 = false)
  if (filtros.value.destacada !== null) {
    const valor = Boolean(filtros.value.destacada);
    lista = lista.filter(n => n.destacada === valor);
  }

  // Tiene evento (1 = true, 0 = false)
  if (filtros.value.tieneEvento !== null) {
    const valor = Boolean(filtros.value.tieneEvento);
    lista = lista.filter(n => Boolean(n.fecha_evento) === valor);
  }

  // Orden
  lista.sort((a, b) => {
    const da = new Date(a.fecha_publicacion).getTime();
    const db = new Date(b.fecha_publicacion).getTime();
    return filtros.value.orden === 1 ? db - da : da - db;
  });

  return lista;
});

// ── Modal Form ──
const modalFormAbierto = ref(false);
const noticiaSeleccionada = ref<INoticia | null>(null);

const abrirModalCrear = () => {
  noticiaSeleccionada.value = null;
  modalFormAbierto.value = true;
};

const abrirModalEditar = (noticia: INoticia) => {
  noticiaSeleccionada.value = noticia;
  modalFormAbierto.value = true;
};

const cerrarModalForm = () => {
  modalFormAbierto.value = false;
  noticiaSeleccionada.value = null;
};

const onGuardar = async (form: INoticiaForm) => {
  try {
    if (noticiaSeleccionada.value) {
      await mutActualizar.mutateAsync({ id: noticiaSeleccionada.value.idnoticia, form });
      mostrarToast('Noticia actualizada correctamente', 'success');
    } else {
      await mutCrear.mutateAsync(form);
      mostrarToast('Noticia creada correctamente', 'success');
    }
    cerrarModalForm();
  } catch (e: any) {
    mostrarToast(e?.message || 'Error al guardar', 'error');
  }
};

// ── Modal Eliminar ──
const modalEliminarAbierto = ref(false);
const idAEliminar = ref<number | null>(null);

const solicitarEliminar = (id: number) => {
  idAEliminar.value = id;
  modalEliminarAbierto.value = true;
};

const cerrarModalEliminar = () => {
  modalEliminarAbierto.value = false;
  idAEliminar.value = null;
};

const onEliminar = async () => {
  if (!idAEliminar.value) return;
  try {
    await mutEliminar.mutateAsync(idAEliminar.value);
    mostrarToast('Noticia eliminada correctamente', 'success');
    cerrarModalEliminar();
  } catch (e: any) {
    mostrarToast(e?.message || 'Error al eliminar', 'error');
  }
};

// ── Modal Imagen ──
const imagenModalAbierto = ref(false);
const imagenModalSrc = ref<string | null>(null);

const abrirImagenModal = (url: string) => {
  imagenModalSrc.value = url;
  imagenModalAbierto.value = true;
};

// ── Toast ──
const toast = ref({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });
let toastTimer: ReturnType<typeof setTimeout>;

const mostrarToast = (mensaje: string, tipo: 'success' | 'error') => {
  clearTimeout(toastTimer);
  toast.value = { visible: true, mensaje, tipo };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, 3500);
};
</script>