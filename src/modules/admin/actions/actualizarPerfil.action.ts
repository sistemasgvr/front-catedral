import { supabase } from "../../../api/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

export interface IActualizarPerfil {
  nombre: string;
  correo: string;
}

function isRpcMissing(error: PostgrestError | null): boolean {
  if (!error) return false;
  if (error.code === "PGRST202") return true;
  const msg = (error.message ?? "").toLowerCase();
  return msg.includes("could not find the function") || msg.includes("function public.actualizar_mi_perfil");
}

function mapNoRowError(err: PostgrestError | null): Error {
  if (err?.code === "PGRST116") {
    return new Error(
      "No se guardó ningún registro. Suele ser por políticas RLS en authusuarios: ejecuta db/actualizar_mi_perfil.sql en Supabase o ajusta políticas UPDATE para usuarios autenticados."
    );
  }
  return new Error(err?.message ?? "Error al actualizar el perfil");
}

/**
 * Actualiza perfil en BD. Preferimos la RPC `actualizar_mi_perfil` (SECURITY DEFINER)
 * si existe en el proyecto; si no, UPDATE directo con comprobación de que sí hubo fila.
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
  const id = Number(idusuarios);

  if (!nombre || !correo || !Number.isFinite(id)) {
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

  const { error: rpcError } = await supabase.rpc("actualizar_mi_perfil", {
    p_idusuarios: id,
    p_nombre: nombre,
    p_correo: correo,
  });

  if (!rpcError) {
    return;
  }

  if (!isRpcMissing(rpcError)) {
    throw new Error(rpcError.message || "Error al actualizar el perfil");
  }

  const { data, error } = await supabase
    .from("authusuarios")
    .update({
      nombre,
      correo,
      fechamodificacion: new Date().toISOString(),
    })
    .eq("idusuarios", id)
    .select("idusuarios")
    .single();

  if (error) {
    throw mapNoRowError(error);
  }
  if (!data) {
    throw new Error(
      "No se confirmó el guardado en la base de datos. Si persiste, ejecuta db/actualizar_mi_perfil.sql en Supabase."
    );
  }
};
