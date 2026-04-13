<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors"
  >
    <div class="border-b border-gray-200 dark:border-gray-600 px-4 sm:px-6 py-4 sm:py-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Calendario de Misas
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Vista mensual · Clic para ver el detalle · Clic derecho para más acciones
          </p>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          <button
            type="button"
            class="flex items-center justify-center min-h-[44px] px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
            @click="goPrevMonth"
          >
            <svg class="w-4 h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">Anterior</span>
          </button>

          <div
            class="px-4 py-2.5 rounded-lg bg-[#C88A2A] text-white font-semibold text-sm shadow min-w-[140px] sm:min-w-[180px] text-center"
          >
            {{ monthLabel }}
          </div>

          <button
            type="button"
            class="flex items-center justify-center min-h-[44px] px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="goNextMonth"
          >
            <span class="hidden sm:inline">Siguiente</span>
            <svg class="w-4 h-4 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="px-3 sm:px-6 py-4 sm:py-6">
      <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
        <div
          v-for="d in weekDays"
          :key="d"
          class="text-center py-2 text-xs sm:text-sm font-semibold text-[#C88A2A] dark:text-[#E8B86A] uppercase tracking-wide"
        >
          <span class="hidden sm:inline">{{ d }}</span>
          <span class="sm:hidden">{{ d.slice(0, 1) }}</span>
        </div>
      </div>

      <div v-if="loading" class="space-y-2 sm:space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-20 sm:h-28 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-7 gap-1 sm:gap-2">
        <div
          v-for="i in leadingBlankDays"
          :key="'blank-' + i"
          class="h-20 sm:h-28 lg:h-32"
        ></div>

        <div
          v-for="day in daysInMonth"
          :key="day.dateKey"
          class="border rounded-lg p-1.5 sm:p-2 h-20 sm:h-28 lg:h-32 overflow-hidden transition-all duration-200 hover:shadow-md"
          :class="[
            day.isToday
              ? 'bg-amber-50 dark:bg-amber-900/20 border-[#C88A2A]/50 ring-1 ring-[#C88A2A]/30'
              : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-600 hover:border-[#C88A2A]/40',
          ]"
        >
          <div class="flex items-center justify-between mb-1 sm:mb-1.5">
            <span
              class="text-xs sm:text-sm font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
              :class="
                day.isToday
                  ? 'bg-[#C88A2A] text-white rounded-full'
                  : 'text-gray-800 dark:text-gray-200'
              "
            >
              {{ day.day }}
            </span>
            <span
              v-if="day.misas.length > 0"
              class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full"
            >
              {{ day.misas.length }}
            </span>
          </div>

          <div class="space-y-0.5 sm:space-y-1">
            <button
              v-for="misa in day.misas.slice(0, 2)"
              :key="misa.id"
              type="button"
              class="w-full text-left px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border transition-all duration-200"
              :class="
                misa.esPrivada
                  ? 'bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  : 'bg-amber-50/80 dark:bg-amber-900/20 border-[#C88A2A]/30 text-gray-800 dark:text-gray-100 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 cursor-pointer'
              "
              @click="emitSelect(misa)"
              @contextmenu.prevent="abrirMenuContextoMisa($event, misa)"
            >
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="text-[9px] sm:text-[10px] font-semibold truncate">
                  {{ misa.horario }}
                </span>
                <span class="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 bg-white/60 dark:bg-gray-800/80 rounded">
                  {{ misa.menciones }}
                </span>
              </div>
              <div class="text-[9px] sm:text-[10px] leading-tight truncate opacity-90">
                {{ misa.titulo }}
              </div>
            </button>

            <div
              v-if="day.misas.length > 2"
              class="text-[9px] sm:text-[10px] text-center text-gray-500 font-medium py-0.5"
            >
              +{{ day.misas.length - 2 }} más
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <p class="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
          {{ errorMessage }}
        </p>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded border border-[#C88A2A]/40 bg-amber-50 dark:bg-amber-900/30"></div>
            <span>Comunitaria / editable</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"></div>
            <span>Privada (informativa)</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-[#C88A2A]"></div>
            <span>Hoy</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="menuContexto"
        ref="menuContextoEl"
        class="fixed z-[200] min-w-[168px] py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl"
        :style="{ left: `${menuContexto.x}px`, top: `${menuContexto.y}px` }"
        role="menu"
        @click.stop
      >
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/25 flex items-center gap-2"
          @click="ejecutarAccionContexto('ver')"
        >
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-amber-900/25 flex items-center gap-2"
          @click="ejecutarAccionContexto('editar')"
        >
          <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-3 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/25 flex items-center gap-2"
          @click="ejecutarAccionContexto('eliminar')"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { getMisasCalendario } from '../../request/actions/getMisasCalendario.action';
import type { IMisaCalendario } from '../../request/interfaces/misa.interface';

export interface FiltrosCalendarioMisa {
  busqueda: string;
  tipoMisa: number | null;
  estado: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
}

interface CalendarMisaItem {
  id: number;
  fecha: string;
  horario: string;
  titulo: string;
  tipoMisa: string;
  precio: number;
  esPrivada: boolean;
  menciones: number;
  idTipoMisa: number;
  estado: boolean;
}

const props = defineProps<{
  filtros: FiltrosCalendarioMisa;
}>();

export type AccionMisaCalendario = 'ver' | 'editar' | 'eliminar';

const emit = defineEmits<{
  'select-misa': [idMisa: number];
  'accion-misa': [payload: { accion: AccionMisaCalendario; idMisa: number }];
}>();

const loading = ref(false);
const errorMessage = ref('');
const misasRaw = ref<CalendarMisaItem[]>([]);

const menuContexto = ref<{ idMisa: number; x: number; y: number } | null>(null);
const menuContextoEl = ref<HTMLElement | null>(null);
let removeMenuListeners: (() => void) | null = null;

function cerrarMenuContexto() {
  menuContexto.value = null;
}

function abrirMenuContextoMisa(e: MouseEvent, misa: CalendarMisaItem) {
  const menuW = 180;
  const menuH = 132;
  const pad = 8;
  let x = e.clientX;
  let y = e.clientY;
  if (x + menuW > window.innerWidth - pad) x = Math.max(pad, window.innerWidth - menuW - pad);
  if (y + menuH > window.innerHeight - pad) y = Math.max(pad, window.innerHeight - menuH - pad);
  menuContexto.value = { idMisa: misa.id, x, y };
}

function ejecutarAccionContexto(accion: AccionMisaCalendario) {
  if (!menuContexto.value) return;
  const idMisa = menuContexto.value.idMisa;
  cerrarMenuContexto();
  emit('accion-misa', { accion, idMisa });
}

watch(menuContexto, async (v) => {
  removeMenuListeners?.();
  removeMenuListeners = null;
  if (!v) return;
  await nextTick();
  const onDocPointerDown = (e: PointerEvent) => {
    const el = menuContextoEl.value;
    if (el && !el.contains(e.target as Node)) cerrarMenuContexto();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cerrarMenuContexto();
  };
  document.addEventListener('pointerdown', onDocPointerDown, true);
  document.addEventListener('keydown', onKey);
  removeMenuListeners = () => {
    document.removeEventListener('pointerdown', onDocPointerDown, true);
    document.removeEventListener('keydown', onKey);
  };
});

onUnmounted(() => {
  removeMenuListeners?.();
});

const today = new Date();
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const monthLabel = computed(() =>
  currentMonth.value
    .toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase())
);

const leadingBlankDays = computed(() => {
  const firstDay = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    1
  );
  const day = firstDay.getDay();
  return day === 0 ? 6 : day - 1;
});

function aplicarFiltros(items: CalendarMisaItem[]): CalendarMisaItem[] {
  let r = [...items];
  const f = props.filtros;

  if (f.busqueda.trim()) {
    const q = f.busqueda.toLowerCase().trim();
    r = r.filter(
      (m) =>
        m.titulo.toLowerCase().includes(q) ||
        m.tipoMisa.toLowerCase().includes(q)
    );
  }

  if (f.tipoMisa !== null) {
    r = r.filter((m) => m.idTipoMisa === f.tipoMisa);
  }

  if (f.estado !== null) {
    r = r.filter((m) => m.estado === f.estado);
  }

  if (f.fechaDesde) {
    r = r.filter((m) => m.fecha >= f.fechaDesde);
  }

  if (f.fechaHasta) {
    r = r.filter((m) => m.fecha <= f.fechaHasta);
  }

  return r;
}

const misasFiltradas = computed(() => aplicarFiltros(misasRaw.value));

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: Array<{
    day: number;
    dateKey: string;
    isToday: boolean;
    misas: CalendarMisaItem[];
  }> = [];
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dateKey = date.toISOString().split('T')[0]!;
    days.push({
      day: d,
      dateKey,
      isToday: dateKey === new Date().toISOString().split('T')[0],
      misas: misasFiltradas.value.filter((m) => m.fecha === dateKey),
    });
  }
  return days;
});

