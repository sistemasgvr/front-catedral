<template>
  <div ref="dropdownRef" class="relative">
    <!-- Trigger Button -->
    <button 
      @click="toggle"
      class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
      </div>
      <ChevronDown 
        :class="[
          'w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-200 hidden sm:block',
          isOpen ? 'rotate-180' : ''
        ]" 
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ user?.nombre || 'Usuario' }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
            {{ user?.correo || 'usuario@ejemplo.com' }}
          </p>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <!-- Perfil -->
          <button
            @click="goToProfile"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <User class="w-4 h-4" />
            Mi Perfil
          </button>

          <!-- Configuración (solo administradores) -->
          <button
            v-if="isAdmin"
            @click="goToSettings"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
          >
            <Settings class="w-4 h-4" />
            Configuración
          </button>

          <!-- Divider -->
          <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Modo Oscuro -->
          <button
            @click="toggleDarkMode"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span class="flex items-center gap-3">
              <Sun v-if="darkMode" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
              Modo {{ darkMode ? 'Claro' : 'Oscuro' }}
            </span>
            <div 
              :class="[
                'w-9 h-5 rounded-full transition-colors relative',
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            >
              <div 
                :class="[
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  darkMode ? 'translate-x-4' : 'translate-x-0.5'
                ]"
              ></div>
            </div>
          </button>

          <!-- Divider -->
          <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Cerrar Sesión -->
          <button
            @click="handleLogout"
            class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
          >
            <LogOut class="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ChevronDown, User, Settings, Sun, Moon, LogOut } from 'lucide-vue-next';
import { useDropdown } from '@/modules/admin/composables/useDropdown';
import { useDarkMode } from '@/composables/useDarkMode';
import { useUserStore } from '@/modules/admin/stores/user.store';
import { clearSession } from '@/utils/auth';

const { isOpen, toggle, close } = useDropdown();
const { darkMode, toggleDarkMode } = useDarkMode();
const router = useRouter();

const userStore = useUserStore();
const { user, userInitials, isAdmin } = storeToRefs(userStore);

const goToProfile = () => {
  close();
  router.push('/perfil');
};

const goToSettings = () => {
  close();
  router.push('/configuracion');
};

const handleLogout = async () => {
  if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;
  await clearSession();
  localStorage.removeItem('token');
  router.push('/login');
  close();
};

onMounted(() => {
  userStore.loadFromStorage();
});
</script>