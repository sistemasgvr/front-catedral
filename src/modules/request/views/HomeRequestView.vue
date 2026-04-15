<template>
  <div class="min-h-screen relative flex flex-col">
    <!-- Background -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url('/images/FondoParroquia.png')` }">
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/60"></div>
    </div>

    <div class="fixed top-4 right-4 z-50 flex items-center gap-2">
      <!-- Boton de modo oscuro -->
      <button @click="toggleDarkMode"
        class="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl group"
        title="Cambiar modo de color">
        <Icon v-if="darkMode" icon="mdi:weather-sunny" class="w-5 h-5 text-white" aria-hidden="true" />
        <Icon v-else icon="mdi:weather-night" class="w-5 h-5 text-white" aria-hidden="true" />
      </button>

      <router-link to="/login" class="group" title="Acceso administrativo">
        <div
          class="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl">
          <Icon icon="mdi:lock-outline" class="w-5 h-5 text-white" aria-hidden="true" />
          <span class="hidden sm:inline text-white text-sm font-medium">Admin</span>
        </div>
      </router-link>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">

      <!-- Header -->
      <header class="flex-shrink-0 flex flex-col items-center justify-center px-4 pt-12 pb-6">
        <!-- <div class="w-24 h-24 ... rounded-full ... animate-fade-in">
          <Icon icon="mdi:church" class="w-12 h-12 text-amber-200" aria-hidden="true" />
        </div> -->
        <h1
          class="text-[clamp(1.75rem,5vw,3rem)] font-serif font-bold text-white mb-3 text-center drop-shadow-2xl animate-slide-up">
          Parroquia San Pedro
        </h1>
        <div
          class="w-20 h-1 bg-gradient-to-r from-transparent via-[#D39E3A] to-transparent rounded mb-4 shadow-md animate-slide-up"
          style="animation-delay: 0.1s"></div>
        <h2
          class="text-[clamp(1.125rem,3.5vw,1.75rem)] text-[#D39E3A] font-semibold mb-2 drop-shadow-lg animate-slide-up"
          style="animation-delay: 0.2s">Mórrope</h2>
        <p class="text-amber-100/90 text-center text-[clamp(0.875rem,2.5vw,1.125rem)] max-w-md drop-shadow-md animate-slide-up"
          style="animation-delay: 0.3s">
          Sistema de solicitudes de misas y celebraciones
        </p>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 flex flex-col items-center px-4 py-6 gap-6">

        <!-- Tarjeta de acciones - Servicios disponibles -->
        <div
          class="w-full max-w-xl p-6 transition-all duration-300 border shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border-[#D39E3A]/30 dark:border-[#D39E3A]/20 animate-slide-up shadow-black/5 dark:shadow-black/40"
          style="animation-delay: 0.4s">

          <h3 class="flex items-center gap-2 mb-6 text-xl font-bold text-gray-800 transition-colors dark:text-white">
            <Icon icon="mdi:lightning-bolt-outline" class="w-6 h-6 text-[#C88A2A]" aria-hidden="true" />
            Servicios Disponibles
          </h3>

          <div class="space-y-3">
            <router-link to="/nueva-solicitud"
              class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#C88A2A] to-[#B6791F] hover:from-[#B6791F] hover:to-[#A56810] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/20 group-hover:bg-white/30">
                  <Icon icon="mdi:plus" class="w-5 h-5" aria-hidden="true" />
                </div>
                <div class="text-left">
                  <p class="text-base font-bold">Nueva Solicitud</p>
                  <p class="text-xs text-white/80">Solicita una misa o celebración</p>
                </div>
              </div>
              <Icon icon="mdi:chevron-right"
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </router-link>

            <router-link to="/consultar"
              class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#8C1D40] to-[#741735] hover:from-[#741735] hover:to-[#5C1129] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/20 group-hover:bg-white/30">
                  <Icon icon="mdi:magnify" class="w-5 h-5" aria-hidden="true" />
                </div>
                <div class="text-left">
                  <p class="text-base font-bold">Consultar Solicitud</p>
                  <p class="text-xs text-white/80">Verifica el estado de tu solicitud</p>
                </div>
              </div>
              <Icon icon="mdi:chevron-right"
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </router-link>

            <router-link to="/menciones"
              class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#4A4A4A] to-[#333333] hover:from-[#333333] hover:to-[#1F1F1F] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-white/20 group-hover:bg-white/30">
                  <Icon icon="mdi:calendar-month-outline" class="w-5 h-5" aria-hidden="true" />
                </div>
                <div class="text-left">
                  <p class="text-base font-bold">Misas Comunitarias</p>
                  <p class="text-xs text-white/80">Solicita mencion(es) en una misa pública</p>
                </div>
              </div>
              <Icon icon="mdi:chevron-right"
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </router-link>
          </div>
        </div>

        <!-- News Slider — full width below -->
        <div class="w-full max-w-5xl animate-slide-up" style="animation-delay: 0.55s">
          <NewsSection />
        </div>

      </main>

      <!-- Footer -->
      <footer class="flex-shrink-0 text-center py-6 px-4 border-t border-white/10 backdrop-blur-sm">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-amber-200/70 text-sm">
          <p class="flex items-center gap-2">
            <Icon icon="mdi:map-marker-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
            Mórrope, Lambayeque - Perú
          </p>
          <span class="hidden sm:inline text-amber-200/40">•</span>
          <p>© 2026 Parroquia San Pedro</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import NewsSection from '@/components/NewsSection.vue';
import { useDarkMode } from '@/composables/useDarkMode';

// Extraemos las propiedades y métodos del composable
const { darkMode, toggleDarkMode, initDarkMode } = useDarkMode();

onMounted(() => {
  // Inicializamos el modo oscuro al cargar esta vista
  initDarkMode();
});
</script>

<style scoped>
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
  animation-fill-mode: both;
}
</style>