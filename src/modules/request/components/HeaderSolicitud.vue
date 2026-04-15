<template>
  <header class="bg-gradient-to-r from-[#B6791F]/50 to-[#C88A2A]/50 backdrop-blur-sm py-6 px-4 shadow-lg">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="text-center flex-1">
        <h1 class="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-md">
          Parroquia de San Pedro, Mórrope
        </h1>
        <p class="text-amber-100/90 text-sm mt-1">Nueva Solicitud de Misa</p>
      </div>
      <router-link 
        to="/" 
        class="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300"
        title="Volver al inicio"
        @click="onGoHome"
      >
        <Icon icon="mdi:home-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
        <span class="text-sm font-medium hidden sm:inline">Inicio</span>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSolicitudStore } from "../stores/solicitud.store";

const store = useSolicitudStore();

const onGoHome = () => {
  const wasRegistered = localStorage.getItem("solicitud_registered") === "true";
  if (wasRegistered) {
    store.limpiarDatosSolicitud();
  }
};
</script>

<style scoped>
</style>
