import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { ISolicitudDb } from "../interfaces/listSolicitudes.interface";

/**
 * Obtiene las opciones de una lista según su ID
 * @returns Array de opciones de la lista
 * 
 */
export const listarSolicitudes = async (): Promise<ISolicitudDb[]> => {
  try {
    const { data } = await apiClient.get<ISolicitudDb[]>(
      `/solicitudes?select=*`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener el listado";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};
