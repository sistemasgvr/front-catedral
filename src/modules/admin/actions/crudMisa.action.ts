import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisaDetalle, ICrearMisaForm, IEditarMisaForm } from "../interfaces/misa.interface";

/**
 * Obtiene el detalle completo de una misa
 */
export const obtenerDetalleMisa = async (idMisa: number): Promise<IMisaDetalle> => {
  try {
    const { data } = await apiClient.get<IMisaDetalle[]>(
      `/misas?select=*,tipomisa:idtipomisa(*),menciones:mencionesmisa(idmencionmisa,mencion:idmencion(idmencion,descripcion,solicitud:idsolicitud(nombres,apellidos,intencion)))&idmisa=eq.${idMisa}`
    );
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No se encontró la misa");
    }
    
    const misa = data[0];
    if (!misa) {
      throw new Error("No se encontró la misa");
    }
    
    return misa;
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener el detalle de la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Crea una nueva misa
 */
export const crearMisa = async (data: ICrearMisaForm): Promise<void> => {
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

/**
 * Actualiza una misa existente
 */
export const actualizarMisa = async (data: IEditarMisaForm): Promise<void> => {
  try {
    const { idmisa, ...updateData } = data;
    await apiClient.patch(`/misas?idmisa=eq.${idmisa}`, {
      ...updateData,
      fechamodificacion: new Date().toISOString(),
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};

/**
 * Elimina una misa
 */
export const eliminarMisa = async (idMisa: number): Promise<void> => {
  try {
    await apiClient.delete(`/misas?idmisa=eq.${idMisa}`);
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al eliminar la misa";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};