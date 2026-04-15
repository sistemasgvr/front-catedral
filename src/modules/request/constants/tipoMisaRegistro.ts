/**
 * Tipos de misa (tipomisa.idtipomisa) — producción.
 * Si se añaden tipos nuevos, actualizar mapas o usar resolución por nombre.
 */
export const TIPO_MISA = {
  COMUNITARIA: 1,
  PRIVADA: 2,
  BAUTIZO: 17,
  MATRIMONIO: 18,
  FUNERAL: 19,
} as const;

export type ModoRegistroLineas =
  | 'mencion'
  | 'nino'
  | 'pareja'
  | 'tarifa_plana';

const norm = (s: string) => s.trim().toLowerCase();

function getModoRegistroLineasPorNombre(nombreTipoMisa: string | undefined | null): ModoRegistroLineas {
  const n = norm(nombreTipoMisa || '');
  if (n.includes('comunitaria')) return 'mencion';
  if (n.includes('bautizo')) return 'nino';
  if (n.includes('matrimonio')) return 'pareja';
  if (n.includes('privada')) return 'tarifa_plana';
  return 'tarifa_plana';
}

/**
 * Prioriza idtipomisa; si no hay id válido, usa el nombre.
 */
export function getModoRegistroLineas(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): ModoRegistroLineas {
  if (idTipoMisa != null && idTipoMisa > 0) {
    switch (idTipoMisa) {
      case TIPO_MISA.COMUNITARIA:
        return 'mencion';
      case TIPO_MISA.BAUTIZO:
        return 'nino';
      case TIPO_MISA.MATRIMONIO:
        return 'pareja';
      case TIPO_MISA.PRIVADA:
      case TIPO_MISA.FUNERAL:
        return 'tarifa_plana';
      default:
        return getModoRegistroLineasPorNombre(nombreTipoMisa);
    }
  }
  return getModoRegistroLineasPorNombre(nombreTipoMisa);
}

export function omitePasoRegistroLineas(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): boolean {
  return getModoRegistroLineas(idTipoMisa, nombreTipoMisa) === 'tarifa_plana';
}

/**
 * Campo «Intención» en datos de celebración: aplica a misa privada y funeral.
 * Bautizo y matrimonio no llevan intención (el detalle va en niños/parejas).
 * Misa comunitaria tampoco usa este campo en el paso 2 (elige misa en calendario).
 */
export function requiereCampoIntencion(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): boolean {
  if (idTipoMisa != null && idTipoMisa > 0) {
    if (idTipoMisa === TIPO_MISA.PRIVADA || idTipoMisa === TIPO_MISA.FUNERAL) return true;
    if (
      idTipoMisa === TIPO_MISA.BAUTIZO ||
      idTipoMisa === TIPO_MISA.MATRIMONIO ||
      idTipoMisa === TIPO_MISA.COMUNITARIA
    ) {
      return false;
    }
  }
  const n = norm(nombreTipoMisa || '');
  if (n.includes('bautizo') || n.includes('matrimonio') || n.includes('comunitaria')) return false;
  if (n.includes('privada') || n.includes('funeral')) return true;
  return false;
}

export function etiquetaPasoRegistro(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): string {
  const modo = getModoRegistroLineas(idTipoMisa, nombreTipoMisa);
  if (modo === 'nino') return 'Niños';
  if (modo === 'pareja') return 'Parejas';
  return 'Menciones';
}

export function etiquetaLineaSingular(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): string {
  const modo = getModoRegistroLineas(idTipoMisa, nombreTipoMisa);
  if (modo === 'nino') return 'Niño/a';
  if (modo === 'pareja') return 'Pareja';
  return 'Mención';
}

export function descripcionPasoRegistro(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): string {
  const modo = getModoRegistroLineas(idTipoMisa, nombreTipoMisa);
  if (modo === 'nino') {
    return 'Registre un ítem por cada niño/a a bautizar. El costo del bautizo se multiplica por la cantidad registrada.';
  }
  if (modo === 'pareja') {
    return 'Registre un ítem por cada pareja. El costo se multiplica por la cantidad de parejas.';
  }
  return 'Agregue las menciones que desea incluir en la misa.';
}

export function placeholderLinea(
  idTipoMisa: number | null | undefined,
  nombreTipoMisa?: string | null,
): string {
  const modo = getModoRegistroLineas(idTipoMisa, nombreTipoMisa);
  if (modo === 'nino') return 'Ej: Juan Pérez García — fecha de nacimiento, padres…';
  if (modo === 'pareja') return 'Ej: Juan Pérez & María López — notas…';
  return 'Ej: En memoria de…, por la salud de…';
}
