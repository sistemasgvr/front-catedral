<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <SideBar />
    
    <div 
      :class="[
        'flex flex-col flex-1 overflow-hidden transition-all duration-300',
        {
          'lg:ml-[290px]': isExpanded,
          'lg:ml-[90px]': !isExpanded,
        }
      ]"
    >
      <Header />
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div class="container mx-auto px-4 py-6 lg:px-6">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SideBar from '../components/SideBar.vue'
import Header from '../components/Header.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useDarkMode } from '@/composables/useDarkMode'

const { isExpanded } = useSidebar()
const { initDarkMode } = useDarkMode()

// Inicializar modo oscuro al montar el layout
onMounted(() => {
  initDarkMode()
})
</script>

<style scoped>
/* Contenedor principal con scroll suave */
main {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}

/* Scrollbar personalizado para el contenido principal */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

:global(.dark) main::-webkit-scrollbar-thumb {
  background: #4a5568;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

:global(.dark) main::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Animación de entrada para el contenido */
main > div {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para scroll suave en iOS */
main {
  -webkit-overflow-scrolling: touch;
}

/* Mejora de rendimiento */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>