import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Realiza una eliminación lógica de una misa (cambia estado a false)
 * @param idMisa - ID de la misa a desactivar
 */
export const eliminarMisa = async (idMisa: number): Promise<void> => {
  try {
    // Usamos patch para actualizar solo el campo 'estado'
    await apiClient.patch(`/misas?idmisa=eq.${idMisa}`, {
      estado: false
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al desactivar la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};