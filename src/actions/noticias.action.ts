import { isAxiosError } from "axios";
import apiClient from "@/api/apiClient";
import type { INoticiaResumen } from "@/interfaces/noticia.interface";

/**
 * Obtiene las noticias activas para mostrar al público
 */
export const obtenerNoticiasPublicas = async (limite: number = 5): Promise<INoticiaResumen[]> => {
  try {
    const { data } = await apiClient.get<INoticiaResumen[]>(
      `/noticias?select=idnoticia,titulo,contenido,imagen,fecha_publicacion,fecha_evento,destacada&estado=eq.true&order=destacada.desc,fecha_publicacion.desc&limit=${limite}`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener noticias";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};