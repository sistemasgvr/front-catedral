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
    <textarea
      :id="name"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
      class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none resize-none"
      :class="[
        errorMessage 
          ? 'border-red-400 focus:border-red-500 bg-red-50' 
          : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white hover:border-[#C88A2A]/50'
      ]"
    ></textarea>
    <div class="flex justify-between mt-1">
      <p v-if="errorMessage" class="text-sm text-red-500">
        {{ errorMessage }}
      </p>
      <p v-if="showCount && maxlength" class="text-xs text-gray-400 ml-auto">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxlength?: number;
  required?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  errorMessage?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
</style>
