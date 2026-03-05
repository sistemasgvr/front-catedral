import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IMisaDetalle, ICrearMisaForm, IEditarMisaForm } from "../interfaces/misa.interface";

/**
 * Obtiene el detalle completo de una misa
 */
export const obtenerDetalleMisa = async (idMisa: number): Promise<IMisaDetalle> => {
  try {
    const { data } = await apiClient.get<IMisaDetalle[]>(
      `/misas?select=*,tipomisa:idtipomisa(*),menciones:mencionesmisa(idmencionmisa,mencion:idmencion(idmencion,descripcion,solicitud:idsolicitud(idsolicitud,nombres,apellidos,celular,correo,nrodocumento,intencion)))&idmisa=eq.${idMisa}`
    );

    if (!Array.isArray(data) || data.length === 0) throw new Error("No se encontró la misa");
    const misa = data[0];
    if (!misa) throw new Error("No se encontró la misa");
    return misa;
  } catch (error) {
    if (isAxiosError(error) && [400, 401, 404, 422].includes(error.response?.status ?? 0)) {
      throw new Error(error.response?.data?.error || "Error al obtener el detalle de la misa");
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







/**
 * Crea una misa automáticamente desde una solicitud aprobada
 */
export const crearMisaDesdeSolicitud = async (solicitud: {
  idtipomisa: number;
  fechacelebracion: string;
  idhorario: number;
  intencion: string;
  nombres: string;
  apellidos: string;
}): Promise<number> => {
  try {
    // Obtener el horario para extraer hora inicio y fin
    const { data: horarioData } = await apiClient.get(
      `/opcioneslista?idopcionlista=eq.${solicitud.idhorario}&select=nombre,descripcion`
    );

    let horainicio = '09:00:00';
    let horafin = '10:00:00';

    if (Array.isArray(horarioData) && horarioData.length > 0) {
      const horario = horarioData[0];
      // Intentar extraer las horas del nombre o descripción
      // Formato esperado: "09:00 AM - 10:00 AM" o similar
      const horarioTexto = horario.nombre || horario.descripcion || '';
      const horarioMatch = horarioTexto.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi);

      if (horarioMatch && horarioMatch.length >= 2) {
        horainicio = convertirA24Horas(horarioMatch[0]);
        horafin = convertirA24Horas(horarioMatch[1]);
      }
    }

    // Crear título para la misa
    const titulo = `Misa para ${solicitud.nombres} ${solicitud.apellidos}`;

    // Crear la misa
    const { data: misaCreada } = await apiClient.post("/misas", {
      idtipomisa: solicitud.idtipomisa,
      titulo: titulo.substring(0, 255), // Limitar longitud
      fechacelebracion: solicitud.fechacelebracion,
      horainicio,
      horafin,
      estado: true,
      fechacreacion: new Date().toISOString(),
    }, {
      headers: {
        'Prefer': 'return=representation'
      }
    });

    // Retornar el ID de la misa creada
    if (Array.isArray(misaCreada) && misaCreada.length > 0) {
      return misaCreada[0].idmisa;
    }

    throw new Error("No se pudo obtener el ID de la misa creada");
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al crear la misa desde solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo crear la misa desde la solicitud");
  }
};

/**
 * Convierte hora en formato 12h a 24h
 */
function convertirA24Horas(hora?: string): string {
  try {
    if (!hora) {
      return "09:00:00";
    }

    const match = hora.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

    if (!match) {
      return "09:00:00";
    }

    // Destructuración segura
    const [, horasStr, minutosStr, periodoRaw] = match;

    // Validación extra por seguridad para TS
    if (!horasStr || !minutosStr) {
      return "09:00:00";
    }

    let horas = parseInt(horasStr, 10);
    const minutos = minutosStr;
    const periodo = periodoRaw?.toUpperCase();

    if (horas < 0 || horas > 12 || parseInt(minutos, 10) > 59) {
      return "09:00:00";
    }

    if (periodo === "PM" && horas !== 12) {
      horas += 12;
    } else if (periodo === "AM" && horas === 12) {
      horas = 0;
    }

    return `${String(horas).padStart(2, "0")}:${minutos}:00`;
  } catch (error) {
    console.error("Error convirtiendo hora:", error);
    return "09:00:00";
  }
}