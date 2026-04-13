import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { normalizeRol, isAdminRole, type AppRole } from '../auth/roles'

interface User {
  idusuarios: number
  nombre: string
  correo: string
  auth_uid?: string
  /** Si falta (sesiones antiguas), se trata como `admin` hasta el próximo login. */
  rol?: AppRole
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

  const rol = computed(() => normalizeRol(user.value?.rol))
  const isAdmin = computed(() => isAdminRole(user.value?.rol))

  const loadFromStorage = () => {
    const saved = localStorage.getItem('user')
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>
      if (parsed && typeof parsed === 'object') {
        if (
          'user' in parsed &&
          parsed.user &&
          typeof parsed.user === 'object'
        ) {
          const u = parsed.user as User
          user.value = { ...u, rol: normalizeRol(u.rol) }
        } else if ('idusuarios' in parsed) {
          const u = parsed as unknown as User
          user.value = { ...u, rol: normalizeRol(u.rol) }
        } else {
          user.value = null
        }
      }
    } catch {
      user.value = null
    }
  }

  const updateUser = (data: Partial<User>) => {
    if (!user.value) return
    const next = { ...user.value, ...data }
    if (data.rol !== undefined) next.rol = normalizeRol(data.rol)
    user.value = next
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, userInitials, rol, isAdmin, loadFromStorage, updateUser, clearUser }
})