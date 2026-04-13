<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="relative z-10 flex flex-col min-h-screen">
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-2xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Código QR del portal web
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Genera y descarga un código QR que dirige a la URL pública del sistema. La dirección se define en
                <code class="text-sm bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">VITE_PUBLIC_WEB_URL</code>.
              </p>
            </div>

            <div
              v-if="configError"
              class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5 mb-6"
            >
              <p class="text-sm font-medium text-amber-900 dark:text-amber-200">
                {{ configError }}
              </p>
            </div>

            <div
              v-else
              class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 transition-colors space-y-6"
            >
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  URL destino
                </p>
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                  <a
                    :href="resolvedUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#C88A2A] dark:text-[#E8B86A] font-medium text-sm break-all hover:underline flex-1 min-w-0"
                  >
                    {{ resolvedUrl }}
                  </a>
                  <button
                    type="button"
                    class="shrink-0 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    @click="copiarUrl"
                  >
                    {{ copiado ? 'Copiado' : 'Copiar' }}
                  </button>
                </div>
              </div>

              <div class="flex flex-col items-center gap-6">
                <div
                  class="rounded-xl p-4 sm:p-6 bg-white border border-gray-200 shadow-inner"
                  aria-live="polite"
                >
                  <div
                    v-if="generando"
                    class="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center text-gray-500 text-sm"
                  >
                    Generando código…
                  </div>
                  <img
                    v-else-if="qrDataUrl"
                    :src="qrDataUrl"
                    width="288"
                    height="288"
                    class="w-64 h-64 sm:w-72 sm:h-72 block"
                    alt="Código QR del portal web"
                  />
                </div>

                <div class="flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    type="button"
                    :disabled="!qrDataUrl || generando"
                    class="px-5 py-3 bg-[#C88A2A] text-white font-semibold rounded-lg hover:bg-[#B6791F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    @click="descargarPng"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Descargar PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import QRCode from 'qrcode';
import AdminLayout from '../layouts/AdminLayout.vue';

const qrDataUrl = ref<string | null>(null);
const generando = ref(false);
const copiado = ref(false);
let copiadoTimer: ReturnType<typeof setTimeout> | null = null;

function parsePublicWebUrl(): { ok: true; url: string } | { ok: false; message: string } {
  const raw = import.meta.env.VITE_PUBLIC_WEB_URL?.trim();
  if (!raw) {
    return {
      ok: false,
      message:
        'Falta la variable de entorno VITE_PUBLIC_WEB_URL. Añádela al archivo .env (por ejemplo la URL pública del sitio) y reinicia el servidor de desarrollo o vuelve a compilar.',
    };
  }
  try {
    const u = new URL(raw);
    if (!['http:', 'https:'].includes(u.protocol)) {
      return { ok: false, message: 'VITE_PUBLIC_WEB_URL debe usar http o https.' };
    }
    return { ok: true, url: u.toString() };
  } catch {
    return { ok: false, message: 'VITE_PUBLIC_WEB_URL no es una URL válida.' };
  }
}

const urlParse = parsePublicWebUrl();
const resolvedUrl = computed(() => (urlParse.ok ? urlParse.url : ''));
const configError = computed(() => (urlParse.ok ? '' : urlParse.message));

async function generarQr() {
  if (!urlParse.ok) {
    qrDataUrl.value = null;
    return;
  }
  generando.value = true;
  qrDataUrl.value = null;
  try {
    qrDataUrl.value = await QRCode.toDataURL(urlParse.url, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#111827', light: '#ffffff' },
    });
  } catch (e) {
    console.error('Error generando QR:', e);
    qrDataUrl.value = null;
  } finally {
    generando.value = false;
  }
}

watch(
  resolvedUrl,
  () => {
    void generarQr();
  },
  { immediate: true }
);

onUnmounted(() => {
  if (copiadoTimer) clearTimeout(copiadoTimer);
});

function descargarPng() {
  if (!qrDataUrl.value) return;
  const a = document.createElement('a');
  a.href = qrDataUrl.value;
  a.download = 'codigo-qr-portal-web.png';
  a.rel = 'noopener';
  a.click();
}

async function copiarUrl() {
  if (!urlParse.ok) return;
  try {
    await navigator.clipboard.writeText(urlParse.url);
    copiado.value = true;
    if (copiadoTimer) clearTimeout(copiadoTimer);
    copiadoTimer = setTimeout(() => {
      copiado.value = false;
      copiadoTimer = null;
    }, 2000);
  } catch {
    copiado.value = false;
  }
}
</script>
