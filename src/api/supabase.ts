import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,      // guarda sesión en localStorage automáticamente
    autoRefreshToken: true,    // renueva el token antes de que expire
    detectSessionInUrl: false, // no necesitamos magic links
    storageKey: 'catedral-auth', // clave personalizada en localStorage
  }
})