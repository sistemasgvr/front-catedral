<template>
  <div class="min-h-screen relative flex flex-col">
    <!-- Background Image with Overlay -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed md:bg-fixed bg-scroll"
      :style="{ backgroundImage: `url('/images/FondoCatedral.jpeg')` }"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/60"></div>
    </div>

    <!-- Admin Login Button (Floating) -->
    <router-link
      to="/login"
      class="fixed top-4 right-4 z-50 group"
      title="Acceso administrativo"
    >
      <div class="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span class="hidden sm:inline text-white text-sm font-medium">Admin</span>
      </div>
    </router-link>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header Section -->
      <header class="flex-shrink-0 flex flex-col items-center justify-center px-4 pt-12 pb-6">
        <!-- Logo -->
        <div class="w-24 h-24 bg-gradient-to-br from-[#C88A2A]/40 to-[#B6791F]/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border-2 border-[#D39E3A]/50 shadow-2xl animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 text-amber-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 2L12 6M12 6L8 10M12 6L16 10M8 10V18H6V22H18V18H16V10M8 10H16M12 10V18M10 22V18M14 22V18"
            />
          </svg>
        </div>

        <!-- Title -->
        <h1 class="text-[clamp(1.75rem,5vw,3rem)] font-serif font-bold text-white mb-3 text-center drop-shadow-2xl animate-slide-up">
          Catedral San Pedro
        </h1>
        <div class="w-20 h-1 bg-gradient-to-r from-transparent via-[#D39E3A] to-transparent rounded mb-4 shadow-md animate-slide-up" style="animation-delay: 0.1s"></div>
        <h2 class="text-[clamp(1.125rem,3.5vw,1.75rem)] text-[#D39E3A] font-semibold mb-2 drop-shadow-lg animate-slide-up" style="animation-delay: 0.2s">Lambayeque</h2>
        <p class="text-amber-100/90 text-center text-[clamp(0.875rem,2.5vw,1.125rem)] max-w-md drop-shadow-md animate-slide-up" style="animation-delay: 0.3s">
          Sistema de solicitudes de misas y celebraciones
        </p>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex justify-center items-start px-4 py-6">
        <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Actions Card -->
          <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-[#D39E3A]/30 h-fit animate-slide-up" style="animation-delay: 0.4s">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Servicios Disponibles
            </h3>

            <div class="space-y-3">
              <!-- Nueva Solicitud -->
              <router-link
                to="/nueva-solicitud"
                class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#C88A2A] to-[#B6791F] hover:from-[#B6791F] hover:to-[#A56810] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-base">Nueva Solicitud</p>
                    <p class="text-xs text-white/80">Solicita una misa o celebración</p>
                  </div>
                </div>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>

              <!-- Consultar Solicitud -->
              <router-link
                to="/consultar"
                class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#8C1D40] to-[#741735] hover:from-[#741735] hover:to-[#5C1129] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-base">Consultar Solicitud</p>
                    <p class="text-xs text-white/80">Verifica el estado de tu solicitud</p>
                  </div>
                </div>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>

              <!-- Menciones -->
              <router-link
                to="/menciones"
                class="group w-full min-h-[56px] flex items-center justify-between gap-3 bg-gradient-to-r from-[#4A4A4A] to-[#333333] hover:from-[#333333] hover:to-[#1F1F1F] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-base">Menciones</p>
                    <p class="text-xs text-white/80">Consulta las menciones programadas</p>
                  </div>
                </div>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- News Card -->
          <div class="animate-slide-up" style="animation-delay: 0.5s">
            <NewsSection />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="flex-shrink-0 text-center py-6 px-4 border-t border-white/10 backdrop-blur-sm">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-amber-200/70 text-sm">
          <p class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lambayeque, Perú
          </p>
          <span class="hidden sm:inline text-amber-200/40">•</span>
          <p>© 2026 Catedral San Pedro</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import NewsSection from '@/components/NewsSection.vue';
</script>

<style scoped>
/* Fix para background-attachment en móvil */
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}

/* Animaciones */
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