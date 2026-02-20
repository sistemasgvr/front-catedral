import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IOpcionLista } from "../interfaces/opcionLista.interface";

/**
 * Obtiene las opciones de una lista según su ID
 * @param idLista - ID de la lista de opciones a consultar
 * @returns Array de opciones de la lista
 * 
 * IDs de listas conocidos:
 * - 1: Tipos de Documento
 * - 2: Tipos de Misa (ejemplo)
 * - etc.
 */
export const getOpcionesLista = async (idLista: number): Promise<IOpcionLista[]> => {
  try {
    const { data } = await apiClient.get<IOpcionLista[]>(
      `/opcioneslista?select=idopcionlista,nombre,descripcion&idlista=eq.${idLista}&estado=eq.true&order=nombre.asc`
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
