import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IDetalleSolicitud } from "../interfaces/detalleSolicitud.interface";

/**
 * Obtiene el detalle de una solicitud por su ID
 * @param idSolicitud - ID de la solicitud a consultar
 * @returns Detalle de la solicitud
 */
export const getDetalleSolicitud = async (
  idSolicitud: number
): Promise<IDetalleSolicitud> => {
  try {
    const { data } = await apiClient.get<IDetalleSolicitud[]>(
      `/solicitudes?idsolicitud=eq.${idSolicitud}&select=*`
    );
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No se encontró la solicitud");
    }
    
    // Asegurar que data[0] existe
    const solicitud = data[0];
    if (!solicitud) {
      throw new Error("No se encontró la solicitud");
    }
    
    return solicitud;
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener el detalle de la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};