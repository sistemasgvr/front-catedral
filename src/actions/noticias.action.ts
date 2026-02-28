import { isAxiosError } from "axios";
import apiClient from "@/api/apiClient";
import type { INoticia, INoticiaForm, INoticiaResumen } from "@/interfaces/noticia.interface";

const BASE = "/noticias";

// ──────────────────────────────────────────────
// PÚBLICAS
// ──────────────────────────────────────────────

/**
 * Obtiene las noticias activas para mostrar al público
 */
export const obtenerNoticiasPublicas = async (limite: number = 5): Promise<INoticiaResumen[]> => {
  try {
    const { data } = await apiClient.get<INoticiaResumen[]>(
      `${BASE}?select=idnoticia,titulo,contenido,imagen,fecha_publicacion,fecha_evento,destacada&estado=eq.true&order=destacada.desc,fecha_publicacion.desc&limit=${limite}`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.error || "Error al obtener noticias");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

// ──────────────────────────────────────────────
// ADMIN
// ──────────────────────────────────────────────

/**
 * Obtiene todas las noticias para el panel de administración
 */
export const obtenerTodasNoticias = async (): Promise<INoticia[]> => {
  try {
    const { data } = await apiClient.get<INoticia[]>(
      `${BASE}?select=*&estado=eq.true&order=destacada.desc,fecha_publicacion.desc`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.error || "Error al obtener noticias");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Obtiene una noticia por ID
 */
export const obtenerNoticiaPorId = async (id: number): Promise<INoticia> => {
  try {
    const { data } = await apiClient.get<INoticia[]>(
      `${BASE}?idnoticia=eq.${id}&select=*`
    );

    if (!data || data.length === 0) {
      throw new Error("Noticia no encontrada");
    }

    return data[0]!; // 👈 aquí
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.error || "Error al obtener noticia");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Crea una nueva noticia
 */
export const crearNoticia = async (form: INoticiaForm): Promise<INoticia> => {
  try {
    const { data } = await apiClient.post<INoticia>(
      BASE,
      { ...form, estado: true },
      { headers: { Prefer: "return=representation" } }
    );
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.message || "Error al crear noticia");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Actualiza una noticia existente
 */
export const actualizarNoticia = async (id: number, form: INoticiaForm): Promise<INoticia> => {
  try {
    const { data } = await apiClient.patch<INoticia>(
      `${BASE}?idnoticia=eq.${id}`,
      { ...form, fechamodificacion: new Date().toISOString() },
      { headers: { Prefer: "return=representation" } }
    );
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.message || "Error al actualizar noticia");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Eliminación lógica: cambia estado a false
 */
export const eliminarNoticia = async (id: number): Promise<void> => {
  try {
    await apiClient.patch(
      `${BASE}?idnoticia=eq.${id}`,
      { estado: false, fechamodificacion: new Date().toISOString() }
    );
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.message || "Error al eliminar noticia");
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Subir imagen de noticia (si usas almacenamiento con endpoint propio)
 * Adapta este endpoint según tu backend
 */
export const subirImagenNoticia = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<{ url: string }>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.message || "Error al subir imagen");
    }
    throw new Error("No se pudo subir la imagen");
  }
};