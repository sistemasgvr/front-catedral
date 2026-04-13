-- Ejecutar en Supabase → SQL Editor (una vez por entorno).
-- Añade rol en BD y devuelve `rol` al iniciar sesión vía RPC existente.
--
-- Valores: 'admin' (acceso total) | 'operador' (solo misas/calendario, solicitudes y perfil).
-- Tras migrar, asigna operadores: UPDATE public.authusuarios SET rol = 'operador' WHERE correo = '...';

BEGIN;

ALTER TABLE public.authusuarios
  ADD COLUMN IF NOT EXISTS rol text NOT NULL DEFAULT 'admin';

ALTER TABLE public.authusuarios
  DROP CONSTRAINT IF EXISTS authusuarios_rol_check;

ALTER TABLE public.authusuarios
  ADD CONSTRAINT authusuarios_rol_check
  CHECK (rol IN ('admin', 'operador'));

COMMENT ON COLUMN public.authusuarios.rol IS 'admin = acceso total al panel; operador = misas (lista/calendario), solicitudes y perfil.';

-- Postgres no permite cambiar el tipo de retorno (OUT) con CREATE OR REPLACE: hay que eliminar antes.
-- Si el DROP falla por objetos dependientes, usa en su lugar: ... obtener_perfil_usuario(text) CASCADE;
DROP FUNCTION IF EXISTS public.obtener_perfil_usuario(text);

CREATE FUNCTION public.obtener_perfil_usuario(p_correo text)
RETURNS TABLE (
  idusuarios integer,
  nombre text,
  correo text,
  auth_uid text,
  rol text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.idusuarios,
    u.nombre::text,
    u.correo::text,
    u.auth_uid::text,
    COALESCE(NULLIF(trim(u.rol), ''), 'admin')::text AS rol
  FROM public.authusuarios u
  WHERE lower(trim(u.correo)) = lower(trim(p_correo))
    AND COALESCE(u.estado, true);
$$;

REVOKE ALL ON FUNCTION public.obtener_perfil_usuario(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.obtener_perfil_usuario(text) TO authenticated;

COMMIT;
