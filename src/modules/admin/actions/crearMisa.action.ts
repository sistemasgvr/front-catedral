import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

interface ICrearMisaData {
  idtipomisa: number;
  titulo: string | null;
  fechacelebracion: string;
  horainicio: string;
  horafin: string;
  estado: boolean;
}

/**
 * Crea una nueva misa
 * @param data - Datos de la misa
 */
export const crearMisa = async (data: ICrearMisaData): Promise<void> => {
  try {
    await apiClient.post("/misas", {
      ...data,
      fechacreacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al crear la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};