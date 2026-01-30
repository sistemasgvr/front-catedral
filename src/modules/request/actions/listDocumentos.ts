import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { Documentos } from "../interfaces/listDocumentos.interface";

export const getDocumentos = async (): Promise<Documentos[]> => {
    try {
      const { data } = await apiClient.get<Documentos[]>(
        "/opcioneslista?select=idopcionlista,nombre,descripcion&idlista=eq.1&estado=eq.true&order=nombre.asc",
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
  