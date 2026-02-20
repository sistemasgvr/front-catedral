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
      <main class="flex-1 flex items-center px-4 py-4 md:py-6">
        <div class="w-full max-w-7xl mx-auto space-y-4">
          <!-- Search Card - Más compacto -->
          <section class="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#E0D5C5] p-5">
            <!-- <h2 class="text-lg md:text-xl font-serif font-bold text-[#8C1D40] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Consultar Solicitud
            </h2> -->

            <form @submit.prevent="onBuscar">
              <div class="flex flex-col md:flex-row gap-2 md:items-end">
                <div class="flex-1">
                  <InputText
                    v-model="nroDocumento"
                    name="nroDocumento"
                    label="Número de Documento"
                    placeholder="Ingrese su número de documento"
                    :required="true"
                    :maxlength="20"
                    :error-message="fieldError"
                    @blur="validateDocumento"
                  />
                </div>
                
                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="min-h-[42px] px-6 rounded-lg bg-[#8C1D40] hover:bg-[#741735] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    :disabled="loading"
                  >
                    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ loading ? "Buscando..." : "Buscar" }}</span>
                  </button>
                  <button
                    type="button"
                    class="min-h-[42px] px-5 rounded-lg bg-white border-2 border-[#E0D5C5] text-[#4A4A4A] font-medium hover:bg-[#F5F0E8] transition-all duration-200"
                    @click="onLimpiar"
                    :disabled="loading"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <p v-if="fetchError" class="text-sm text-red-600 flex items-center gap-1 mt-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ fetchError }}
              </p>
            </form>
          </section>

          <!-- Results - Diseño minimalista -->
          <section
            v-if="hasSearched"
            class="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#E0D5C5] overflow-hidden"
          >
            <!-- Header de resultados -->
            <div class="bg-gradient-to-r from-[#8C1D40] to-[#741735] px-5 py-3 flex items-center justify-between">
              <h3 class="text-base font-semibold text-white flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resultados
              </h3>
              <span class="text-sm text-white/90 font-medium bg-white/20 px-3 py-1 rounded-full">
                {{ solicitudes.length }} {{ solicitudes.length === 1 ? 'solicitud' : 'solicitudes' }}
              </span>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="p-5 space-y-3">
              <div v-for="i in 2" :key="i" class="animate-pulse">
                <div class="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-else-if="solicitudes.length === 0"
              class="text-center py-12 px-4"
            >
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500 font-medium">No se encontraron solicitudes</p>
              <p class="text-sm text-gray-400 mt-1">Intente con otro número de documento</p>
            </div>

            <!-- Results list -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
              <article
                v-for="solicitud in solicitudes"
                :key="solicitud.idsolicitud"
                class="p-5 bg-white rounded-xl border border-[#E0D5C5] shadow-sm hover:shadow-md transition-shadow duration-150"
              >
                <!-- Header compacto -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white bg-[#8C1D40] px-2 py-1 rounded">
                      #{{ solicitud.idsolicitud }}
                    </span>
                    <!--
                    <h4 class="text-sm font-semibold text-[#4A4A4A]">
                      {{ solicitud.nombres }} {{ solicitud.apellidos }}
                    </h4>
                    -->
                  </div>
                  <span
                    class="text-xs px-2.5 py-1 rounded-full font-medium"
                    :class="
                      solicitud.estado
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                  >
                    {{ solicitud.estado ? "Activa" : "Inactiva" }}
                  </span>
                </div>

                <!-- Grid de información compacto -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
                  <!--
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Documento</span>
                    <span class="text-gray-800 font-semibold">{{ solicitud.nrodocumento }}</span>
                  </div>
                  -->
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Estado</span>
                    <span class="text-gray-800">{{ solicitud.estado_proceso?.nombre || "-" }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Tipo de misa</span>
                    <span class="text-gray-800">{{ solicitud.tipomisa?.nombre || "-" }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Fecha solicitud</span>
                    <span class="text-gray-800">{{ formatDateShort(solicitud.fechasolicitud || solicitud.fechacreacion) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Fecha misa</span>
                    <span class="text-gray-800">{{ formatDateShort(solicitud.fechamisadeseada || solicitud.fechacelebracion) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Horario</span>
                    <span class="text-gray-800">{{ solicitud.horario?.nombre || "-" }}</span>
                  </div>
                  <!-- <div class="flex flex-col">
                    <span class="text-gray-500 font-medium">Monto</span>
                    <span class="text-[#8C1D40] font-bold">S/ {{ formatMoney(solicitud.montototal) }}</span>
                  </div> -->
                  <!--
                  <div v-if="solicitud.voucherpago" class="flex flex-col">
                    <span class="text-gray-500 font-medium">Voucher</span>
                    <a
                      :href="solicitud.voucherpago"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[#8C1D40] hover:underline font-medium flex items-center gap-1"
                    >
                      Ver comprobante
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  -->
                </div>

                <!-- Intención (si existe) -->
                <!--
                <div v-if="solicitud.intencion" class="mt-3 pt-3 border-t border-[#E0D5C5]">
                  <p class="text-xs text-gray-500 font-medium mb-1">Intención</p>
                  <p class="text-xs text-gray-700 leading-relaxed">{{ solicitud.intencion }}</p>
                </div>
                -->

                <!-- Menciones (si existen) -->
                <div v-if="solicitud.menciones && solicitud.menciones.length > 0" class="mt-3 pt-3 border-t border-[#E0D5C5]">
                  <p class="text-xs text-gray-500 font-medium mb-2">Menciones</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="mencion in solicitud.menciones"
                      :key="mencion.idmencion"
                      class="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      {{ mencion.descripcion || "Sin descripción" }}
                    </span>
                  </div>
                </div>
              </article>
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
import { ref } from "vue";
import { InputText } from "@/components/inputs";
import { getSolicitudesByDocumento } from "../actions/getSolicitudesByDocumento.action";
import type { ISolicitudDb } from "../interfaces/solicitudDb.interface";
import HeaderSolicitud from "../components/HeaderSolicitud.vue";
import FooterSolicitud from "../components/FooterSolicitud.vue";

const nroDocumento = ref("");
const fieldError = ref<string | undefined>(undefined);
const fetchError = ref("");
const loading = ref(false);
const hasSearched = ref(false);
const solicitudes = ref<ISolicitudDb[]>([]);

const validateDocumento = () => {
  fieldError.value = !nroDocumento.value.trim()
    ? "Ingrese su número de documento"
    : undefined;
};

const onBuscar = async () => {
  fetchError.value = "";
  validateDocumento();
  if (fieldError.value) return;

  loading.value = true;
  hasSearched.value = true;
  try {
    solicitudes.value = await getSolicitudesByDocumento(nroDocumento.value);
  } catch (error) {
    fetchError.value =
      error instanceof Error ? error.message : "No se pudo consultar";
    solicitudes.value = [];
  } finally {
    loading.value = false;
  }
};

const onLimpiar = () => {
  nroDocumento.value = "";
  solicitudes.value = [];
  fieldError.value = undefined;
  fetchError.value = "";
  hasSearched.value = false;
};

const formatDateShort = (value: string | null): string => {
  if (!value) return "-";
  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// const formatMoney = (value: number | null): string => {
//   if (typeof value !== "number") return "0.00";
//   return value.toFixed(2);
// };
// </script>

<style scoped>
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}
</style>
