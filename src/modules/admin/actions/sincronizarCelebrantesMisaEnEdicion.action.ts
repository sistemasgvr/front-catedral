import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import { createSolicitud } from "../../request/actions/createSolicitud.action";
import type { CreateSolicitudPayload } from "../../request/actions/createSolicitud.action";
import { VOUCHER_PAGO_EFECTIVO_MARKER } from "../../request/constants/pagoSolicitud";
import { ID_ESTADO_SOLICITUD_APROBADA } from "../constants/solicitudEstadoProceso";
import {
  actualizarMencionDescripcion,
  crearMencion,
  desactivarMencionMisa,
  vincularMencionAMisa,
} from "./menciones.action";

export interface LineaCelebranteEdicion {
  idmencion: number | null;
  idmencionmisa: number | null;
  descripcion: string;
}

function lineasConTextoValido(lineas: LineaCelebranteEdicion[]): LineaCelebranteEdicion[] {
  return lineas.filter((l) => l.descripcion.trim().length >= 5);
}

async function patchSolicitud(
  idsolicitud: number,
  body: Record<string, unknown>,
): Promise<void> {
  await apiClient.patch(`/solicitudes?idsolicitud=eq.${idsolicitud}`, {
    ...body,
    fechamodificacion: new Date().toISOString(),
  });
}

/**
 * En edición de misa (bautizo/matrimonio): crea solicitud interna si faltaba,
 * desvincula celebrantes quitados, actualiza textos, crea nuevos y ajusta monto/horario en solicitud.
 */
export async function sincronizarCelebrantesMisaEnEdicion(params: {
  idMisa: number;
  idTipoMisa: number;
  fechacelebracion: string;
  precioUnitario: number;
  idTipoDocumentoSistema: number;
  idsolicitudInicial: number | null;
  idHorarioLista: number;
  lineas: LineaCelebranteEdicion[];
  snapshot: LineaCelebranteEdicion[];
}): Promise<{ idsolicitud: number }> {
  const validas = lineasConTextoValido(params.lineas);
  const monto = params.precioUnitario * validas.length;

  let idsolicitud = params.idsolicitudInicial;

  if (idsolicitud == null) {
    const payload: CreateSolicitudPayload = {
      idtipodocumento: params.idTipoDocumentoSistema,
      nrodocumento: "00000000",
      nombres: "Parroquia",
      apellidos: "Registro interno",
      celular: null,
      correo: null,
      fechacelebracion: params.fechacelebracion,
      idtipomisa: params.idTipoMisa,
      idhorario: params.idHorarioLista,
      intencion: null,
      voucherpago: VOUCHER_PAGO_EFECTIVO_MARKER,
      montototal: monto,
      fechamisadeseada: params.fechacelebracion,
      estado: true,
      idusuariocreacion: null,
      idestadoproceso: ID_ESTADO_SOLICITUD_APROBADA,
    };
    const creada = await createSolicitud(payload);
    idsolicitud = creada.idsolicitud;
    for (const linea of validas) {
      const idm = await crearMencion({
        idsolicitud,
        descripcion: linea.descripcion.trim(),
      });
      await vincularMencionAMisa({ idmencion: idm, idmisa: params.idMisa });
    }
    return { idsolicitud };
  }

  try {
    await patchSolicitud(idsolicitud, {
      idhorario: params.idHorarioLista,
      fechacelebracion: params.fechacelebracion,
      fechamisadeseada: params.fechacelebracion,
      montototal: monto,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "No se pudo actualizar la solicitud asociada",
      );
    }
    throw error;
  }

  for (const old of params.snapshot) {
    if (old.idmencion == null || old.idmencionmisa == null) continue;
    const still = params.lineas.some((l) => l.idmencion === old.idmencion);
    if (!still) {
      await desactivarMencionMisa(old.idmencionmisa);
    }
  }

  const snapDesc = new Map<number, string>();
  for (const s of params.snapshot) {
    if (s.idmencion != null) snapDesc.set(s.idmencion, s.descripcion.trim());
  }

  for (const linea of params.lineas) {
    if (linea.idmencion == null) continue;
    const d = linea.descripcion.trim();
    if (d.length < 5) continue;
    const prev = snapDesc.get(linea.idmencion);
    if (prev !== d) {
      await actualizarMencionDescripcion(linea.idmencion, d);
    }
  }

  for (const linea of params.lineas) {
    if (linea.idmencion != null) continue;
    const d = linea.descripcion.trim();
    if (d.length < 5) continue;
    const idm = await crearMencion({ idsolicitud, descripcion: d });
    await vincularMencionAMisa({ idmencion: idm, idmisa: params.idMisa });
  }

  return { idsolicitud };
}
