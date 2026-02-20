import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Elimina una misa
 * @param idMisa - ID de la misa a eliminar
 */
export const eliminarMisa = async (idMisa: number): Promise<void> => {
  try {
    await apiClient.delete(`/misas?idmisa=eq.${idMisa}`);
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al eliminar la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};