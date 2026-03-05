import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import { crearMisaDesdeSolicitud } from "./crudMisa.action";
import {
  crearMencion,
  vincularMencionAMisa,
  obtenerMencionesPorSolicitud,
} from "./menciones.action";

type AccionEstado = "aprobar" | "denegar" | "revision";

/**
 * Cambia el estado de una solicitud
 * - aprobar: 18 (APROBADA)
 * - denegar: 19 (DENEGADA)
 * - revision: 17 (EN REVISIÓN)
 *
 * Al aprobar por primera vez:
 *  1. Crea la misa automáticamente
 *  2. Obtiene todas las menciones existentes de la solicitud
 *     - Si existen → las vincula todas a la misa en mencionesmisa
 *     - Si no existen → crea una mención por defecto y la vincula
 */
export const cambiarEstadoSolicitud = async (
  idSolicitud: number,
  accion: AccionEstado
): Promise<void> => {
  try {
    const estadosMap: Record<AccionEstado, number> = {
      aprobar: 18,
      denegar: 19,
      revision: 17,
    };

    const nuevoEstado = estadosMap[accion];

    // 1. Obtener datos completos de la solicitud
    const { data: solicitudData } = await apiClient.get(
      `/solicitudes?idsolicitud=eq.${idSolicitud}&select=*`
    );

    if (!Array.isArray(solicitudData) || solicitudData.length === 0) {
      throw new Error("No se encontró la solicitud");
    }

    const solicitud = solicitudData[0];
    const estadoAnterior: number = solicitud.idestadoproceso;

    // 2. Actualizar el estado de la solicitud
    await apiClient.patch(
      `/solicitudes?idsolicitud=eq.${idSolicitud}`,
      {
        idestadoproceso: nuevoEstado,
        fechamodificacion: new Date().toISOString(),
      }
    );

    // 3. Si se aprueba por primera vez → proceso automático
    if (accion === "aprobar" && estadoAnterior !== 18) {
      console.log("Solicitud aprobada, iniciando proceso automático...");

      try {
        // 3.1 Crear la misa
        const idMisaCreada = await crearMisaDesdeSolicitud({
          idtipomisa: solicitud.idtipomisa,
          fechacelebracion:
            solicitud.fechacelebracion || solicitud.fechamisadeseada,
          idhorario: solicitud.idhorario,
          intencion: solicitud.intencion || "",
          nombres: solicitud.nombres,
          apellidos: solicitud.apellidos,
        });

        console.log("✅ Misa creada con ID:", idMisaCreada);

        // 3.2 Obtener todas las menciones existentes de la solicitud
        const mencionesExistentes = await obtenerMencionesPorSolicitud(idSolicitud);

        // 3.3 Si la solicitud tiene intención propia, agregarla como mención adicional
        if (solicitud.intencion && solicitud.intencion.trim() !== '') {
          const idMencionIntencion = await crearMencion({
            idsolicitud: idSolicitud,
            descripcion: solicitud.intencion.trim(),
          });

          await vincularMencionAMisa({
            idmencion: idMencionIntencion,
            idmisa: idMisaCreada,
          });

          console.log('✅ Mención de intención de la solicitud creada y vinculada');
        }

        if (mencionesExistentes.length > 0) {
          // 3.4a Vincular cada mención existente a la misa
          console.log(`Vinculando ${mencionesExistentes.length} mención(es) a la misa...`);

          await Promise.all(
            mencionesExistentes.map((mencion) =>
              vincularMencionAMisa({
                idmencion: mencion.idmencion,
                idmisa: idMisaCreada,
              })
            )
          );

          console.log(`✅ ${mencionesExistentes.length} mención(es) vinculadas a la misa ID ${idMisaCreada}`);
        } else if (!solicitud.intencion || solicitud.intencion.trim() === '') {
          // 3.4b No hay menciones NI intención → crear una por defecto
          console.log('No hay menciones ni intención, creando mención por defecto...');

          const idMencionCreada = await crearMencion({
            idsolicitud: idSolicitud,
            descripcion: `Intención de ${solicitud.nombres} ${solicitud.apellidos}`,
          });

          await vincularMencionAMisa({
            idmencion: idMencionCreada,
            idmisa: idMisaCreada,
          });

          console.log('✅ Mención por defecto creada y vinculada a la misa ID', idMisaCreada);
        }

        console.log(
          "🎉 Proceso completado: Solicitud aprobada → Misa creada → Menciones vinculadas en mencionesmisa"
        );
      } catch (errorProceso) {
        console.error("Error en proceso automático post-aprobación:", errorProceso);
        // El estado YA fue actualizado, pero el proceso automático falló.
        // Se lanza el error para que el caller pueda informar al usuario.
        throw new Error(
          `Solicitud aprobada, pero hubo un error en el proceso automático: ${errorProceso instanceof Error
            ? errorProceso.message
            : "Error desconocido"
          }`
        );
      }
    }
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 404, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error ||
        "Error al cambiar el estado de la solicitud";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición");
  }
};