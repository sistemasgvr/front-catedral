<template>
  <AdminLayout>
    <div class="relative flex min-h-screen flex-col">
      <div class="relative z-10 flex min-h-screen flex-col">
        <main class="flex-1 px-4 py-6">
          <div class="mx-auto w-full max-w-5xl">
            <!-- Cabecera -->
            <div
              class="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white to-amber-50/40 shadow-lg transition-colors dark:border-gray-700 dark:from-gray-800 dark:to-amber-950/20"
            >
              <div class="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div class="flex min-w-0 flex-1 gap-4">
                  <div
                    class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C88A2A]/15 text-[#C88A2A] dark:bg-[#C88A2A]/25 dark:text-[#E8B86A]"
                    aria-hidden="true"
                  >
                    <Icon icon="mdi:qrcode-scan" class="h-8 w-8" />
                  </div>
                  <div class="min-w-0">
                    <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                      Código QR del portal web
                    </h1>
                    <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                      Código listo para imprimir o compartir.
                      <!-- <code
                        class="rounded-md bg-gray-200/80 px-1.5 py-0.5 text-xs font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        VITE_PUBLIC_WEB_URL
                      </code> -->
                      
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error de configuración -->
            <div
              v-if="configError"
              class="mb-6 flex gap-4 rounded-xl border border-amber-200 bg-amber-50/90 p-5 dark:border-amber-800/60 dark:bg-amber-950/30"
              role="alert"
            >
              <Icon
                icon="mdi:alert-circle-outline"
                class="mt-0.5 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-400"
                aria-hidden="true"
              />
              <p class="text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-100">
                {{ configError }}
              </p>
            </div>

            <!-- Contenido principal -->
            <div
              v-else
              class="grid gap-6 lg:grid-cols-12 lg:items-start"
            >
              <!-- Columna enlace y ayuda -->
              <div class="space-y-6 lg:col-span-5">
                <section
                  class="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6"
                >
                  <h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Icon icon="mdi:link-variant" class="h-5 w-5 text-[#C88A2A]" aria-hidden="true" />
                    URL de destino
                  </h2>
                  <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Es la dirección que se abrirá al escanear el código (misma que usa el visitante en el navegador).
                  </p>
                  <div
                    class="rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-600 dark:bg-gray-900/40"
                  >
                    <a
                      :href="resolvedUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="block break-all text-sm font-medium text-[#C88A2A] underline-offset-2 hover:underline dark:text-[#E8B86A]"
                    >
                      {{ resolvedUrl }}
                    </a>
                  </div>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                      @click="copiarUrl"
                    >
                      <Icon
                        :icon="copiado ? 'mdi:check' : 'mdi:content-copy'"
                        class="h-5 w-5 shrink-0"
                        :class="copiado ? 'text-emerald-600 dark:text-emerald-400' : ''"
                        aria-hidden="true"
                      />
                      {{ copiado ? 'Copiado al portapapeles' : 'Copiar URL' }}
                    </button>
                    <a
                      :href="resolvedUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon icon="mdi:open-in-new" class="h-5 w-5 shrink-0" aria-hidden="true" />
                      Abrir sitio
                    </a>
                  </div>
                </section>

                <section
                  class="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-5 dark:border-gray-600 dark:bg-gray-900/30 sm:p-6"
                >
                  <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Consejos
                  </h2>
                  <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li class="flex gap-2">
                      <Icon icon="mdi:printer-outline" class="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                      <span>Impresión en blanco y negro: el margen blanco alrededor del QR ayuda a que los lectores lo detecten bien.</span>
                    </li>
                    <li class="flex gap-2">
                      <Icon icon="mdi:image-size-select-large" class="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                      <span>El PNG se genera a buena resolución; evita reducirlo demasiado en el diseño.</span>
                    </li>
                    <!-- <li class="flex gap-2">
                      <Icon icon="mdi:cog-outline" class="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                      <span>Si cambias la URL en <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">.env</code>, vuelve a cargar esta página para regenerar el código.</span>
                    </li> -->
                  </ul>
                </section>
              </div>

              <!-- Columna QR -->
              <div class="lg:col-span-7">
                <div
                  class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-8"
                >
                  <div class="flex flex-col items-center">
                    <div
                      class="relative rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-inner ring-1 ring-black/5 dark:border-gray-600 dark:bg-white dark:ring-white/10"
                      aria-live="polite"
                    >
                      <div
                        v-if="generando"
                        class="flex h-64 w-64 flex-col items-center justify-center gap-3 text-gray-500 sm:h-72 sm:w-72"
                      >
                        <Icon icon="mdi:loading" class="h-10 w-10 animate-spin text-[#C88A2A]" aria-hidden="true" />
                        <span class="text-sm font-medium">Generando código…</span>
                      </div>
                      <div
                        v-else-if="generarError"
                        class="flex h-64 w-64 flex-col items-center justify-center gap-3 px-4 text-center sm:h-72 sm:w-72"
                      >
                        <Icon
                          icon="mdi:alert-circle-outline"
                          class="h-10 w-10 text-red-500 dark:text-red-400"
                          aria-hidden="true"
                        />
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ generarError }}
                        </p>
                        <button
                          type="button"
                          class="rounded-lg bg-[#C88A2A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B6791F]"
                          @click="reintentarQr"
                        >
                          Reintentar
                        </button>
                      </div>
                      <img
                        v-else-if="qrDataUrl"
                        :src="qrDataUrl"
                        width="288"
                        height="288"
                        class="block h-64 w-64 sm:h-72 sm:w-72"
                        alt="Código QR del portal web"
                      />
                    </div>

                    <p
                      v-if="qrDataUrl && !generando && !generarError"
                      class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400"
                    >
                      Vista prevía · 320 px de lado · corrección de errores media (M)
                    </p>

                    <div class="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                      <button
                        type="button"
                        :disabled="!qrDataUrl || generando"
                        class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C88A2A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B6791F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:flex-initial sm:min-w-[200px]"
                        @click="descargarPng"
                      >
                        <Icon icon="mdi:tray-arrow-down" class="h-5 w-5 shrink-0" aria-hidden="true" />
                        Descargar PNG
                      </button>
                    </div>
                  </div>
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
import { Icon } from '@iconify/vue';
import QRCode from 'qrcode';
import AdminLayout from '../layouts/AdminLayout.vue';

const qrDataUrl = ref<string | null>(null);
const generando = ref(false);
const generarError = ref('');
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
  generarError.value = '';
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
    generarError.value =
      'No se pudo generar el código QR. Comprueba la URL o inténtalo de nuevo.';
  } finally {
    generando.value = false;
  }
}

function reintentarQr() {
  void generarQr();
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
