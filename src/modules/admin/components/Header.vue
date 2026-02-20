<template>
  <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex items-center justify-between px-4 lg:px-6 py-3">
      <!-- Botón hamburguesa para móvil -->
      <button
        @click="handleMobileToggle"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu class="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <!-- Botón toggle para desktop -->
      <button
        @click="handleDesktopToggle"
        class="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Alternar sidebar"
      >
        <PanelLeftClose v-if="isExpanded" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <PanelLeftOpen v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      <!-- Título o breadcrumb -->
      <div class="flex-1 flex items-center justify-center lg:justify-start lg:ml-4">
        <h1 class="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- Acciones del header (notificaciones, perfil, etc.) -->
      <div class="flex items-center gap-2 lg:gap-3">
        <!-- Botón de modo oscuro -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar modo oscuro"
        >
          <Sun v-if="darkMode" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <Moon v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <!-- Botón de notificaciones -->
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          aria-label="Notificaciones"
        >
          <Bell class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Botón de configuración -->
        <button
          class="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Configuración"
        >
          <Settings class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <!-- Avatar de usuario -->
        <button class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="text-white font-semibold text-sm">JD</span>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { useDarkMode } from '@/composables/useDarkMode'
import { Menu, PanelLeftClose, PanelLeftOpen, Bell, Settings, Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const { isExpanded, toggleMobileSidebar, toggleDesktopSidebar } = useSidebar()
const { darkMode, toggleDarkMode } = useDarkMode()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/solicitudes': 'Solicitudes',
    '/misas': 'Misas',
  }
  return titles[route.path] || 'Catedral San Pedro'
})

const handleMobileToggle = () => {
  console.log('Mobile toggle clicked')
  toggleMobileSidebar()
}

const handleDesktopToggle = () => {
  console.log('Desktop toggle clicked')
  toggleDesktopSidebar()
}
</script>