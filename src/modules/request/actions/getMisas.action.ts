import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisa } from "../interfaces/misa.interface";

/**
 * Obtiene las misas
 * @param idTipoMisa - ID del tipo de misa para filtrar (opcional)
 * @returns Array de misas
 */
export const getMisas = async (idTipoMisa?: number): Promise<IMisa[]> => {
  try {
    let url = "/misas?select=*,tipomisa(nombre,precio),usuario_creador:authusuarios!misas_idusuariocreacion_fkey(nombre,correo)";
    
    if (idTipoMisa) {
      url += `&idtipomisa=eq.${idTipoMisa}`;
    }
    
    const { data } = await apiClient.get<IMisa[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener las misas";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};