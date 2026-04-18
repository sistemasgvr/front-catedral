/** Fecha de hoy en zona local YYYY-MM-DD (evita desfase de `toISOString()` UTC). */
export function fechaHoyLocalYYYYMMDD(): string {
  return toYYYYMMDDLocal(new Date());
}

/** Convierte un `Date` (componentes locales) a `YYYY-MM-DD`. */
export function toYYYYMMDDLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYyyyMmDdLocal(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const parts = s.split("-").map(Number);
  const y = parts[0];
  const mo = parts[1];
  const da = parts[2];
  if (y == null || mo == null || da == null) return null;
  const d = new Date(y, mo - 1, da);
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== da) return null;
  return d;
}

/** true si la fecha (solo día) es estrictamente anterior a hoy en calendario local. */
export function esFechaCelebracionPasada(yyyyMmDd: string): boolean {
  if (!yyyyMmDd) return false;
  const selected = parseYyyyMmDdLocal(yyyyMmDd);
  if (!selected) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  return selected.getTime() < today.getTime();
}

/** Hoy o futuro (incluye el día actual). */
export function esFechaMisaSolicitable(yyyyMmDd: string): boolean {
  return !esFechaCelebracionPasada(yyyyMmDd);
}
