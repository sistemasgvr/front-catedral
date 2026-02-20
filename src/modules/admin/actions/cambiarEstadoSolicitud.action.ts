import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Cambia el estado de una solicitud
 * @param idSolicitud - ID de la solicitud
 * @param accion - Acción a realizar: 'aprobar', 'denegar', 'revision'
 */
export const cambiarEstadoSolicitud = async (
  idSolicitud: number,
  accion: 'aprobar' | 'denegar' | 'revision'
): Promise<void> => {
  try {
    // Mapeo de acciones a IDs de estado
    // Ajusta estos IDs según tu base de datos
    const estadosMap = {
      aprobar: 18,   // ID del estado "APROBADA"
      denegar: 19,   // ID del estado "DENEGADA"
      revision: 17,  // ID del estado "EN REVISIÓN"
    };

    const idEstadoProceso = estadosMap[accion];

    await apiClient.patch(
      `/solicitudes?idsolicitud=eq.${idSolicitud}`,
      {
        idEstadoProceso,
        fechamodificacion: new Date().toISOString(),
      }
    );
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al cambiar el estado de la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};