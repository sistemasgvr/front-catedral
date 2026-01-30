import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { TipoMisa } from "../interfaces/ListTipoMisa.interface.ts";

export const getListTipoMisa = async (): Promise<TipoMisa[]> => {
    try {
      const { data } = await apiClient.get<TipoMisa[]>(
        "/tipomisa?select=*&order=nombre.asc"
      );
  
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (
        isAxiosError(error) &&
        [400, 401, 422].includes(error.response?.status ?? 0)
      ) {
        const errorMessage =
          (error.response?.data as any)?.error || "Error al obtener el listado";
        throw new Error(errorMessage);
      }
      throw new Error("No se pudo realizar la petición");
    }
  };