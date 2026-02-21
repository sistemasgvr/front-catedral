import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { ITipoMisa } from "../interfaces/tipoMisa.interface";

/**
 * Obtiene todos los tipos de misa activos
 */
export const listarTiposMisa = async (): Promise<ITipoMisa[]> => {
  try {
    const { data } = await apiClient.get<ITipoMisa[]>(
      `/tipomisa?select=*&estado=eq.true&order=nombre.asc`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener tipos de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Obtiene un tipo de misa por ID
 */
export const obtenerTipoMisa = async (id: number): Promise<ITipoMisa> => {
  try {
    const { data } = await apiClient.get<ITipoMisa[]>(
      `/tipomisa?idtipomisa=eq.${id}&select=*`
    );

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No se encontró el tipo de misa");
    }

    const tipoMisa = data[0];
    if (!tipoMisa) {
      throw new Error("No se encontró el tipo de misa");
    }

    return tipoMisa;
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener el tipo de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Crea un nuevo tipo de misa
 */
export const crearTipoMisa = async (data: {
  nombre: string;
  precio: number;
}): Promise<void> => {
  try {
    await apiClient.post("/tipomisa", {
      ...data,
      estado: true,
      fechacreacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al crear el tipo de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Actualiza un tipo de misa
 */
export const actualizarTipoMisa = async (
  id: number,
  data: {
    nombre: string;
    precio: number;
  }
): Promise<void> => {
  try {
    await apiClient.patch(`/tipomisa?idtipomisa=eq.${id}`, {
      ...data,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar el tipo de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Elimina lógicamente un tipo de misa (cambia estado a false)
 */
export const eliminarTipoMisa = async (id: number): Promise<void> => {
  try {
    await apiClient.patch(`/tipomisa?idtipomisa=eq.${id}`, {
      estado: false,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al eliminar el tipo de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Restaura un tipo de misa (cambia estado a true)
 */
export const restaurarTipoMisa = async (id: number): Promise<void> => {
  try {
    await apiClient.patch(`/tipomisa?idtipomisa=eq.${id}`, {
      estado: true,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al restaurar el tipo de misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};