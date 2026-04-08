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

      <!-- Acciones del header -->
      <div class="flex items-center gap-2 lg:gap-3">
        <!-- Botón de modo oscuro (solo móvil, en desktop está en el dropdown) -->
        <button
          @click="toggleDarkMode"
          class="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar modo oscuro"
        >
          <Sun v-if="darkMode" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <Moon v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <!-- Usuario -->
        <UserDropdown />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebar } from '@/modules/admin/composables/useSidebar';
import { useDarkMode } from '@/composables/useDarkMode';
import { Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-vue-next';
import UserDropdown from './UserDropdown.vue';

const route = useRoute();
const { isExpanded, toggleMobileSidebar, toggleDesktopSidebar } = useSidebar();
const { darkMode, toggleDarkMode } = useDarkMode();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/solicitudes': 'Solicitudes',
    '/misas': 'Misas',
    '/tipos-misa': 'Tipos de Misa',
    '/noticias': 'Noticias',
    '/perfil': 'Mi Perfil',
    '/configuracion': 'Configuración',
  };
  return titles[route.path] || 'Parroquia San Pedro';
});

const handleMobileToggle = () => {
  toggleMobileSidebar();
};

const handleDesktopToggle = () => {
  toggleDesktopSidebar();
};
</script>