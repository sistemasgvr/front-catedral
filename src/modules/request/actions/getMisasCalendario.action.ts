import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisaCalendario } from "../interfaces/misa.interface";

export const getMisasCalendario = async (
  startDate: string,
  endDate: string
): Promise<IMisaCalendario[]> => {
  try {
    const select = "*,tipomisa(nombre,precio),mencionesmisa(count)";
    const url = `/misas?select=${select}&fechacelebracion=gte.${startDate}&fechacelebracion=lte.${endDate}&order=fechacelebracion.asc&order=horainicio.asc`;
    const { data } = await apiClient.get<IMisaCalendario[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener misas";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la peticion");
  }
};
