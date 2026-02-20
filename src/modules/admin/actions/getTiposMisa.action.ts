import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

import type { ITipoMisa } from "../interfaces/tipoMisa.interface";

export const getTiposMisa = async (): Promise<ITipoMisa[]> => {
  try {
    const { data } = await apiClient.get<ITipoMisa[]>(
      `/tipomisa?select=*&order=nombre.asc`,
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
