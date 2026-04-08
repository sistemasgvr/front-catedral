import { supabase } from "../../../api/supabase";

export interface IActualizarPerfil {
  nombre: string;
  correo: string;
}

/**
 * Actualiza perfil usando la sesión de Supabase (JWT del usuario).
 * El cliente axios REST no enviaba el token de sesión, por eso fallaba el PATCH.
 */
export const actualizarPerfil = async (
  idusuarios: number,
  payload: IActualizarPerfil
): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
  }

  const nombre = payload.nombre.trim();
  const correo = payload.correo.trim();

  if (!nombre || !correo) {
    throw new Error("Nombre y correo son obligatorios.");
  }

  const emailActual = (session.user.email ?? "").toLowerCase();
  if (correo.toLowerCase() !== emailActual) {
    const { error: authErr } = await supabase.auth.updateUser({
      email: correo,
    });
    if (authErr) {
      throw new Error(authErr.message || "No se pudo actualizar el correo en la cuenta.");
    }
  }

  const { error } = await supabase
    .from("authusuarios")
    .update({
      nombre,
      correo,
      fechamodificacion: new Date().toISOString(),
    })
    .eq("idusuarios", idusuarios)
    .select("idusuarios")
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Error al actualizar el perfil");
  }
};