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
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      @input="onInput"
      @keydown="onKeydown"
      @beforeinput="onBeforeInput"
      @paste="onPaste"
      @compositionend="onCompositionEnd"
      @drop="onDrop"
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
const props = withDefaults(defineProps<{
  modelValue: string | number;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxlength?: number;
  /** p. ej. `numeric` para teclado numérico en móvil */
  inputmode?: 'text' | 'search' | 'none' | 'url' | 'email' | 'tel' | 'numeric' | 'decimal';
  /** Solo permite dígitos (tecla, pegado e input); útil para DNI. */
  integerOnly?: boolean;
  autocomplete?: string;
  errorMessage?: string;
}>(), {
  type: 'text',
  required: false,
  disabled: false,
  inputmode: undefined,
  integerOnly: false,
  autocomplete: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();

function soloDigitos(s: string): string {
  return s.replace(/\D/g, '');
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let next = el.value;
  if (props.integerOnly) {
    next = soloDigitos(next);
    if (props.maxlength != null && next.length > props.maxlength) {
      next = next.slice(0, props.maxlength);
    }
  }
  emit('update:modelValue', next);
}

function onKeydown(e: KeyboardEvent) {
  if (!props.integerOnly || props.disabled) return;
  const nav = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
  ];
  if (nav.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) {
    const k = e.key.toLowerCase();
    if (['a', 'c', 'v', 'x', 'z', 'y'].includes(k)) return;
    e.preventDefault();
    return;
  }
  if (e.altKey && e.key.length === 1) {
    e.preventDefault();
    return;
  }
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    return;
  }
  if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
}

function onBeforeInput(e: Event) {
  if (!props.integerOnly || props.disabled) return;
  const ev = e as InputEvent;
  const type = ev.inputType ?? '';
  if (type === 'insertLineBreak' || type === 'insertParagraph') {
    ev.preventDefault();
    return;
  }
  if (!type.startsWith('insert') && type !== 'insertCompositionText') return;
  const data = ev.data;
  if (data == null || data === '') return;
  if (!/^\d+$/.test(data)) {
    ev.preventDefault();
  }
}

function onCompositionEnd(e: CompositionEvent) {
  if (!props.integerOnly || props.disabled) return;
  const el = e.target as HTMLInputElement;
  let next = soloDigitos(el.value);
  if (props.maxlength != null) next = next.slice(0, props.maxlength);
  emit('update:modelValue', next);
}

function onDrop(e: DragEvent) {
  if (!props.integerOnly || props.disabled) return;
  e.preventDefault();
  const text = e.dataTransfer?.getData('text/plain') ?? '';
  const el = e.target as HTMLInputElement;
  const cur = String(props.modelValue ?? '');
  const start = el.selectionStart ?? cur.length;
  const end = el.selectionEnd ?? cur.length;
  let merged = cur.slice(0, start) + soloDigitos(text) + cur.slice(end);
  merged = soloDigitos(merged);
  if (props.maxlength != null) merged = merged.slice(0, props.maxlength);
  emit('update:modelValue', merged);
}

function onPaste(e: ClipboardEvent) {
  if (!props.integerOnly || props.disabled) return;
  e.preventDefault();
  const paste = e.clipboardData?.getData('text') ?? '';
  const digits = soloDigitos(paste);
  const el = e.target as HTMLInputElement;
  const cur = String(props.modelValue ?? '');
  const start = el.selectionStart ?? cur.length;
  const end = el.selectionEnd ?? cur.length;
  let merged = cur.slice(0, start) + digits + cur.slice(end);
  merged = soloDigitos(merged);
  if (props.maxlength != null) merged = merged.slice(0, props.maxlength);
  emit('update:modelValue', merged);
}
</script>