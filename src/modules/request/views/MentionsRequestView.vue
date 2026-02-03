<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background Image with Overlay -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
      :style="{ backgroundImage: `url('/images/FondoCatedral.jpeg')` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <HeaderSolicitud />

      <!-- Content -->
      <main class="flex-1 flex items-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div class="w-full max-w-7xl mx-auto">
          <!-- Calendar Card -->
          <section
            class="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-[#E0D5C5]/50 overflow-hidden"
          >
            <!-- Header Section -->
            <div class="border-b border-[#E0D5C5]/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2
                    class="text-2xl sm:text-3xl font-serif font-bold text-[#8C1D40] mb-1"
                  >
                    Calendario de Misas
                  </h2>
                  <p class="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                    Misas comunitarias disponibles • Misas privadas solo informativas
                  </p>
                </div>

                <!-- Navigation Controls -->
                <div class="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                  <button
                    class="flex items-center justify-center min-h-[44px] px-4 sm:px-5 rounded-lg border border-[#E0D5C5] text-sm font-medium text-[#4A4A4A] hover:bg-[#F5F0E8] hover:border-[#8C1D40]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    @click="goPrevMonth"
                    :disabled="!canGoPrev"
                  >
                    <svg class="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span class="hidden sm:inline">Anterior</span>
                  </button>

                  <div
                    class="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-br from-[#8C1D40] to-[#6D1632] text-white font-semibold text-sm sm:text-base shadow-md min-w-[140px] sm:min-w-[180px] text-center"
                  >
                    {{ monthLabel }}
                  </div>

                  <button
                    class="flex items-center justify-center min-h-[44px] px-4 sm:px-5 rounded-lg border border-[#E0D5C5] text-sm font-medium text-[#4A4A4A] hover:bg-[#F5F0E8] hover:border-[#8C1D40]/20 transition-all duration-200 active:scale-95"
                    @click="goNextMonth"
                  >
                    <span class="hidden sm:inline">Siguiente</span>
                    <svg class="w-4 h-4 sm:ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
              <!-- Week Days Header -->
              <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                <div
                  v-for="d in weekDays"
                  :key="d"
                  class="text-center py-2 text-xs sm:text-sm font-semibold text-[#8C1D40]/80 uppercase tracking-wide"
                >
                  <span class="hidden sm:inline">{{ d }}</span>
                  <span class="sm:hidden">{{ d.slice(0, 1) }}</span>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="space-y-2 sm:space-y-3">
                <div v-for="i in 5" :key="i" class="animate-pulse">
                  <div class="h-20 sm:h-28 bg-gray-100 rounded-lg"></div>
                </div>
              </div>

              <!-- Calendar Days -->
              <div v-else class="grid grid-cols-7 gap-1 sm:gap-2">
                <!-- Leading blank days -->
                <div
                  v-for="i in leadingBlankDays"
                  :key="'blank-' + i"
                  class="h-20 sm:h-28 lg:h-32"
                ></div>

                <!-- Days with content -->
                <div
                  v-for="day in daysInMonth"
                  :key="day.dateKey"
                  class="border rounded-lg p-1.5 sm:p-2 h-20 sm:h-28 lg:h-32 overflow-hidden transition-all duration-200 hover:shadow-md"
                  :class="[
                    day.isToday
                      ? 'bg-[#FFF5E6] border-[#D39E3A]/50 ring-1 ring-[#D39E3A]/30'
                      : 'bg-white border-[#E0D5C5]/60 hover:border-[#8C1D40]/30'
                  ]"
                >
                  <!-- Day Number -->
                  <div class="flex items-center justify-between mb-1 sm:mb-1.5">
                    <span
                      class="text-xs sm:text-sm font-bold text-[#8C1D40] w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
                      :class="day.isToday ? 'bg-[#8C1D40] text-white rounded-full' : ''"
                    >
                      {{ day.day }}
                    </span>
                    <span
                      v-if="day.misas.length > 0"
                      class="text-[9px] sm:text-[10px] text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded-full"
                    >
                      {{ day.misas.length }}
                    </span>
                  </div>

                  <!-- Misas List -->
                  <div class="space-y-0.5 sm:space-y-1">
                    <button
                      v-for="misa in day.misas.slice(0, 2)"
                      :key="misa.id"
                      class="w-full text-left px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border transition-all duration-200 group"
                      :class="
                        misa.esPrivada
                          ? 'bg-gray-50/80 border-gray-200/60 text-gray-500 cursor-default'
                          : 'bg-[#FFF5E6]/80 border-[#D39E3A]/30 text-[#8C1D40] hover:bg-[#FFF5E6] hover:border-[#8C1D40]/60 hover:shadow-sm cursor-pointer active:scale-[0.98]'
                      "
                      @click="onSelectMisa(misa)"
                      :disabled="misa.esPrivada"
                    >
                      <div class="flex items-center justify-between gap-1 mb-0.5">
                        <span class="text-[9px] sm:text-[10px] font-semibold truncate">
                          {{ misa.horario }}
                        </span>
                        <span
                          v-if="!misa.esPrivada"
                          class="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 bg-white/60 rounded"
                        >
                          {{ misa.menciones }}
                        </span>
                      </div>
                      <div class="text-[9px] sm:text-[10px] leading-tight truncate opacity-90">
                        {{ misa.titulo }}
                      </div>
                    </button>

                    <!-- More indicator -->
                    <div
                      v-if="day.misas.length > 2"
                      class="text-[9px] sm:text-[10px] text-center text-gray-500 font-medium py-0.5"
                    >
                      +{{ day.misas.length - 2 }} más
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-start gap-2 sm:gap-3">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-xs sm:text-sm text-red-700 font-medium">
                    {{ errorMessage }}
                  </p>
                </div>
              </div>

              <!-- Legend -->
              <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E0D5C5]/30">
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 sm:w-4 sm:h-4 rounded border border-[#D39E3A]/30 bg-[#FFF5E6]/80"></div>
                    <span class="text-gray-600">Comunitaria</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 sm:w-4 sm:h-4 rounded border border-gray-200/60 bg-gray-50/80"></div>
                    <span class="text-gray-600">Privada</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8C1D40] flex items-center justify-center text-[10px] text-white font-bold">
                      15
                    </div>
                    <span class="text-gray-600">Hoy</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer -->
      <FooterSolicitud />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import HeaderSolicitud from "../components/HeaderSolicitud.vue";
