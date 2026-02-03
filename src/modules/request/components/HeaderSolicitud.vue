<template>
  <header class="bg-gradient-to-r from-[#B6791F]/50 to-[#C88A2A]/50 backdrop-blur-sm py-6 px-4 shadow-lg">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="text-center flex-1">
        <h1 class="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-md">
          Iglesia de San Pedro de Lambayeque
        </h1>
        <p class="text-amber-100/90 text-sm mt-1">Nueva Solicitud de Misa</p>
      </div>
      <router-link 
        to="/" 
        class="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300"
        title="Volver al inicio"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-sm font-medium hidden sm:inline">Inicio</span>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
