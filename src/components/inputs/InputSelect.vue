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
    
    <div v-if="loading" class="animate-pulse">
      <div class="h-[50px] bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
    </div>

    <div v-else class="relative">
      <select
        :id="name"
        :name="name"
        :value="modelValue === null || modelValue === undefined ? '' : modelValue"
        :disabled="disabled"
        @change="onChange($event)"
        @blur="$emit('blur')"
        class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer pr-10 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
          errorMessage 
            ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-400' 
            : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-[#C88A2A]/50'
        ]"
      >
        <option value="" disabled class="dark:bg-gray-800">{{ placeholder || 'Seleccionar' }}</option>
        <option 
          v-for="option in options" 
          :key="option.id" 
          :value="option.id"
          class="dark:bg-gray-800 dark:text-white"
        >
          {{ option.nombre }}
        </option>
      </select>

      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Icon
          icon="mdi:chevron-down"
          class="w-5 h-5 transition-colors duration-200"
          :class="errorMessage ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'"
          aria-hidden="true"
        />
      </div>
    </div>
    
    <p v-if="errorMessage && !loading" class="mt-1 text-sm text-red-500 animate-pulse">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Option {
  id: number;
  nombre: string;
  [key: string]: unknown;
}

withDefaults(defineProps<{
  modelValue: number | null;
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
}>(), {
  required: false,
  disabled: false,
  loading: false,
  options: () => []
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
  (e: 'blur'): void;
}>();

const onChange = (event: Event) => {
  const val = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', val === '' ? null : Number(val));
};
</script>