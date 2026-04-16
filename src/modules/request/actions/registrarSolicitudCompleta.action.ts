import type { ISolicitud, IMencion } from "../interfaces/solicitud.interface";
import { VOUCHER_PAGO_EFECTIVO_MARKER } from "../constants/pagoSolicitud";
import { createSolicitud } from "./createSolicitud.action";
import { createMencion } from "./createMencion.action";
import { uploadVoucher } from "./uploadVoucher.action";

export interface RegistrarSolicitudResult {
  idSolicitud: number;
  success: boolean;
}

/**
 * Registra una solicitud completa: sube el voucher (si aplica) y crea la solicitud y sus menciones.
 * Si `metodoPago === 'efectivo'`, no se sube archivo y `voucherpago` guarda un marcador acordado.
 */
export const registrarSolicitudCompleta = async (
  solicitud: ISolicitud,
  archivoVoucher: File | null,
): Promise<RegistrarSolicitudResult> => {
  const pagoEfectivo = solicitud.metodoPago === "efectivo";

  const voucherUrl = pagoEfectivo
    ? VOUCHER_PAGO_EFECTIVO_MARKER
    : archivoVoucher
      ? await uploadVoucher(archivoVoucher)
      : null;

  if (!voucherUrl) {
    throw new Error("Debe adjuntar el comprobante de pago o elegir pago en efectivo.");
  }

  // 2. Mapear y crear solicitud (schema: solicitudes)
  const celularNum =
    typeof solicitud.celular === "string"
      ? parseInt(solicitud.celular, 10) || null
      : solicitud.celular;
  const fechaCelebracion =
    solicitud.fechaCelebracion || solicitud.fechaMisaDeseada || null;

  const solicitudPayload = {
    idtipodocumento: solicitud.idTipoDocumento!,
    nrodocumento: solicitud.nroDocumento,
    nombres: solicitud.nombres,
    apellidos: solicitud.apellidos,
    celular: celularNum,
    correo: solicitud.correo || null,
    fechacelebracion: fechaCelebracion,
    idtipomisa: solicitud.idTipoMisa ?? null,
    idhorario: solicitud.idHorario ?? null,
    intencion: solicitud.intencion || null,
    voucherpago: voucherUrl,
    montototal: solicitud.montoTotal,
    fechamisadeseada: fechaCelebracion,
    estado: true,
    idusuariocreacion: solicitud.idUsuarioCreacion,
  };

  const solicitudCreada = await createSolicitud(solicitudPayload);
  const idSolicitud = solicitudCreada.idsolicitud;

  // 3. Crear menciones
  const menciones: IMencion[] = solicitud.menciones || [];
  for (const mencion of menciones) {
    await createMencion({
      idsolicitud: idSolicitud,
      descripcion: mencion.descripcion,
      estado: true,
      idusuariocreacion: solicitud.idUsuarioCreacion,
    });
  }

  return { idSolicitud, success: true };
};
