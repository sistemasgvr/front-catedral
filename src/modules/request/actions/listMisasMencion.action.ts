
import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { MisaMencion } from "../interfaces/listMisasMencion";

export const getListMisasMencionesAction = async (): Promise<MisaMencion[]> => {
    try {
      const { data } = await apiClient.get<MisaMencion[]>(
        "/misas?estado=eq.true&select=idmisa,titulo,fechacelebracion,menciones:mencionesmisa(mencion:menciones(solicitante:solicitudes(nombres,apellidos,nrodocumento),descripcion))"
      );
  
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (
        isAxiosError(error) &&
        [400, 401, 422].includes(error.response?.status ?? 0)
      ) {
        const errorMessage =
          (error.response?.data as any)?.error || "Error al obtener el listado";
        throw new Error(errorMessage);
      }
      throw new Error("No se pudo realizar la petición");
    }
  };