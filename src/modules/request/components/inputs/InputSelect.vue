<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="name" 
      class="block text-sm font-medium text-[#4A4A4A] mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="name"
        :name="name"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))"
        @blur="$emit('blur')"
        class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer pr-10"
        :class="[
          errorMessage 
            ? 'border-red-400 focus:border-red-500 bg-red-50' 
            : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white hover:border-[#C88A2A]/50'
        ]"
      >
        <option value="" disabled>{{ placeholder || 'Seleccionar' }}</option>
        <option 
          v-for="option in options" 
          :key="option.id" 
          :value="option.id"
        >
          {{ option.nombre }}
        </option>
      </select>
      <!-- Arrow icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
    <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Option {
  id: number;
  nombre: string;
  [key: string]: unknown;
}

defineProps<{
  modelValue: number | null;
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
</style>
