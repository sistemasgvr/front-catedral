import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { ISolicitudDb } from "../interfaces/solicitudDb.interface";

export const getSolicitudesByDocumento = async (
  nroDocumento: string
): Promise<ISolicitudDb[]> => {
  try {
    const trimmed = nroDocumento.trim();
    if (!trimmed) return [];

    const select =
      "*,tipomisa(nombre,precio),tipo_documento:opcioneslista!solicitudes_idtipodocumento_fkey(idopcionlista,nombre,descripcion),horario:opcioneslista!solicitudes_idhorario_fkey(idopcionlista,nombre,descripcion),estado_proceso:opcioneslista!solicitudes_idEstadoProceso_fkey(idopcionlista,nombre,descripcion),menciones(idmencion,descripcion,estado,fechacreacion)";
    const url = `/solicitudes?select=${select}&nrodocumento=eq.${encodeURIComponent(
      trimmed
    )}&order=fechacreacion.desc`;
    const { data } = await apiClient.get<ISolicitudDb[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener solicitudes";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la peticion");
  }
};
