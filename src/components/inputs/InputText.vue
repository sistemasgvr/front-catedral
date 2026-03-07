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

    <input
      :id="name"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
      class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        errorMessage 
          ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-400' 
          : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 hover:border-[#C88A2A]/50'
      ]"
    />

    <p v-if="errorMessage" class="mt-1 text-sm text-red-500 animate-pulse">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxlength?: number;
  errorMessage?: string;
}>(), {
  type: 'text',
  required: false,
  disabled: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>