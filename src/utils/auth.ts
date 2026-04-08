import { getActivePinia } from 'pinia'
import { supabase } from '../api/supabase'
import { useUserStore } from '../modules/admin/stores/user.store'

/** Verifica si hay una sesión activa y válida en Supabase */
export const isTokenValid = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession()
  return session !== null
}

/** Obtiene el token JWT actual de Supabase */
export const getToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

/** Cierra sesión y limpia el estado */
export const clearSession = async (): Promise<void> => {
  await supabase.auth.signOut()
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  const pinia = getActivePinia()
  if (pinia) {
    useUserStore(pinia).clearUser()
  }
}