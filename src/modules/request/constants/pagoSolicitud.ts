/**
 * Valor almacenado en `solicitudes.voucherpago` cuando el solicitante indicó
 * que pagará en efectivo en la iglesia (sin comprobante digital).
 * Debe ser un literal estable: el backend solo guarda texto en esa columna.
 */
export const VOUCHER_PAGO_EFECTIVO_MARKER = "PAGO_EN_EFECTIVO_IGLESIA";

export function esMarcadorPagoEfectivo(
  voucherpago: string | null | undefined,
): boolean {
  return (
    typeof voucherpago === "string" &&
    voucherpago.trim() === VOUCHER_PAGO_EFECTIVO_MARKER
  );
}
