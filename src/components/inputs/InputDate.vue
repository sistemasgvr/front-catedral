<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="name" 
      class="block text-sm font-medium mb-1 transition-colors duration-200"
      :class="errorMessage ? 'text-red-500' : 'text-[#4A4A4A] dark:text-gray-300'"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="name"
        :name="name"
        type="date"
        :value="modelValue"
        :min="min"
        :max="max"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none cursor-pointer date-input disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          errorMessage 
            ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-400' 
            : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-[#C88A2A]/50'
        ]"
      />
    </div>

    <p v-if="errorMessage" class="mt-1 text-sm text-red-500 animate-pulse">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string;
  name: string;
  label?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}>(), {
  required: false,
  disabled: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
/* Restaurar comportamiento nativo y permitir modo oscuro en el popup del calendario */
.date-input {
  appearance: auto;
  -webkit-appearance: auto;
  /* Crucial: Esto le dice al navegador que el calendario interno debe adaptarse al tema */
  color-scheme: light dark;
}

/* Forzar visibilidad y color del icono del calendario en Chrome/Edge */
.date-input::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
  /* En modo oscuro, invertimos el color del icono si es necesario, 
     aunque color-scheme suele manejarlo bien */
  filter: var(--tw-drop-shadow); 
}

/* Estética para el dark mode específicamente en el icono si fuera necesario */
:deep(.dark) .date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}

.date-input::-webkit-inner-spin-button,
.date-input::-webkit-clear-button {
  display: none;
}
</style>