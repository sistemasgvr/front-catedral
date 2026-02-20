<template>
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
        v-if="isOpen"
        class="fixed inset-0 z-[99999] overflow-y-auto"
        @click.self="cancelar"
      >
        <!-- Backdrop con Blur -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-all"></div>

        <!-- Modal Container -->
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
              v-if="isOpen"
              class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[100000]"
              @click.stop
            >
              <!-- Icon -->
              <div class="p-6 text-center">
                <div :class="iconContainerClass" class="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4">
                  <component :is="iconComponent" :class="iconClass" class="w-8 h-8" />
                </div>

                <!-- Title -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ title }}
                </h3>

                <!-- Message -->
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  {{ message }}
                </p>

                <!-- Actions -->
                <div class="flex gap-3">
                  <button
                    @click="cancelar"
                    :disabled="loading"
                    class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                    @click="confirmar"
                    :disabled="loading"
                    :class="confirmButtonClass"
                    class="flex-1 px-4 py-2.5 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {{ loading ? loadingText : confirmText }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  loading?: boolean;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  loadingText: 'Procesando...',
  loading: false,
  type: 'warning',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const iconComponent = computed(() => {
  const icons = {
    danger: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
    ]),
    warning: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    info: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    success: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
  };
  return icons[props.type];
});

const iconContainerClass = computed(() => {
  const classes = {
    danger: 'bg-red-100 dark:bg-red-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
  };
  return classes[props.type];
});

const iconClass = computed(() => {
  const classes = {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
  };
  return classes[props.type];
});

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  return classes[props.type];
});

const confirmar = () => {
  if (!props.loading) {
    emit('confirm');
  }
};

const cancelar = () => {
  if (!props.loading) {
    emit('cancel');
  }
};
</script>