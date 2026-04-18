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
              class="relative w-full rounded-xl shadow-2xl z-[100000] bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto"
              :class="mostrarBloqueCelebrantes ? 'max-w-4xl' : 'max-w-2xl'"
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
                  <Icon icon="mdi:close" class="w-6 h-6" aria-hidden="true" />
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

                <!-- Bautizo / Matrimonio: niños/as o parejas (crear o editar; varios celebrantes por misa) -->
                <template v-if="mostrarBloqueCelebrantes">
                  <p
                    v-if="modoEdicion"
                    class="rounded-md border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-100"
                  >
                    Puede editar cada registro, agregar nuevos celebrantes o quitar los que ya no correspondan. Los cambios se guardan al pulsar «Actualizar».
                  </p>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Horario (lista) <span class="text-red-500">*</span>
                    </label>
                    <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      Debe coincidir con el horario de la misa (vinculación con solicitud en sistema).
                    </p>
                    <select
                      v-model.number="idHorarioLista"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    >
                      <option :value="0">Seleccione horario…</option>
                      <option v-for="h in opcionesHorario" :key="h.id" :value="Number(h.id)">{{ h.nombre }}</option>
                    </select>
                  </div>

                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                    <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ etiquetaCelebrantes }}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ descripcionCelebrantes }}</p>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-lg bg-[#3B5998] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#344e86]"
                        @click="agregarLineaCelebrante"
                      >
                        <Icon icon="mdi:plus" class="h-4 w-4" aria-hidden="true" />
                        Agregar
                      </button>
                    </div>
                    <div
                      v-if="modoRegistroLineas === 'nino'"
                      class="mb-3 rounded-lg border border-amber-200 bg-amber-50/95 p-3 text-sm text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100"
                      role="note"
                    >
                      <p class="font-semibold flex items-center gap-1.5">
                        <Icon icon="mdi:alert-circle-outline" class="h-4 w-4 shrink-0" aria-hidden="true" />
                        Un solo bautizado por fila
                      </p>
                      <ul class="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed opacity-95">
                        <li>No registre varios niños/as en un mismo cuadro. Use «Agregar» para cada persona adicional.</li>
                        <li>En cada fila indique los datos de <strong>una sola persona</strong> (nombre completo, fecha de nacimiento, padres, padrinos/madrinas, etc.).</li>
                      </ul>
                    </div>
                    <div
                      v-else-if="modoRegistroLineas === 'pareja'"
                      class="mb-3 rounded-lg border border-amber-200 bg-amber-50/95 p-3 text-sm text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-100"
                      role="note"
                    >
                      <p class="font-semibold flex items-center gap-1.5">
                        <Icon icon="mdi:alert-circle-outline" class="h-4 w-4 shrink-0" aria-hidden="true" />
                        Una sola pareja por fila
                      </p>
                      <ul class="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed opacity-95">
                        <li>No agrupe varias parejas en un solo texto. Use «Agregar» por cada matrimonio adicional.</li>
                        <li>En cada fila consigne los datos de <strong>esa única pareja</strong> (nombres de ambos contrayentes y lo que corresponda).</li>
                      </ul>
                    </div>
                    <p class="mb-3 text-xs text-amber-800 dark:text-amber-200/90">
                      Cada ítem válido (mín. 5 caracteres): S/ {{ precioTipoSeleccionado.toFixed(2) }} — total estimado: S/
                      {{ (precioTipoSeleccionado * lineasCelebrantesValidasCount).toFixed(2) }}
                    </p>
                    <div class="space-y-3">
                      <div
                        v-for="(linea, idx) in lineasCelebrantes"
                        :key="linea.idmencion ?? `nueva-${idx}`"
                        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-900/40"
                      >
                        <div class="mb-1 flex items-center justify-between">
                          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {{ etiquetaLineaSingularComputed }} {{ idx + 1 }}
                            <span v-if="modoRegistroLineas === 'nino'" class="block font-normal text-gray-500 dark:text-gray-400 sm:inline sm:ml-1">
                              — una sola persona en este campo
                            </span>
                            <span v-else-if="modoRegistroLineas === 'pareja'" class="block font-normal text-gray-500 dark:text-gray-400 sm:inline sm:ml-1">
                              — una sola pareja en este campo
                            </span>
                          </span>
                          <button
                            v-if="lineasCelebrantes.length > 1"
                            type="button"
                            class="text-xs text-red-600 hover:underline dark:text-red-400"
                            @click="quitarLineaCelebrante(idx)"
                          >
                            Quitar
                          </button>
                        </div>
                        <textarea
                          v-model="linea.descripcion"
                          rows="3"
                          :placeholder="placeholderCelebrante"
                          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </template>

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
          <Icon v-if="toast.tipo === 'success'" icon="mdi:check-circle" class="w-5 h-5" aria-hidden="true" />
          <Icon v-else icon="mdi:alert-circle" class="w-5 h-5" aria-hidden="true" />
        </div>
        <div class="ms-3 text-sm font-medium text-gray-900 dark:text-white">{{ toast.mensaje }}</div>
        <button @click="toast.visible = false" class="ms-auto bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 dark:hover:text-white">
          <Icon icon="mdi:close" class="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { crearMisa, actualizarMisa, obtenerDetalleMisa } from '../actions/crudMisa.action';
import { listarTiposMisa } from '../actions/tipoMisa.action';
import { registrarMisaAdminConSolicitud } from '../actions/registrarMisaAdminConSolicitud.action';
import {
  sincronizarCelebrantesMisaEnEdicion,
  type LineaCelebranteEdicion,
} from '../actions/sincronizarCelebrantesMisaEnEdicion.action';
import { getOpcionesLista } from '../actions/getOpcionesLista.action';
import { mapOpcionToSelect, type ISelectOption } from '../interfaces/opcionLista.interface';
import type { ICrearMisaForm } from '../interfaces/misa.interface';
import type { ITipoMisa } from '../interfaces/tipoMisa.interface';
import {
  descripcionPasoRegistro,
  etiquetaLineaSingular,
  etiquetaPasoRegistro,
  getModoRegistroLineas,
  placeholderLinea,
} from '../../request/constants/tipoMisaRegistro';
import { VOUCHER_PAGO_EFECTIVO_MARKER } from '../../request/constants/pagoSolicitud';
import { ID_ESTADO_SOLICITUD_APROBADA } from '../constants/solicitudEstadoProceso';

interface Props {
  isOpen: boolean;
  misaId?: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

function emptyLineaCelebrante(): LineaCelebranteEdicion {
  return { idmencion: null, idmencionmisa: null, descripcion: '' };
}

function clonarLineasCelebrantes(src: LineaCelebranteEdicion[]): LineaCelebranteEdicion[] {
  return src.map((l) => ({ ...l }));
}

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

/** Solo para generar solicitud mínima en BD (no se muestra al usuario). */
const opcionesTipoDocumento = ref<ISelectOption[]>([]);
const opcionesHorario = ref<ISelectOption[]>([]);
const idHorarioLista = ref(0);

/** Filas de celebrantes (crear o editar); ids vienen del detalle al editar. */
const lineasCelebrantes = ref<LineaCelebranteEdicion[]>([emptyLineaCelebrante()]);
/** Solicitud asociada a las menciones cargadas (si existe). */
const idsolicitudRef = ref<number | null>(null);
/** Copia al abrir / tras guardar, para diff al sincronizar. */
const snapshotCelebrantes = ref<LineaCelebranteEdicion[]>([]);

const tipoSeleccionado = computed(() =>
  tiposMisa.value.find((t) => t.idtipomisa === form.value.idtipomisa),
);

const modoRegistroLineas = computed(() =>
  getModoRegistroLineas(form.value.idtipomisa, tipoSeleccionado.value?.nombre),
);

const requiereDatosCelebrantes = computed(
  () => modoRegistroLineas.value === 'nino' || modoRegistroLineas.value === 'pareja',
);

const mostrarBloqueCelebrantes = computed(() => requiereDatosCelebrantes.value);

const lineasCelebrantesValidasCount = computed(
  () => lineasCelebrantes.value.filter((l) => l.descripcion.trim().length >= 5).length,
);

const precioTipoSeleccionado = computed(() =>
  Number(tipoSeleccionado.value?.precio ?? 0),
);

const etiquetaCelebrantes = computed(() =>
  etiquetaPasoRegistro(form.value.idtipomisa, tipoSeleccionado.value?.nombre),
);

const descripcionCelebrantes = computed(() =>
  descripcionPasoRegistro(form.value.idtipomisa, tipoSeleccionado.value?.nombre),
);

const placeholderCelebrante = computed(() =>
  placeholderLinea(form.value.idtipomisa, tipoSeleccionado.value?.nombre),
);

const etiquetaLineaSingularComputed = computed(() =>
  etiquetaLineaSingular(form.value.idtipomisa, tipoSeleccionado.value?.nombre),
);

const minFecha = computed(() => new Date().toISOString().split('T')[0]);

// --- MÉTODOS ---
const mostrarToast = (mensaje: string, tipo: 'success' | 'error') => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { visible: true, mensaje, tipo };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, 3500);
};

