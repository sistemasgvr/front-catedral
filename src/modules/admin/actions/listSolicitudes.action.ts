import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { ISolicitudDb } from "../interfaces/listSolicitudes.interface";

/**
 * Listado de solicitudes para administración (orden recientes primero).
 * No filtra por estado de proceso: las denegadas deben seguir apareciendo;
 * si no se ven, revisar políticas RLS o triggers en la base de datos.
 */
export const listarSolicitudes = async (): Promise<ISolicitudDb[]> => {
  try {
    const { data } = await apiClient.get<ISolicitudDb[]>(
      `/solicitudes?select=*,tipomisa(idtipomisa,nombre)&order=fechacreacion.desc`
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
