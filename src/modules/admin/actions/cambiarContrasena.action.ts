import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

export interface ICambiarContrasena {
  contrasena_hash: string;
}

export const cambiarContrasena = async (
  idusuarios: number,
  nuevaContrasena: string
): Promise<void> => {
  try {
    await apiClient.patch(`/authusuarios?idusuarios=eq.${idusuarios}`, {
      contrasena_hash: nuevaContrasena,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al cambiar la contraseña";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};