<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="relative z-10 flex flex-col min-h-screen">
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-4xl mx-auto">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Mi Perfil
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Administra tu información personal
              </p>
            </div>

            <!-- Profile Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div class="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white font-bold text-3xl">{{ userInitials }}</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.nombre }}</h2>
                  <p class="text-gray-600 dark:text-gray-400">{{ user?.correo }}</p>
                </div>
              </div>

              <!-- Toast de éxito/error -->
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

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      v-model="form.nombre"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      v-model="form.correo"
                      type="email"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="flex gap-3 pt-4">
                  <button
                    type="submit"
                    :disabled="guardando"
                    class="px-6 py-2.5 bg-[#C88A2A] hover:bg-[#B6791F] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      :isOpen="confirmModal.open"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :loading="guardando"
      confirmText="Confirmar"
      loadingText="Guardando..."
      @confirm="executeUpdate"
      @cancel="confirmModal.open = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { actualizarPerfil } from '../actions/actualizarPerfil.action';

interface User {
  idusuarios: number;
  nombre: string;
  correo: string;
}

const user = ref<User | null>(null);
const guardando = ref(false);

const form = ref({
  nombre: '',
  correo: '',
});

const toast = ref({
  visible: false,
  type: 'success' as 'success' | 'error',
  message: '',
});

const confirmModal = ref({
  open: false,
  title: '',
  message: '',
  type: 'info' as 'info' | 'warning' | 'danger' | 'success',
});

const userInitials = computed(() => {
  if (!user.value?.nombre) return 'U';
  const names = user.value.nombre.trim().split(' ').filter(n => n.length > 0);
  if (names.length >= 2) {
    return ((names[0]?.[0] ?? '') + (names[1]?.[0] ?? '')).toUpperCase();
  }
  return (names[0]?.[0] ?? 'U').toUpperCase();
});

const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { visible: true, type, message };
  setTimeout(() => (toast.value.visible = false), 3500);
};

const loadUser = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
      form.value = {
        nombre: user.value?.nombre || '',
        correo: user.value?.correo || '',
      };
    } catch (error) {
      console.error('Error parsing user:', error);
    }
  }
};

const handleSubmit = () => {
  if (!form.value.nombre.trim() || !form.value.correo.trim()) {
    showToast('error', 'Por favor completa todos los campos.');
    return;
  }

  confirmModal.value = {
    open: true,
    title: 'Actualizar Perfil',
    message: '¿Estás seguro de que deseas guardar los cambios en tu perfil?',
    type: 'info',
  };
};

const executeUpdate = async () => {
  if (!user.value?.idusuarios) {
    showToast('error', 'No se encontró el ID del usuario.');
    confirmModal.value.open = false;
    return;
  }

  guardando.value = true;
  try {
    await actualizarPerfil(user.value.idusuarios, {
      nombre: form.value.nombre,
      correo: form.value.correo,
    });

    const updatedUser: User = {
      ...user.value,
      nombre: form.value.nombre,
      correo: form.value.correo,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    user.value = updatedUser;

    confirmModal.value.open = false;
    showToast('success', 'Perfil actualizado correctamente.');
  } catch (error: any) {
    confirmModal.value.open = false;
    showToast('error', error.message || 'Error al actualizar el perfil.');
  } finally {
    guardando.value = false;
  }
};

onMounted(() => {
  loadUser();
});
</script>