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
                <Icon icon="mdi:plus" class="w-5 h-5 shrink-0" aria-hidden="true" />
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
              <Icon icon="mdi:alert-outline" class="w-12 h-12 mx-auto text-red-300 mb-3" aria-hidden="true" />
              <p class="text-red-500 font-medium">Error al cargar noticias</p>
              <button @click="() => refetch()" class="mt-3 text-sm text-[#C88A2A] hover:underline">
                Reintentar
              </button>
            </div>

            <!-- Vacío -->
            <div v-else-if="noticiasFiltradas.length === 0" class="p-12 text-center">
              <Icon icon="mdi:newspaper-variant-outline" class="w-16 h-16 mx-auto text-gray-300 mb-3" aria-hidden="true" />
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
                  <Icon icon="mdi:refresh" class="w-3 h-3 shrink-0" aria-hidden="true" />
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
        <Icon v-if="toast.tipo === 'success'" icon="mdi:check-circle-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
        <Icon v-else icon="mdi:alert-circle-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
        {{ toast.mensaje }}
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
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