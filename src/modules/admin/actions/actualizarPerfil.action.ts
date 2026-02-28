import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

export interface IActualizarPerfil {
  nombre: string;
  correo: string;
}

export const actualizarPerfil = async (
  idusuarios: number,
  payload: IActualizarPerfil
): Promise<void> => {
  try {
    await apiClient.patch(`/authusuarios?idusuarios=eq.${idusuarios}`, {
      ...payload,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422, 409].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al actualizar el perfil";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};