import FooterSolicitud from "../components/FooterSolicitud.vue";
import { getMisasCalendario } from "../actions/getMisasCalendario.action";
import type { IMisaCalendario } from "../interfaces/misa.interface";

interface IMisaCalendarItem {
  id: number;
  fecha: string;
  horario: string;
  titulo: string;
  tipoMisa: string;
  precio: number;
  esPrivada: boolean;
  menciones: number;
  idTipoMisa: number;
}

const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");
const misas = ref<IMisaCalendarItem[]>([]);

const today = new Date();
const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const monthLabel = computed(() =>
  currentMonth.value.toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  }).replace(/^\w/, c => c.toUpperCase())
);

const canGoPrev = computed(() => currentMonth.value > minMonth);

const leadingBlankDays = computed(() => {
  const firstDay = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth(),
    1
  );
  const day = firstDay.getDay();
  return day === 0 ? 6 : day - 1;
});

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dateKey = date.toISOString().split("T")[0];
    days.push({
      day: d,
      dateKey,
      isToday: dateKey === new Date().toISOString().split("T")[0],
      misas: misas.value.filter((m) => m.fecha === dateKey),
    });
  }
  return days;
});

const mapMisa = (misa: IMisaCalendario): IMisaCalendarItem => {
  const esPrivada =
    misa.tipomisa?.nombre?.toLowerCase().includes("privada") ?? false;
  const mencionesCount = misa.mencionesmisa?.[0]?.count ?? 0;
  return {
    id: misa.idmisa,
    fecha: misa.fechacelebracion,
    horario: `${misa.horainicio.slice(0, 5)} - ${misa.horafin.slice(0, 5)}`,
    titulo: misa.titulo || "Misa programada",
    tipoMisa: misa.tipomisa?.nombre || "-",
    precio: misa.tipomisa?.precio ?? 0,
    esPrivada,
    menciones: mencionesCount,
    idTipoMisa: misa.idtipomisa,
  };
};

const loadMisas = async () => {
  loading.value = true;
  errorMessage.value = "";
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
    misas.value = data.map(mapMisa);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "No se pudo cargar el calendario";
    misas.value = [];
  } finally {
    loading.value = false;
  }
};

const onSelectMisa = (misa: IMisaCalendarItem) => {
  if (misa.esPrivada) return;
  router.push({
    path: "/nueva-solicitud",
    query: {
      misaId: misa.id.toString(),
      idTipoMisa: misa.idTipoMisa.toString(),
    },
  });
};

const goNextMonth = () => {
  const next = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  );
  currentMonth.value = next;
};

const goPrevMonth = () => {
  if (!canGoPrev.value) return;
  const prev = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  );
  currentMonth.value = prev;
};

watch(currentMonth, () => {
  loadMisas();
});

onMounted(() => {
  loadMisas();
});
</script>

<style scoped>
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}

/* Smooth transitions */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
  }
}

/* Improve readability */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
