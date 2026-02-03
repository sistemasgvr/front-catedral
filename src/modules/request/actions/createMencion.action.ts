import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Payload para crear una mención (formato API Supabase - snake_case)
 */
export interface CreateMencionPayload {
  idsolicitud: number;
  descripcion: string;
  estado: boolean;
  idusuariocreacion: number | null;
}

/**
 * Crea una mención en Supabase
 * @param payload - Datos de la mención
 */
export const createMencion = async (
  payload: CreateMencionPayload
): Promise<void> => {
  try {
    await apiClient.post("/menciones", payload);
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 403, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al registrar la mención";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo registrar la mención. Intente nuevamente.");
  }
};
