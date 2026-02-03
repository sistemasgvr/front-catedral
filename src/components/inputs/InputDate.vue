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
      class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none cursor-pointer"
      :class="[
        errorMessage 
          ? 'border-red-400 focus:border-red-500 bg-red-50' 
          : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white hover:border-[#C88A2A]/50'
      ]"
    />
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
</style>
