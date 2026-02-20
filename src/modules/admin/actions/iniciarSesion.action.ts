import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Payload para verificar contraseña (formato API Supabase - snake_case)
 */
export interface LoginPayload {
  p_correo: string;
  p_contrasena: string;
}

/**
 * Respuesta del login
 */
export interface LoginResponse {
  idusuarios: number;
  nombre: string;
  correo: string;
}

/**
 * Verifica las credenciales del usuario
 * @param payload - Correo y contraseña
 * @returns Datos del usuario autenticado
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse[]>(
      "/rpc/verificar_contrasena",
      payload
    );

    // Verificar si la respuesta tiene datos
    if (!response.data || response.data.length === 0) {
      throw new Error("Credenciales inválidas");
    }

    // Retornar el primer elemento de forma segura
    const userData = response.data[0];
    
    if (!userData) {
      throw new Error("Credenciales inválidas");
    }

    return userData;
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 403, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Credenciales inválidas";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo iniciar sesión. Intente nuevamente.");
  }
};