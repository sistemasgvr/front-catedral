import { ref, watch } from 'vue'

const darkMode = ref(false)

export function useDarkMode() {
  // Inicializar dark mode desde localStorage
  const initDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      darkMode.value = JSON.parse(savedDarkMode)
    } else {
      // Detectar preferencia del sistema
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyDarkMode()
  }

  // Aplicar la clase dark al html
  const applyDarkMode = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Alternar modo oscuro
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }

  // Observar cambios y guardar en localStorage
  watch(darkMode, (newValue) => {
    localStorage.setItem('darkMode', JSON.stringify(newValue))
    applyDarkMode()
  })

  return {
    darkMode,
    toggleDarkMode,
    initDarkMode
  }
}