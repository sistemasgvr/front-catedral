import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisa } from "../interfaces/misa.interface";

export interface GetMisasOptions {
  /** Solo misas con `fechacelebracion` >= esta fecha (YYYY-MM-DD), p. ej. hoy. */
  fechacelebracionDesde?: string;
}

/**
 * Obtiene las misas
 * @param idTipoMisa - ID del tipo de misa para filtrar (opcional)
 * @param options - Filtros adicionales (PostgREST)
 * @returns Array de misas
 */
export const getMisas = async (
  idTipoMisa?: number,
  options?: GetMisasOptions,
): Promise<IMisa[]> => {
  try {
    let url =
      "/misas?select=*,tipomisa(nombre,precio),usuario_creador:authusuarios!misas_idusuariocreacion_fkey(nombre,correo)";

    if (idTipoMisa) {
      url += `&idtipomisa=eq.${idTipoMisa}`;
    }
    if (options?.fechacelebracionDesde) {
      url += `&fechacelebracion=gte.${options.fechacelebracionDesde}`;
    }

    const { data } = await apiClient.get<IMisa[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al obtener las misas";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};
