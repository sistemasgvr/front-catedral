import { supabase } from '../../../api/supabase'

export interface LoginPayload {
  p_correo: string
  p_contrasena: string
}

export interface LoginResponse {
  idusuarios: number
  nombre: string
  correo: string
  auth_uid: string
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  // 1. Autenticar con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: payload.p_correo,
    password: payload.p_contrasena,
  })

  if (authError || !authData.user) {
    throw new Error('Credenciales inválidas')
  }

  // 2. Obtener datos del perfil desde tu tabla
  const { data: perfilData, error: perfilError } = await supabase
    .rpc('obtener_perfil_usuario', { p_correo: payload.p_correo })

  if (perfilError || !perfilData || perfilData.length === 0) {
    // Si falla el perfil, cerrar sesión para no dejar estado inconsistente
    await supabase.auth.signOut()
    throw new Error('No se encontró el perfil del usuario')
  }

  return perfilData[0] as LoginResponse
}