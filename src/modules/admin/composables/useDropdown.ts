import { ref, onMounted, onUnmounted } from 'vue';

export function useDropdown() {
  const isOpen = ref(false);
  const dropdownRef = ref<HTMLElement | null>(null);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      close();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return {
    isOpen,
    dropdownRef,
    toggle,
    close,
  };
}