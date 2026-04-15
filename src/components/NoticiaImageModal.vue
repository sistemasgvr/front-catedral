<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && src"
        class="fixed inset-0 z-[100000] flex items-center justify-center p-4 cursor-zoom-out"
        @click="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/85 backdrop-blur-sm"></div>

        <!-- Image Container -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="isOpen" class="relative z-10 max-w-5xl max-h-[90vh] w-full flex items-center justify-center" @click.stop>
            <img
              :src="src"
              :alt="alt || 'Imagen noticia'"
              class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            <!-- Botón cerrar -->
            <button
              @click="$emit('close')"
              class="absolute -top-3 -right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md border border-white/20"
            >
              <Icon icon="mdi:close" class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  isOpen: boolean;
  src?: string | null;
  alt?: string;
}>();

defineEmits<{ close: [] }>();
</script>