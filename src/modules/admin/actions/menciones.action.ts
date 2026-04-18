import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Crea una mención asociada a una solicitud
 */
export const crearMencion = async (data: {
  idsolicitud: number;
  descripcion: string;
}): Promise<number> => {
  try {
    const { data: mencionCreada } = await apiClient.post("/menciones", {
      idsolicitud: data.idsolicitud,
      descripcion: data.descripcion,
      estado: true,
      fechacreacion: new Date().toISOString(),
    }, {
      headers: {
        'Prefer': 'return=representation'
      }
    });

    if (Array.isArray(mencionCreada) && mencionCreada.length > 0) {
      return mencionCreada[0].idmencion;
    }

    throw new Error("No se pudo obtener el ID de la mención creada");
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al crear la mención";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo crear la mención");
  }
};

/**
 * Vincula una mención con una misa
 */
export const vincularMencionAMisa = async (data: {
  idmencion: number;
  idmisa: number;
}): Promise<void> => {
  try {
    await apiClient.post("/mencionesmisa", {
      idmencion: data.idmencion,
      idmisa: data.idmisa,
      estado: true,
      fechacreacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al vincular la mención con la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo vincular la mención con la misa");
  }
};

/**
 * Obtiene las menciones de una solicitud
 */
export const obtenerMencionesPorSolicitud = async (idsolicitud: number): Promise<any[]> => {
  try {
    const { data } = await apiClient.get(
      `/menciones?idsolicitud=eq.${idsolicitud}&estado=eq.true&select=*`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener las menciones";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Obtiene las misas asociadas a una mención
 */
export const actualizarMencionDescripcion = async (
  idmencion: number,
  descripcion: string,
): Promise<void> => {
  try {
    await apiClient.patch(`/menciones?idmencion=eq.${idmencion}`, {
      descripcion,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      throw new Error(
        error.response?.data?.error || "Error al actualizar la mención",
      );
    }
    throw new Error("No se pudo actualizar la mención");
  }
};

/** Quita la mención de esta misa (enlace en `mencionesmisa`, sin borrar la fila de `menciones`). */
export const desactivarMencionMisa = async (idmencionmisa: number): Promise<void> => {
  try {
    await apiClient.patch(`/mencionesmisa?idmencionmisa=eq.${idmencionmisa}`, {
      estado: false,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      throw new Error(
        error.response?.data?.error || "Error al desvincular la mención de la misa",
      );
    }
    throw new Error("No se pudo desvincular la mención");
  }
};

export const obtenerMisasPorMencion = async (idmencion: number): Promise<any[]> => {
  try {
    const { data } = await apiClient.get(
      `/mencionesmisa?idmencion=eq.${idmencion}&estado=eq.true&select=*,misa:idmisa(*)`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener las misas de la mención";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};