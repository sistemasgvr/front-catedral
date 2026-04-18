import type { ICrearMisaForm } from "../interfaces/misa.interface";
import { crearMisa } from "./crudMisa.action";
import { crearMencion, vincularMencionAMisa } from "./menciones.action";
import { createSolicitud } from "../../request/actions/createSolicitud.action";
import type { CreateSolicitudPayload } from "../../request/actions/createSolicitud.action";

export interface RegistrarMisaAdminConSolicitudParams {
  misa: ICrearMisaForm;
  solicitud: CreateSolicitudPayload;
  /** Texto de cada niño/a o pareja (misma semántica que en solicitud pública). */
  descripcionesLineas: string[];
}

/**
 * Registro admin: solicitud + menciones + misa + vínculos (bautizo / matrimonio).
 * El payload de solicitud puede ser técnico (p. ej. “Parroquia / Registro interno”) solo para cumplir FK en `menciones`;
 * lo relevante para la parroquia son las descripciones de parejas / niños/as.
 */
export const registrarMisaAdminConSolicitud = async (
  params: RegistrarMisaAdminConSolicitudParams,
): Promise<{ idMisa: number; idSolicitud: number }> => {
  const creada = await createSolicitud(params.solicitud);
  const idSolicitud = creada.idsolicitud;

  const idsMenciones: number[] = [];
  for (const descripcion of params.descripcionesLineas) {
    const idm = await crearMencion({
      idsolicitud: idSolicitud,
      descripcion: descripcion.trim(),
    });
    idsMenciones.push(idm);
  }

  const idMisa = await crearMisa(params.misa);

  for (const idmencion of idsMenciones) {
    await vincularMencionAMisa({ idmencion, idmisa: idMisa });
  }

  return { idMisa, idSolicitud };
};
