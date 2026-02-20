import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisaConRelaciones } from "../interfaces/misa.interface";

/**
 * Obtiene el listado de misas con sus relaciones
 * @returns Array de misas
 */
export const listarMisas = async (): Promise<IMisaConRelaciones[]> => {
  try {
    const { data } = await apiClient.get<IMisaConRelaciones[]>(
    //`/misas?select=*,tipomisa:idtipomisa(nombre,precio),solicitud:solicitudes!inner(nombres,apellidos,intencion)&order=fechacelebracion.desc,horainicio.asc`
    `/misas?select=*,tipomisa(nombre,precio),usuario_creador:authusuarios!misas_idusuariocreacion_fkey(nombre,correo)&order=fechacelebracion.desc,horainicio.asc`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener el listado de misas";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};