/**
 * Roles de aplicación (panel admin).
 * - admin: acceso completo.
 * - operador: solo misas (incl. calendario), solicitudes y perfil propio.
 *
 * Origen del valor (en orden): respuesta RPC `obtener_perfil_usuario.rol`,
 * `user_metadata.rol` o `app_metadata.role` en Supabase Auth.
 */
export type AppRole = 'admin' | 'operador';

export function normalizeRol(input: string | null | undefined): AppRole {
  const v = (input ?? '').toLowerCase().trim();
  if (v === 'operador' || v === 'auxiliar' || v === 'limitado') return 'operador';
  return 'admin';
}

export function isAdminRole(rol: string | null | undefined): boolean {
  return normalizeRol(rol) === 'admin';
}

/** Rutas que puede ver un operador (además de /login). */
export const OPERADOR_ALLOWED_PATHS = ['/misas', '/solicitudes', '/perfil'] as const;

export function isPathAllowedForOperador(path: string): boolean {
  return (OPERADOR_ALLOWED_PATHS as readonly string[]).some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}