function horaCorta(hora: string | undefined): string {
  if (!hora || !hora.includes(':')) return '--:--';
  return hora.slice(0, 5);
}

function mapMisa(misa: IMisaCalendario): CalendarMisaItem {
  const esPrivada =
    misa.tipomisa?.nombre?.toLowerCase().includes('privada') ?? false;
  const mencionesCount = misa.mencionesmisa?.[0]?.count ?? 0;
  const hi = horaCorta(misa.horainicio);
  const hf = horaCorta(misa.horafin);
  return {
    id: misa.idmisa,
    fecha: misa.fechacelebracion,
    horario: `${hi} - ${hf}`,
    titulo: misa.titulo || 'Misa programada',
    tipoMisa: misa.tipomisa?.nombre || '-',
    precio: misa.tipomisa?.precio ?? 0,
    esPrivada,
    menciones: mencionesCount,
    idTipoMisa: misa.idtipomisa,
    estado: misa.estado,
  };
}

async function loadMisas() {
  loading.value = true;
  errorMessage.value = '';
  const start = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    1
  );
  const end = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    0
  );
  const startDate = start.toISOString().substring(0, 10);
  const endDate = end.toISOString().substring(0, 10);

  try {
    const data = await getMisasCalendario(startDate, endDate);
    misasRaw.value = data.map(mapMisa);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No se pudo cargar el calendario';
    misasRaw.value = [];
  } finally {
    loading.value = false;
  }
}

function emitSelect(misa: CalendarMisaItem) {
  emit('select-misa', misa.id);
}

function goNextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  );
}

function goPrevMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  );
}

watch(currentMonth, () => {
  loadMisas();
});

onMounted(() => {
  loadMisas();
});

defineExpose({
  recargar: loadMisas,
});
</script>
