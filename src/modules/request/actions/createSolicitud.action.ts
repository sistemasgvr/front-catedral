import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";

/**
 * Payload para crear una solicitud (formato API - tablas solicitudes)
 * Schema: solicitudes (idsolicitud, idtipodocumento, nrodocumento, nombres, apellidos,
 * celular, correo, fechacelebracion, idtipomisa, idhorario, intencion, voucherpago,
 * fechasolicitud, montototal, fechamisadeseada, estado, idusuariocreacion)
 */
export interface CreateSolicitudPayload {
  idtipodocumento: number;
  nrodocumento: string;
  nombres: string;
  apellidos: string;
  celular: number | null;
  correo: string | null;
  fechacelebracion: string | null;
  idtipomisa: number | null;
  idhorario: number | null;
  intencion: string | null;
  voucherpago: string | null;
  montototal: number;
  fechamisadeseada: string | null;
  estado: boolean;
  idusuariocreacion: number | null;
}

/**
 * Respuesta de Supabase al insertar (PK: idsolicitud)
 */
export interface SolicitudCreada {
  idsolicitud: number;
  [key: string]: unknown;
}

/**
 * Crea una solicitud en Supabase
 * @param payload - Datos de la solicitud en formato API
 * @returns El registro creado con su ID
 */
export const createSolicitud = async (
  payload: CreateSolicitudPayload
): Promise<SolicitudCreada> => {
  try {
    const { data } = await apiClient.post<SolicitudCreada[]>(
      "/solicitudes",
      payload,
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );

    const created = Array.isArray(data) ? data[0] : data;
    if (!created?.idsolicitud) {
      throw new Error("No se recibió la solicitud creada");
    }

    return created as SolicitudCreada;
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 403, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al registrar la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo registrar la solicitud. Intente nuevamente.");
  }
};
