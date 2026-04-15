import type { ITipoMisa } from "../interfaces/tipoMisa.interface";

/** Respuesta PostgREST para FK tipomisa (objeto o, en edge cases, array) */
type EmbeddedTipo = { nombre?: string | null } | null | undefined;

/**
 * Nombre del tipo de misa: prioriza relación embebida en la solicitud, luego catálogo en memoria.
 */
export function resolveTipoMisaNombre(
  idtipomisa: number | null | undefined,
  embedded: EmbeddedTipo | EmbeddedTipo[],
  catalogo: ITipoMisa[],
): string {
  const emb = Array.isArray(embedded) ? embedded[0] : embedded;
  const n = emb?.nombre?.trim();
  if (n) return n;
  if (idtipomisa == null) return "N/A";
  return catalogo.find((t) => t.idtipomisa === idtipomisa)?.nombre ?? "N/A";
}
