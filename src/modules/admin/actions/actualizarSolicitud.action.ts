import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import { crearMisaDesdeSolicitud } from "./crudMisa.action";
import { crearMencion, vincularMencionAMisa } from "./menciones.action";

export interface IActualizarSolicitudData {
  nombres: string;
  apellidos: string;
  idtipodocumento: number;
  nrodocumento: string;
  celular: number;
  correo: string;
  idtipomisa: number;
  idhorario: number;
  fechamisadeseada: string;
  fechacelebracion: string;
  fechasolicitud: string;
  intencion: string;
  montototal: number;
  voucherpago: string;
  idestadoproceso: number | null; // TODO EN MINÚSCULAS
  estado: boolean;
}

/**
 * Actualiza los datos de una solicitud
 * @param idSolicitud - ID de la solicitud a actualizar
 * @param data - Datos a actualizar
 */
export const actualizarSolicitud = async (
  idSolicitud: number,
  data: IActualizarSolicitudData
): Promise<void> => {
  try {
    // Obtener el estado anterior de la solicitud
    const { data: solicitudAnterior } = await apiClient.get(
      `/solicitudes?idsolicitud=eq.${idSolicitud}&select=idestadoproceso,idtipomisa,fechacelebracion,idhorario,intencion,nombres,apellidos`
    );

    const estadoAnterior = Array.isArray(solicitudAnterior) && solicitudAnterior.length > 0
      ? solicitudAnterior[0].idestadoproceso
      : null;

    // Actualizar la solicitud
    await apiClient.patch(
      `/solicitudes?idsolicitud=eq.${idSolicitud}`,
      {
        ...data,
        fechamodificacion: new Date().toISOString(),
      }
    );

    // Si el estado cambió a APROBADA (18) y antes no estaba aprobada
    if (data.idestadoproceso === 18 && estadoAnterior !== 18) {
      console.log('Solicitud aprobada, creando misa automáticamente...');
      
      try {
        // Crear la misa automáticamente
        const idMisaCreada = await crearMisaDesdeSolicitud({
          idtipomisa: data.idtipomisa,
          fechacelebracion: data.fechacelebracion,
          idhorario: data.idhorario,
          intencion: data.intencion || '',
          nombres: data.nombres,
          apellidos: data.apellidos,
        });

        console.log('Misa creada con ID:', idMisaCreada);

        // Crear la mención asociada a la solicitud
        const idMencionCreada = await crearMencion({
          idsolicitud: idSolicitud,
          descripcion: data.intencion || `Intención de ${data.nombres} ${data.apellidos}`,
        });

        console.log('Mención creada con ID:', idMencionCreada);

        // Vincular la mención con la misa
        await vincularMencionAMisa({
          idmencion: idMencionCreada,
          idmisa: idMisaCreada,
        });

        console.log('Mención vinculada a la misa exitosamente');
      } catch (errorMisa) {
        console.error('Error al crear misa automática:', errorMisa);
        // No lanzamos el error para no revertir la actualización de la solicitud
        // pero lo registramos para que el usuario sepa
        throw new Error(`Solicitud actualizada, pero hubo un error al crear la misa: ${errorMisa instanceof Error ? errorMisa.message : 'Error desconocido'}`);
      }
    }
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};