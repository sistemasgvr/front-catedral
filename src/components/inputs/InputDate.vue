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
/* --- MODO CLARO (Default) --- */
.date-input {
  appearance: auto;
  -webkit-appearance: auto;
  color-scheme: light; /* Indica al navegador que use iconos oscuros */
}

/* Forzamos que el icono sea oscuro si el navegador intenta ponerlo blanco */
.date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0); 
}

/* --- MODO OSCURO (Aislado) --- */
/** * Usamos :host-context(.dark) si usas Web Components, 
 * pero para Vue estándar, lo más seguro es usar un selector que busque 
 * la clase .dark en los ancestros sin usar :global.
 */
 :is(.dark *) .date-input {
  color-scheme: dark;
}

:is(.dark *) .date-input::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Aquí el icono se vuelve blanco */
}

/* Limpieza de botones extra de Chrome */
.date-input::-webkit-inner-spin-button,
.date-input::-webkit-clear-button {
  display: none;
}
</style>