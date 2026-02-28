import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import { crearMisaDesdeSolicitud } from "./crudMisa.action";
import { crearMencion, vincularMencionAMisa } from "./menciones.action";

type AccionEstado = 'aprobar' | 'denegar' | 'revision';

/**
 * Cambia el estado de una solicitud
 * IMPORTANTE: Los IDs de estado deben coincidir con tu base de datos
 * - aprobar: 18 (APROBADA)
 * - denegar: 19 (DENEGADA)
 * - revision: 17 (EN REVISIÓN)
 */
export const cambiarEstadoSolicitud = async (
  idSolicitud: number,
  accion: AccionEstado
): Promise<void> => {
  try {
    const estadosMap = {
      aprobar: 18,   // APROBADA
      denegar: 19,   // DENEGADA
      revision: 17,  // EN REVISIÓN
    };

    const nuevoEstado = estadosMap[accion];

    // Obtener datos de la solicitud antes de actualizar
    const { data: solicitudData } = await apiClient.get(
      `/solicitudes?idsolicitud=eq.${idSolicitud}&select=*`
    );

    if (!Array.isArray(solicitudData) || solicitudData.length === 0) {
      throw new Error("No se encontró la solicitud");
    }

    const solicitud = solicitudData[0];
    const estadoAnterior = solicitud.idestadoproceso;

    // Actualizar el estado
    await apiClient.patch(
      `/solicitudes?idsolicitud=eq.${idSolicitud}`,
      {
        idestadoproceso: nuevoEstado,
        fechamodificacion: new Date().toISOString(),
      }
    );

    // Si se aprobó y antes no estaba aprobada, crear misa automáticamente
    if (accion === 'aprobar' && estadoAnterior !== 18) {
      console.log('Solicitud aprobada, creando misa automáticamente...');
      
      try {
        // Crear la misa
        const idMisaCreada = await crearMisaDesdeSolicitud({
          idtipomisa: solicitud.idtipomisa,
          fechacelebracion: solicitud.fechacelebracion || solicitud.fechamisadeseada,
          idhorario: solicitud.idhorario,
          intencion: solicitud.intencion || '',
          nombres: solicitud.nombres,
          apellidos: solicitud.apellidos,
        });

        console.log('Misa creada con ID:', idMisaCreada);

        // Crear mención
        const idMencionCreada = await crearMencion({
          idsolicitud: idSolicitud,
          descripcion: solicitud.intencion || `Intención de ${solicitud.nombres} ${solicitud.apellidos}`,
        });

        console.log('Mención creada con ID:', idMencionCreada);

        // Vincular mención con misa
        await vincularMencionAMisa({
          idmencion: idMencionCreada,
          idmisa: idMisaCreada,
        });

        console.log('Proceso completado: Solicitud → Misa → Mención');
      } catch (errorMisa) {
        console.error('Error al crear misa automática:', errorMisa);
        throw new Error(`Estado actualizado, pero hubo un error al crear la misa: ${errorMisa instanceof Error ? errorMisa.message : 'Error desconocido'}`);
      }
    }
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al cambiar el estado de la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};