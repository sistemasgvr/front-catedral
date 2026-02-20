<template>
  <div class="w-full text-gray-900">
    <label 
      v-if="label" 
      :for="name" 
      class="block text-sm font-medium text-[#4A4A4A] mb-1"
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
        class="w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none bg-white cursor-pointer date-input"
        :class="[
          errorMessage 
            ? 'border-red-400 focus:border-red-500 bg-red-50' 
            : 'border-[#E0D5C5] focus:border-[#C88A2A] hover:border-[#C88A2A]/50'
        ]"
      />
    </div>

    <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  name: string;
  label?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
/* 🔥 MUY IMPORTANTE: restaurar comportamiento nativo */
.date-input {
  appearance: auto;
  -webkit-appearance: auto;
}

/* Forzar visibilidad del icono en Chrome */
.date-input::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
}

/* Evitar que el ícono desaparezca */
.date-input::-webkit-inner-spin-button,
.date-input::-webkit-clear-button {
  display: none;
}
</style>
