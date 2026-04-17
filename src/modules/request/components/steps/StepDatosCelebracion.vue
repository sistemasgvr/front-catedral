<template>
  <div class="step-content">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E0D5C5] dark:border-gray-700 p-6 md:p-8 w-full max-w-3xl mx-auto">
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] dark:text-[#E5A84A] mb-2 text-center">
        Datos de la Celebración
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] dark:bg-[#E5A84A] rounded mx-auto mb-6"></div>

      <!-- Form -->
      <form @submit.prevent class="space-y-4">
        <!-- Tipo de Misa -->
        <InputSelect v-model="idTipoMisa" name="idTipoMisa" label="Tipo de Misa" placeholder="Seleccionar tipo de misa"
          :options="tiposMisa" :loading="loadingTiposMisa" :required="true" :error-message="fieldErrors.idTipoMisa"
          @blur="touchField('idTipoMisa')" />

        <!-- Contenido condicional según tipo de misa -->
        <template v-if="idTipoMisa">
          <!-- MISA PRIVADA -->
          <template v-if="esMisaPrivada">
            <!-- Costo de Misa Privada -->
            <div class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-lg p-4 border border-[#D39E3A]/30 dark:border-amber-700/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon icon="mdi:cash-register" class="w-5 h-5 text-[#C88A2A] dark:text-[#E5A84A]" aria-hidden="true" />
                  <span class="text-[#4A4A4A] dark:text-gray-200 font-medium">{{ etiquetaBloqueCosto }}</span>
                </div>
                <span class="text-[#C88A2A] dark:text-[#E5A84A] font-bold text-xl">S/ {{ precioTipoMisa.toFixed(2) }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDate v-model="fechaCelebracion" name="fechaCelebracion" label="Fecha de Celebración"
                :min="fechaMinima" :required="true" :error-message="fieldErrors.fechaCelebracion"
                @blur="touchField('fechaCelebracion')" />
              <InputSelect v-model="idHorario" name="idHorario" label="Horario" placeholder="Seleccionar horario"
                :options="horarios" :loading="loadingHorarios" :required="true" :error-message="fieldErrors.idHorario"
                @blur="touchField('idHorario')" />
            </div>

            <!-- Intención: solo misa privada y funeral (no bautizo/matrimonio) -->
            <InputTextarea
              v-if="requiereIntencion"
              v-model="intencion"
              name="intencion"
              label="Intención"
              placeholder="Escriba la intención de la misa (ej: Acción de gracias, por la salud de...)"
              :rows="3"
              :maxlength="500"
              :show-count="true"
              :required="true"
              :error-message="fieldErrors.intencion"
              @blur="touchField('intencion')"
            />
          </template>

          <!-- MISA COMUNITARIA -->
          <template v-else>
            <div class="space-y-3">
              <label class="block text-sm font-medium text-[#4A4A4A] dark:text-gray-300">
                Misas Disponibles <span class="text-red-500">*</span>
              </label>

              <!-- Skeleton loading -->
              <div v-if="loadingMisas" class="space-y-3">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>

              <!-- Lista de misas -->
              <div v-else-if="misasDisponibles.length > 0" class="space-y-3 max-h-64 overflow-y-auto">
                <div v-for="misa in misasDisponibles" :key="misa.id" @click="seleccionarMisa(misa)"
                  class="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200" :class="[
                    idMisaSeleccionada === misa.id
                      ? 'border-[#C88A2A] bg-[#FFF5E6] dark:bg-amber-900/20 dark:border-[#E5A84A]'
                      : 'border-[#E0D5C5] dark:border-gray-600 hover:border-[#C88A2A]/50 dark:hover:border-[#E5A84A]/50 bg-white dark:bg-gray-700/50',
                  ]">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-[#4A4A4A] dark:text-gray-100">
                        {{ misa.titulo }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ misa.tipoMisa }}</p>
                    </div>
                    <span class="text-[#C88A2A] dark:text-[#E5A84A] font-bold">S/ {{ misa.precio.toFixed(2) }}</span>
                  </div>
                  <div class="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <Icon icon="mdi:calendar" class="w-4 h-4 shrink-0" aria-hidden="true" />
                      {{ formatDate(misa.fecha) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon icon="mdi:clock-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                      {{ misa.horario }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Sin misas disponibles -->
              <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:emoticon-sad-outline" class="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                <p>No hay misas comunitarias disponibles</p>
              </div>

              <p v-if="fieldErrors.idMisaSeleccionada" class="text-sm text-red-500 dark:text-red-400">
                {{ fieldErrors.idMisaSeleccionada }}
              </p>
            </div>

            <!-- Mostrar fecha y horario seleccionados -->
            <div v-if="idMisaSeleccionada" class="bg-[#FFF5E6] dark:bg-amber-900/20 rounded-lg p-4 border border-[#D39E3A]/30 dark:border-amber-700/30">
              <p class="text-sm text-[#4A4A4A] dark:text-gray-200">
                <strong>Fecha:</strong> {{ formatDate(fechaCelebracion) }} |
                <strong>Horario:</strong> {{ horarioMisaSeleccionada }}
              </p>
            </div>
          </template>
        </template>

        <!-- Validation Message -->
        <div v-if="hasInteracted && hasErrors"
          class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 flex items-center gap-3">
          <Icon icon="mdi:alert-outline" class="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <p class="text-amber-700 dark:text-amber-300 text-sm">
            Complete todos los campos para continuar
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { useSolicitudStore } from "../../stores/solicitud.store";
import { getMisas } from "../../actions/getMisas.action";
import { type ISelectOption } from "../../interfaces/opcionLista.interface";
import {
  mapMisaToListItem,
  type IMisaListItem,
} from "../../interfaces/misa.interface";
import { InputSelect, InputDate, InputTextarea } from "@/components/inputs";
import { getOpcionesLista } from "../../actions/getOpcionesLista.action";
import { mapOpcionToSelect } from "../../interfaces/opcionLista.interface";
import { getTiposMisa } from "../../actions/getTiposMisa.action";
import {
  mapTipoMisaToSelect,
  type ITipomisa,
} from "../../interfaces/tipoMisa.interface";
import {
  omitePasoRegistroLineas,
  requiereCampoIntencion,
} from "../../constants/tipoMisaRegistro";

const store = useSolicitudStore();
const route = useRoute();

const ID_LISTA_HORARIOS = 5;

/** Fecha de hoy en zona local YYYY-MM-DD (evita desfase de `toISOString()` UTC). */
function fechaHoyLocalYYYYMMDD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYyyyMmDdLocal(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const parts = s.split("-").map(Number);
  const y = parts[0];
  const mo = parts[1];
  const da = parts[2];
  if (y == null || mo == null || da == null) return null;
  const d = new Date(y, mo - 1, da);
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== da) return null;
  return d;
}

/** true si la fecha (solo día) es estrictamente anterior a hoy en calendario local. */
function esFechaCelebracionPasada(yyyyMmDd: string): boolean {
  if (!yyyyMmDd) return false;
  const selected = parseYyyyMmDdLocal(yyyyMmDd);
  if (!selected) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  return selected.getTime() < today.getTime();
}

const loadingTiposMisa = ref(false);
const loadingHorarios = ref(true);
const loadingMisas = ref(false);

const tiposMisa = ref<ISelectOption[]>([]);
const tiposMisaOriginales = ref<ITipomisa[]>([]);
const horarios = ref<ISelectOption[]>([]);
const misasDisponibles = ref<IMisaListItem[]>([]);

const idTipoMisa = ref<number | null>(null);
const fechaCelebracion = ref("");
const idHorario = ref<number | null>(null);
const intencion = ref("");
const idMisaSeleccionada = ref<number | null>(null);
const horarioMisaSeleccionada = ref("");

const hasInteracted = ref(false);
const touchedFields = ref<Set<string>>(new Set());
const fieldErrors = reactive<Record<string, string | undefined>>({});

const fechaMinima = computed(() => fechaHoyLocalYYYYMMDD());

const esMisaPrivada = computed(() => {
  const tipo = tiposMisa.value.find((t) => t.id === idTipoMisa.value);
  return !(tipo?.nombre?.toLowerCase().includes("comunitaria") ?? false);
});

const precioTipoMisa = computed(() => {
  const tipo = tiposMisaOriginales.value.find(
    (t) => t.idtipomisa === idTipoMisa.value,
  );
  return tipo?.precio ?? 0;
});

const nombreTipoSeleccionado = computed(
  () =>
    tiposMisaOriginales.value.find((t) => t.idtipomisa === idTipoMisa.value)
      ?.nombre ?? "",
);

const etiquetaBloqueCosto = computed(() => {
  const n = nombreTipoSeleccionado.value;
  return n ? `Costo — ${n}` : "Costo";
});

const requiereIntencion = computed(() =>
  requiereCampoIntencion(idTipoMisa.value, nombreTipoSeleccionado.value),
);

const hasErrors = computed(() => Object.values(fieldErrors).some((e) => e));

const cargarTiposMisa = async () => {
  try {
    loadingTiposMisa.value = true;
    const opciones = await getTiposMisa();
    tiposMisaOriginales.value = opciones;
    tiposMisa.value = opciones.map(mapTipoMisaToSelect);
  } catch (error) {
    console.error("Error al cargar tipos de misa:", error);
    tiposMisa.value = [];
  } finally {
    loadingTiposMisa.value = false;
  }
};

const cargarHorarios = async () => {
  try {
    loadingHorarios.value = true;
    const opciones = await getOpcionesLista(ID_LISTA_HORARIOS);
    horarios.value = opciones.map(mapOpcionToSelect);
  } catch (error) {
    console.error("Error al cargar horarios:", error);
    horarios.value = [];
  } finally {
    loadingHorarios.value = false;
  }
};

const cargarMisas = async () => {
  try {
    loadingMisas.value = true;
    const misas = await getMisas(idTipoMisa.value ?? undefined);
    misasDisponibles.value = misas.map(mapMisaToListItem);
  } catch (error) {
    console.error("Error al cargar misas:", error);
    misasDisponibles.value = [];
  } finally {
    loadingMisas.value = false;
  }
};

const touchField = (fieldName: string) => {
  touchedFields.value.add(fieldName);
  hasInteracted.value = true;
  validateField(fieldName);
};

const validateField = (fieldName: string) => {
  switch (fieldName) {
    case "idTipoMisa":
      fieldErrors.idTipoMisa = !idTipoMisa.value
        ? "Seleccione un tipo de misa"
        : undefined;
      break;
    case "fechaCelebracion":
      if (esMisaPrivada.value) {
        if (!fechaCelebracion.value) {
          fieldErrors.fechaCelebracion = "La fecha es requerida";
        } else if (esFechaCelebracionPasada(fechaCelebracion.value)) {
          fieldErrors.fechaCelebracion =
            "La fecha de celebración no puede ser anterior a hoy";
        } else {
          fieldErrors.fechaCelebracion = undefined;
        }
      }
      break;
    case "idHorario":
      if (esMisaPrivada.value) {
        fieldErrors.idHorario = !idHorario.value
          ? "Seleccione un horario"
          : undefined;
      }
      break;
    case "idMisaSeleccionada":
      if (!esMisaPrivada.value && idTipoMisa.value) {
        fieldErrors.idMisaSeleccionada = !idMisaSeleccionada.value
          ? "Seleccione una misa"
          : undefined;
      }
      break;
    case "intencion":
      if (esMisaPrivada.value && requiereIntencion.value) {
        if (!intencion.value) {
          fieldErrors.intencion = "La intención es requerida";
        } else if (intencion.value.length < 10) {
          fieldErrors.intencion = "Mínimo 10 caracteres";
        } else {
          fieldErrors.intencion = undefined;
        }
      } else {
        fieldErrors.intencion = undefined;
      }
      break;
  }
};

const validateAll = (): boolean => {
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key] = undefined;
  });

  if (!idTipoMisa.value) {
    fieldErrors.idTipoMisa = "Seleccione un tipo de misa";
  }

  if (esMisaPrivada.value) {
    if (!fechaCelebracion.value) {
      fieldErrors.fechaCelebracion = "La fecha es requerida";
    } else if (esFechaCelebracionPasada(fechaCelebracion.value)) {
      fieldErrors.fechaCelebracion =
        "La fecha de celebración no puede ser anterior a hoy";
    }
    if (!idHorario.value) {
      fieldErrors.idHorario = "Seleccione un horario";
    }
    if (requiereIntencion.value) {
      if (!intencion.value) {
        fieldErrors.intencion = "La intención es requerida";
      } else if (intencion.value.length < 10) {
        fieldErrors.intencion = "Mínimo 10 caracteres";
      }
    } else {
      fieldErrors.intencion = undefined;
    }
    if (omitePasoRegistroLineas(idTipoMisa.value, nombreTipoSeleccionado.value)) {
      store.solicitud.montoTotal = precioTipoMisa.value;
    } else {
      store.solicitud.montoTotal = store.solicitud.menciones.reduce(
        (s, m) => s + m.costo,
        0,
      );
    }
  } else if (idTipoMisa.value) {
    if (!idMisaSeleccionada.value) {
      fieldErrors.idMisaSeleccionada = "Seleccione una misa";
    } else if (
      fechaCelebracion.value &&
      esFechaCelebracionPasada(fechaCelebracion.value)
    ) {
      fieldErrors.idMisaSeleccionada =
        "La misa seleccionada tiene una fecha pasada. Elija otra misa.";
    }
    store.solicitud.costoMencion = precioTipoMisa.value;
  }

  return !hasErrors.value;
};

