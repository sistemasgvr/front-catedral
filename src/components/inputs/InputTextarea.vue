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

    <textarea 
      :id="name" 
      :name="name" 
      :value="modelValue" 
      :placeholder="placeholder" 
      :disabled="disabled" 
      :rows="rows || 4"
      :maxlength="maxlength" 
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
      class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        errorMessage
          ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 dark:text-red-400'
          : 'border-[#E0D5C5] focus:border-[#C88A2A] bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 hover:border-[#C88A2A]/50'
      ]"
    ></textarea>

    <div class="flex justify-between mt-1">
      <p v-if="errorMessage" class="text-sm text-red-500 animate-pulse">
        {{ errorMessage }}
      </p>
      <p v-if="showCount && maxlength" class="text-xs ml-auto transition-colors duration-200"
         :class="errorMessage ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
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
}>(), {
  rows: 4,
  required: false,
  disabled: false,
  showCount: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
/* Estilo opcional para mejorar el scrollbar en dark mode */
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background: #E0D5C5;
  border-radius: 10px;
}
.dark textarea::-webkit-scrollbar-thumb {
  background: #4A4A4A;
}
</style>