const resetForm = () => {
  form.value = { idtipomisa: 0, titulo: '', fechacelebracion: '', horainicio: '', horafin: '', estado: true };
  idHorarioLista.value = 0;
  lineasCelebrantes.value = [emptyLineaCelebrante()];
  idsolicitudRef.value = null;
  snapshotCelebrantes.value = [];
  validationError.value = null;
};

const agregarLineaCelebrante = () => {
  lineasCelebrantes.value.push(emptyLineaCelebrante());
};

const quitarLineaCelebrante = (idx: number) => {
  if (lineasCelebrantes.value.length <= 1) return;
  lineasCelebrantes.value.splice(idx, 1);
};

const cargarOpcionesListas = async () => {
  try {
    const [doc, hor] = await Promise.all([
      getOpcionesLista(1),
      getOpcionesLista(5),
    ]);
    opcionesTipoDocumento.value = doc.map(mapOpcionToSelect);
    opcionesHorario.value = hor.map(mapOpcionToSelect);
  } catch (e) {
    console.error('Error cargando listas para nueva misa:', e);
    opcionesTipoDocumento.value = [];
    opcionesHorario.value = [];
  }
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

    const modo = getModoRegistroLineas(misa.idtipomisa, misa.tipomisa?.nombre);
    const menciones = Array.isArray(misa.menciones) ? misa.menciones : [];

    if (modo === 'nino' || modo === 'pareja') {
      if (menciones.length > 0) {
        lineasCelebrantes.value = menciones.map((m) => ({
          idmencion: m.mencion.idmencion,
          idmencionmisa: m.idmencionmisa,
          descripcion: m.mencion.descripcion ?? '',
        }));
        const sol0 = menciones[0]?.mencion.solicitud;
        idsolicitudRef.value = sol0?.idsolicitud ?? null;
        idHorarioLista.value = Number(sol0?.idhorario ?? 0) || 0;
      } else {
        lineasCelebrantes.value = [emptyLineaCelebrante()];
        idsolicitudRef.value = null;
        idHorarioLista.value = 0;
      }
      snapshotCelebrantes.value = clonarLineasCelebrantes(lineasCelebrantes.value);
    } else {
      lineasCelebrantes.value = [emptyLineaCelebrante()];
      idsolicitudRef.value = null;
      idHorarioLista.value = 0;
      snapshotCelebrantes.value = [];
    }
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

  if (mostrarBloqueCelebrantes.value) {
    if (!idHorarioLista.value) {
      validationError.value = 'Seleccione el horario de la lista';
      return false;
    }
    if (opcionesTipoDocumento.value.length === 0) {
      validationError.value = 'No hay tipos de documento configurados; no se puede registrar la misa.';
      return false;
    }
    const lineasOk = lineasCelebrantes.value
      .map((l) => l.descripcion.trim())
      .filter((t) => t.length > 0);
    if (lineasOk.length < 1) {
      validationError.value = `Debe registrar al menos un ${etiquetaLineaSingularComputed.value.toLowerCase()}`;
      return false;
    }
    for (let i = 0; i < lineasOk.length; i++) {
      if (lineasOk[i]!.length < 5) {
        validationError.value = `Cada ${etiquetaLineaSingularComputed.value.toLowerCase()} debe tener al menos 5 caracteres`;
        return false;
      }
    }
  }

  return true;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;
  guardando.value = true;
  
  try {
    if (modoEdicion.value && props.misaId) {
      await actualizarMisa({ idmisa: props.misaId, ...form.value });

      if (mostrarBloqueCelebrantes.value) {
        const primeraDoc = opcionesTipoDocumento.value[0];
        if (!primeraDoc) {
          mostrarToast('No hay tipos de documento en el sistema', 'error');
          return;
        }
        const { idsolicitud } = await sincronizarCelebrantesMisaEnEdicion({
          idMisa: props.misaId,
          idTipoMisa: form.value.idtipomisa,
          fechacelebracion: form.value.fechacelebracion,
          precioUnitario: precioTipoSeleccionado.value,
          idTipoDocumentoSistema: Number(primeraDoc.id),
          idsolicitudInicial: idsolicitudRef.value,
          idHorarioLista: idHorarioLista.value,
          lineas: clonarLineasCelebrantes(lineasCelebrantes.value),
          snapshot: clonarLineasCelebrantes(snapshotCelebrantes.value),
        });
        if (idsolicitudRef.value == null) idsolicitudRef.value = idsolicitud;
        await cargarMisa();
      }

      mostrarToast('Misa actualizada correctamente', 'success');
    } else if (mostrarBloqueCelebrantes.value) {
      const primeraDoc = opcionesTipoDocumento.value[0];
      if (!primeraDoc) {
        mostrarToast('No hay tipos de documento en el sistema', 'error');
        return;
      }
      const lineasOk = lineasCelebrantes.value
        .map((l) => l.descripcion.trim())
        .filter((t) => t.length >= 5);
      const monto = precioTipoSeleccionado.value * lineasOk.length;

      await registrarMisaAdminConSolicitud({
        misa: { ...form.value },
        solicitud: {
          idtipodocumento: Number(primeraDoc.id),
          nrodocumento: '00000000',
          nombres: 'Parroquia',
          apellidos: 'Registro interno',
          celular: null,
          correo: null,
          fechacelebracion: form.value.fechacelebracion,
          idtipomisa: form.value.idtipomisa,
          idhorario: idHorarioLista.value,
          intencion: null,
          voucherpago: VOUCHER_PAGO_EFECTIVO_MARKER,
          montototal: monto,
          fechamisadeseada: form.value.fechacelebracion,
          estado: true,
          idusuariocreacion: null,
          idestadoproceso: ID_ESTADO_SOLICITUD_APROBADA,
        },
        descripcionesLineas: lineasOk,
      });
      mostrarToast('Misa creada con celebrantes registrados', 'success');
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
    await Promise.all([cargarTiposMisa(), cargarOpcionesListas()]);
    if (modoEdicion.value) await cargarMisa();
    else resetForm();
  }
});

watch(
  () => form.value.idtipomisa,
  () => {
    const nombre = tiposMisa.value.find((t) => t.idtipomisa === form.value.idtipomisa)?.nombre;
    const modo = getModoRegistroLineas(form.value.idtipomisa, nombre);
    if (modo !== 'nino' && modo !== 'pareja') {
      lineasCelebrantes.value = [emptyLineaCelebrante()];
      idsolicitudRef.value = null;
      snapshotCelebrantes.value = [];
    }
  },
);

onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer); });
</script>