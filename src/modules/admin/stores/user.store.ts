import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  idusuarios: number
  nombre: string
  correo: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const userInitials = computed(() => {
    if (!user.value?.nombre) return 'U'
    const names = user.value.nombre.trim().split(' ').filter(n => n.length > 0)
    if (names.length >= 2) {
      return ((names[0]?.[0] ?? '') + (names[1]?.[0] ?? '')).toUpperCase()
    }
    return (names[0]?.[0] ?? 'U').toUpperCase()
  })

  const loadFromStorage = () => {
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        user.value = null
      }
    }
  }

  const updateUser = (data: Partial<User>) => {
    if (!user.value) return
    user.value = { ...user.value, ...data }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, userInitials, loadFromStorage, updateUser, clearUser }
})