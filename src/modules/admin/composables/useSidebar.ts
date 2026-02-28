import { ref, computed, onMounted, onUnmounted } from 'vue'

const isExpanded = ref(true)
const isMobileOpen = ref(false)
const isMobile = ref(false)
const isHovered = ref(false)

export function useSidebar() {
  const handleResize = () => {
    const mobile = window.innerWidth < 1024 // lg breakpoint
    isMobile.value = mobile
    if (!mobile) {
      isMobileOpen.value = false
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
    } else {
      isExpanded.value = !isExpanded.value
    }
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const toggleDesktopSidebar = () => {
    isExpanded.value = !isExpanded.value
  }

  const setIsHovered = (value: boolean) => {
    if (!isMobile.value) {
      isHovered.value = value
    }
  }

  return {
    isExpanded: computed(() => (isMobile.value ? false : isExpanded.value)),
    isMobileOpen: computed(() => isMobileOpen.value),
    isHovered: computed(() => isHovered.value),
    isMobile: computed(() => isMobile.value),
    toggleSidebar,
    toggleMobileSidebar,
    toggleDesktopSidebar,
    setIsHovered,
  }
}