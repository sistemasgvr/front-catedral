<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="relative z-10 flex flex-col min-h-screen">
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-4xl mx-auto">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Configuración
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Personaliza tu experiencia en el sistema
              </p>
            </div>

            <!-- Toast -->
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-300"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-if="toast.visible"
                :class="[
                  'mb-4 px-4 py-3 rounded-lg text-sm font-medium',
                  toast.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                ]"
              >
                {{ toast.message }}
              </div>
            </Transition>

            <div class="space-y-6">
              <!-- Apariencia -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Apariencia
                </h2>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Activa el tema oscuro</p>
                  </div>
                  <button
                    @click="toggleDarkMode"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      darkMode ? 'bg-blue-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Seguridad -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Sesión y Seguridad
                </h2>
                <div class="space-y-3">
                  <!-- Cambiar contraseña -->
                  <button
                    @click="abrirCambioContrasena"
                    class="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <p class="font-medium text-gray-900 dark:text-white">Cambiar Contraseña</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Actualiza tu contraseña de acceso</p>
                  </button>

                  <!-- Cerrar sesión -->
                  <button
                    @click="confirmarLogout"
                    class="w-full px-4 py-3 text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <p class="font-medium text-red-600 dark:text-red-400">Cerrar Sesión</p>
                    <p class="text-sm text-red-600/70 dark:text-red-400/70">Sal de tu cuenta</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modalContrasena.open"
          class="fixed inset-0 z-[9999999] overflow-y-auto"
          @click.self="cerrarModalContrasena"
        >
          <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[2px]"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="modalContrasena.open"
                class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[10000000]"
                @click.stop
              >
                <div class="p-6">
                  <!-- Icono -->
                  <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>

                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                    Cambiar Contraseña
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Ingresa tu nueva contraseña
                  </p>

                  <!-- Error interno del modal -->
                  <Transition
                    enter-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 -translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                  >
                    <p
                      v-if="modalContrasena.error"
                      class="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                    >
                      {{ modalContrasena.error }}
                    </p>
                  </Transition>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        v-model="formContrasena.nueva"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar Contraseña
                      </label>
                      <input
                        v-model="formContrasena.confirmar"
                        type="password"
                        placeholder="Repite la contraseña"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div class="flex gap-3 mt-6">
                    <button
                      @click="cerrarModalContrasena"
                      :disabled="guardandoContrasena"
                      class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      @click="handleCambiarContrasena"
                      :disabled="guardandoContrasena"
                      class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <div v-if="guardandoContrasena" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {{ guardandoContrasena ? 'Guardando...' : 'Guardar' }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirm Modal Logout -->
    <ConfirmModal
      :isOpen="logoutModal.open"
      title="Cerrar Sesión"
      message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema."
      type="danger"
      confirmText="Cerrar Sesión"
      cancelText="Cancelar"
      @confirm="executeLogout"
      @cancel="logoutModal.open = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { useDarkMode } from '@/composables/useDarkMode';
import { cambiarContrasena } from '../actions/cambiarContrasena.action';

const router = useRouter();
const { darkMode, toggleDarkMode } = useDarkMode();

const toast = ref({
  visible: false,
  type: 'success' as 'success' | 'error',
  message: '',
});

const logoutModal = ref({ open: false });

const modalContrasena = ref({
  open: false,
  error: '',
});

const formContrasena = ref({
  nueva: '',
  confirmar: '',
});

const guardandoContrasena = ref(false);

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { visible: true, type, message };
  setTimeout(() => (toast.value.visible = false), 3500);
};

const confirmarLogout = () => {
  logoutModal.value.open = true;
};

const executeLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  router.push('/login');
};

const abrirCambioContrasena = () => {
  formContrasena.value = { nueva: '', confirmar: '' };
  modalContrasena.value = { open: true, error: '' };
};

const cerrarModalContrasena = () => {
  if (!guardandoContrasena.value) {
    modalContrasena.value.open = false;
  }
};

const handleCambiarContrasena = async () => {
  modalContrasena.value.error = '';

  if (!formContrasena.value.nueva || formContrasena.value.nueva.length < 6) {
    modalContrasena.value.error = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  if (formContrasena.value.nueva !== formContrasena.value.confirmar) {
    modalContrasena.value.error = 'Las contraseñas no coinciden.';
    return;
  }

  const savedUser = localStorage.getItem('user');
  if (!savedUser) {
    modalContrasena.value.error = 'No se encontró la sesión del usuario.';
    return;
  }

  const user = JSON.parse(savedUser);

  guardandoContrasena.value = true;
  try {
    await cambiarContrasena(user.idusuarios, formContrasena.value.nueva);
    modalContrasena.value.open = false;
    showToast('success', 'Contraseña actualizada correctamente.');
  } catch (error: any) {
    modalContrasena.value.error = error.message || 'Error al cambiar la contraseña.';
  } finally {
    guardandoContrasena.value = false;
  }
};
</script>