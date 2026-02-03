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
      <header
        class="bg-gradient-to-r from-[#8C1D40]/60 to-[#C88A2A]/40 backdrop-blur-sm py-6 px-4 shadow-lg"
      >
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="text-center flex-1">
            <h1
              class="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-md"
            >
              Iglesia de San Pedro de Lambayeque
            </h1>
            <p class="text-amber-100/90 text-sm mt-1">
              Consultar Solicitudes
            </p>
          </div>
          <router-link
            to="/"
            class="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300"
            title="Volver al inicio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="text-sm font-medium hidden sm:inline">Inicio</span>
          </router-link>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 px-4 py-6">
        <div class="w-full max-w-4xl mx-auto space-y-6">
          <!-- Search Card -->
          <section
            class="bg-white rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8"
          >
            <h2
              class="text-xl md:text-2xl font-serif font-bold text-[#8C1D40] mb-2 text-center"
            >
              Consultar por Numero de Documento
            </h2>
            <div class="w-12 h-1 bg-[#8C1D40] rounded mx-auto mb-6"></div>

            <form @submit.prevent="onBuscar" class="space-y-4">
              <InputText
                v-model="nroDocumento"
                name="nroDocumento"
                label="Numero de Documento"
                placeholder="Ingrese su numero de documento"
                :required="true"
                :maxlength="20"
                :error-message="fieldError"
                @blur="validateDocumento"
              />

              <div class="flex flex-wrap gap-3">
                <button
                  type="submit"
                  class="min-h-[44px] px-6 rounded-lg bg-[#8C1D40] hover:bg-[#741735] text-white font-semibold transition-all duration-300"
                  :disabled="loading"
                >
                  {{ loading ? "Buscando..." : "Buscar" }}
                </button>
                <button
                  type="button"
                  class="min-h-[44px] px-6 rounded-lg bg-white border border-[#E0D5C5] text-[#4A4A4A] font-semibold hover:bg-[#F5F0E8] transition-all duration-300"
                  @click="onLimpiar"
                  :disabled="loading"
                >
                  Limpiar
                </button>
              </div>

              <p v-if="fetchError" class="text-sm text-red-500">
                {{ fetchError }}
              </p>
            </form>
          </section>

          <!-- Results -->
          <section
            class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-[#4A4A4A]">
                Resultados
              </h3>
              <span
                v-if="hasSearched"
                class="text-sm text-[#8C1D40] font-semibold"
              >
                {{ solicitudes.length }} solicitud(es)
              </span>
            </div>

            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <div
              v-else-if="hasSearched && solicitudes.length === 0"
              class="text-center py-10 text-gray-500"
            >
              No se encontraron solicitudes para ese documento.
            </div>

            <div v-else class="space-y-4">
              <article
                v-for="solicitud in solicitudes"
                :key="solicitud.idsolicitud"
                class="p-4 border border-[#E0D5C5] rounded-lg bg-white"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h4 class="text-[#4A4A4A] font-semibold">
                      Solicitud #{{ solicitud.idsolicitud }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{ solicitud.nombres }} {{ solicitud.apellidos }}
                    </p>
                  </div>
                  <span
                    class="text-xs px-2 py-1 rounded-full font-semibold"
                    :class="
                      solicitud.estado
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                  >
                    {{ solicitud.estado ? "Activa" : "Inactiva" }}
                  </span>
                </div>

                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div class="text-gray-600">
                    <strong>Documento:</strong>
                    {{ solicitud.nrodocumento }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Estado proceso:</strong>
                    {{ solicitud.estado_proceso?.nombre || "-" }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Fecha solicitud:</strong>
                    {{ formatDate(solicitud.fechasolicitud || solicitud.fechacreacion) }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Fecha misa:</strong>
                    {{ formatDate(solicitud.fechamisadeseada || solicitud.fechacelebracion) }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Tipo de misa:</strong>
                    {{ solicitud.tipomisa?.nombre || "-" }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Horario:</strong>
                    {{ solicitud.horario?.nombre || "-" }}
                  </div>
                  <div class="text-gray-600">
                    <strong>Monto total:</strong>
                    S/ {{ formatMoney(solicitud.montototal) }}
                  </div>
                  <div class="text-gray-600 md:col-span-2">
                    <strong>Intencion:</strong>
                    {{ solicitud.intencion || "-" }}
                  </div>
                  <div class="text-gray-600 md:col-span-2">
                    <strong>Menciones:</strong>
                    <span v-if="(solicitud.menciones?.length || 0) === 0">-</span>
                    <div v-else class="flex flex-wrap gap-2 mt-1">
                      <span
                        v-for="mencion in solicitud.menciones"
                        :key="mencion.idmencion"
                        class="text-xs px-2 py-1 rounded-full bg-[#FFF5E6] text-[#8C1D40] border border-[#D39E3A]/40"
                      >
                        {{ mencion.descripcion || "Sin descripcion" }}
                      </span>
                    </div>
                  </div>
                  <div v-if="solicitud.voucherpago" class="text-gray-600">
                    <strong>Voucher:</strong>
                    <a
                      :href="solicitud.voucherpago"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[#8C1D40] underline"
                    >
                      Ver comprobante
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer -->
      <footer class="text-center py-6 px-4">
        <p class="text-[#D39E3A] text-sm mb-1 drop-shadow-md">
          Que Dios los bendiga
        </p>
        <p class="text-amber-200/70 text-xs drop-shadow-sm">
          © 2026 Iglesia San Pedro de Lambayeque
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InputText } from "@/components/inputs";
import { getSolicitudesByDocumento } from "../actions/getSolicitudesByDocumento.action";
import type { ISolicitudDb } from "../interfaces/solicitudDb.interface";

const nroDocumento = ref("");
const fieldError = ref<string | undefined>(undefined);
const fetchError = ref("");
const loading = ref(false);
const hasSearched = ref(false);
const solicitudes = ref<ISolicitudDb[]>([]);

const validateDocumento = () => {
  fieldError.value = !nroDocumento.value.trim()
    ? "Ingrese su numero de documento"
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

const formatDate = (value: string | null): string => {
  if (!value) return "-";
  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatMoney = (value: number | null): string => {
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
};
</script>

<style scoped>
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}
</style>
