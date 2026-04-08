-- Ejecutar en Supabase → SQL Editor (una vez).
-- Actualiza authusuarios saltando RLS de forma segura: solo la fila cuyo auth_uid coincide con auth.uid().
-- Requisito: columna auth_uid en public.authusuarios alineada con auth.users.id (texto UUID).

CREATE OR REPLACE FUNCTION public.actualizar_mi_perfil(
  p_idusuarios integer,
  p_nombre text,
  p_correo text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  out_row public.authusuarios%ROWTYPE;
  n int;
BEGIN
  -- auth.uid() es uuid; auth_uid puede ser uuid o text — comparar siempre como texto evita "operator does not exist: uuid = text"
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sesión no válida';
  END IF;

  UPDATE public.authusuarios u
  SET
    nombre = trim(p_nombre),
    correo = trim(p_correo),
    fechamodificacion = now()
  WHERE u.idusuarios = p_idusuarios
    AND u.auth_uid::text = auth.uid()::text
  RETURNING * INTO out_row;

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RAISE EXCEPTION 'No se pudo actualizar: sin permiso o auth_uid no coincide con tu sesión. Revisa RLS o el campo auth_uid.';
  END IF;

  RETURN to_json(out_row);
END;
$$;

REVOKE ALL ON FUNCTION public.actualizar_mi_perfil(integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.actualizar_mi_perfil(integer, text, text) TO authenticated;
