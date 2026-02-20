<template>
  <div class="min-h-screen relative flex flex-col">
    <!-- Background Image with Overlay -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed md:bg-fixed bg-scroll"
      :style="{ backgroundImage: `url('/images/FondoCatedral.jpeg')` }"
    >
      <div class="absolute inset-0 bg-black/45"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header Section -->
      <header class="flex-1 flex flex-col items-center justify-center px-4 pt-8">
        <!-- Logo -->
        <div class="w-20 h-20 bg-[#C88A2A]/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border-2 border-[#D39E3A]/50 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 text-amber-200"
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
        <h1 class="text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold text-white mb-2 text-center drop-shadow-lg">
          Iglesia de San Pedro
        </h1>
        <div class="w-16 h-1 bg-[#D39E3A] rounded mb-3 shadow-md"></div>
        <h2 class="text-[clamp(1rem,3vw,1.5rem)] text-[#D39E3A] font-semibold mb-2 drop-shadow-md">Lambayeque</h2>
        <p class="text-amber-100/90 text-center text-[clamp(0.875rem,2vw,1rem)] drop-shadow-sm">
          Sistema de solicitudes de misas y celebraciones
        </p>
      </header>

      <!-- Main Card Section -->
      <main class="flex justify-center px-4 py-8">
        <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-[420px] border border-[#D39E3A]/30">
          <!-- Buttons -->
          <div class="space-y-3 md:space-y-4">
            <!-- Nueva Solicitud - Dorado/Ámbar -->
            <router-link
              to="/nueva-solicitud"
              class="w-full min-h-[48px] flex items-center justify-center gap-3 bg-[#C88A2A] hover:bg-[#B6791F] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L12 6M12 6L8 10M12 6L16 10M8 10V18H6V22H18V18H16V10M8 10H16" />
              </svg>
              Nueva Solicitud
            </router-link>

            <!-- Consultar Solicitud - Vino/Burdeos -->
            <router-link
              to="/consultar"
              class="w-full min-h-[48px] flex items-center justify-center gap-3 bg-[#8C1D40] hover:bg-[#741735] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Consultar Solicitud
            </router-link>

            <!-- Menciones - Gris oscuro cálido -->
            <router-link
              to="/menciones"
              class="w-full min-h-[48px] flex items-center justify-center gap-3 bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Menciones
            </router-link>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="text-center py-6 px-4">
        <p class="text-amber-200/70 text-xs drop-shadow-sm">© 2026 Iglesia San Pedro de Lambayeque, Perú</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Fix para background-attachment en móvil */
@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll !important;
  }
}
</style>