const seleccionarMisa = (misa: IMisaListItem) => {
  if (esFechaCelebracionPasada(misa.fecha)) {
    fieldErrors.idMisaSeleccionada =
      "No se puede elegir una misa con fecha pasada. Seleccione otra.";
    return;
  }
  idMisaSeleccionada.value = misa.id;
  fechaCelebracion.value = misa.fecha;
  horarioMisaSeleccionada.value = misa.horario;
  const hhmm = misa.horainicio?.slice(0, 5) || "";
  const horarioMatch = horarios.value.find((h) => h.nombre?.includes(hhmm));
  idHorario.value = horarioMatch?.id ?? horarios.value[0]?.id ?? null;
  fieldErrors.idMisaSeleccionada = undefined;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

watch(idTipoMisa, async (newValue, oldValue) => {
  if (newValue !== oldValue && oldValue !== null) {
    fechaCelebracion.value = "";
    idHorario.value = null;
    idMisaSeleccionada.value = null;
    horarioMisaSeleccionada.value = "";
    intencion.value = "";

    fieldErrors.fechaCelebracion = undefined;
    fieldErrors.idHorario = undefined;
    fieldErrors.idMisaSeleccionada = undefined;
    fieldErrors.intencion = undefined;
  }

  if (newValue && !esMisaPrivada.value) {
    await cargarMisas();
  }
});

watch(
  [idTipoMisa, fechaCelebracion, idHorario, intencion, idMisaSeleccionada],
  () => {
    const tipo = tiposMisaOriginales.value.find(
      (t) => t.idtipomisa === idTipoMisa.value,
    );
    store.updateDatosCelebracion({
      idTipoMisa: idTipoMisa.value,
      nombreTipoMisa: tipo?.nombre ?? "",
      fechaCelebracion: fechaCelebracion.value,
      idHorario: idHorario.value,
      intencion:
        esMisaPrivada.value &&
        requiereCampoIntencion(idTipoMisa.value, tipo?.nombre ?? "")
          ? intencion.value
          : "",
      costoMencion: tipo?.precio ?? 0,
    });
  },
  { deep: true },
);

onMounted(async () => {
  await Promise.all([cargarTiposMisa(), cargarHorarios()]);

  const queryMisaId = parseInt(route.query.misaId as string, 10);
  const queryTipoMisaId = parseInt(route.query.idTipoMisa as string, 10);

  if (!Number.isNaN(queryTipoMisaId) && queryTipoMisaId > 0) {
    idTipoMisa.value = queryTipoMisaId;
  } else {
    idTipoMisa.value = store.solicitud.idTipoMisa;
  }
  fechaCelebracion.value = store.solicitud.fechaCelebracion;
  idHorario.value = store.solicitud.idHorario;
  intencion.value = store.solicitud.intencion;

  if (fechaCelebracion.value && esFechaCelebracionPasada(fechaCelebracion.value)) {
    fechaCelebracion.value = "";
    idMisaSeleccionada.value = null;
    horarioMisaSeleccionada.value = "";
    idHorario.value = null;
  }

  if (idTipoMisa.value && !esMisaPrivada.value) {
    await cargarMisas();

    if (!Number.isNaN(queryMisaId) && queryMisaId > 0) {
      const misa = misasDisponibles.value.find((m) => m.id === queryMisaId);
      if (misa) {
        seleccionarMisa(misa);
      }
    }
  }
});

watch(fechaCelebracion, () => {
  if (!esMisaPrivada.value) return;
  if (!touchedFields.value.has("fechaCelebracion") && !hasInteracted.value) return;
  validateField("fechaCelebracion");
});

defineExpose({
  validate: async () => {
    hasInteracted.value = true;
    const isValid = validateAll();
    return isValid;
  },
  esMisaPrivada,
});
</script>

<style scoped></style>