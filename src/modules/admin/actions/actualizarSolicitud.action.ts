import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

interface IActualizarSolicitudData {
  nombres: string;
  apellidos: string;
  idtipodocumento: number;
  nrodocumento: string;
  celular: number;
  correo: string;
  idtipomisa: number;
  idhorario: number;
  fechamisadeseada: string;
  fechacelebracion: string;
  fechasolicitud: string;
  intencion: string;
  montototal: number;
  voucherpago: string;
  idEstadoProceso: number | null;
  estado: boolean;
}

/**
 * Actualiza los datos de una solicitud
 * @param idSolicitud - ID de la solicitud a actualizar
 * @param data - Datos a actualizar
 */
export const actualizarSolicitud = async (
  idSolicitud: number,
  data: IActualizarSolicitudData
): Promise<void> => {
  try {
    await apiClient.patch(
      `/solicitudes?idsolicitud=eq.${idSolicitud}`,
      {
        ...data,
        fechamodificacion: new Date().toISOString(),
      }
    );
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};