import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { IMisaDetalle } from '../interfaces/misa.interface';

export interface MisaReportFiltrosExcel {
  fechaDesde: string;
  fechaHasta: string;
  busqueda: string;
  tipoMisaNombre: string | null;
  estadoLabel: string | null;
}

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFC88A2A' },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT as ExcelJS.Font;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  row.height = 22;
}

function parseTimeParts(hora: string): { h: number; m: number } {
  if (!hora || !hora.includes(':')) return { h: 0, m: 0 };
  const [hh = '0', mm = '0'] = hora.split(':');
  return { h: parseInt(hh, 10) || 0, m: parseInt(mm, 10) || 0 };
}

/** Hora como fracción de día (Excel) a partir de time "HH:MM:SS" */
function horaComoFraccionDia(hora: string): number {
  const { h, m } = parseTimeParts(hora);
  return (h * 3600 + m * 60) / 86400;
}

function precioUnitarioTipo(misa: IMisaDetalle): number {
  const p = misa.tipomisa?.precio ?? 0;
  return Number.isFinite(p) ? p : 0;
}

function cantidadMenciones(misa: IMisaDetalle): number {
  return (misa.menciones ?? []).length;
}

/** Ingreso total: tarifa del tipo × cada mención (0 si no hay menciones). */
function ingresoTotalPorMenciones(misa: IMisaDetalle): number {
  return precioUnitarioTipo(misa) * cantidadMenciones(misa);
}

/**
 * Genera un libro Excel con hojas listas para filtrar / tablas dinámicas:
 * — Resumen por día: ingresos = Σ (precio tipo × menciones), total menciones, solicitudes únicas
 * — Detalle de misas
 * — Menciones y solicitudes (granularidad por solicitud)
 */
export async function generarYDescargarReporteMisasExcel(
  misasDetalle: IMisaDetalle[],
  meta: { filtros: MisaReportFiltrosExcel; totalEnListadoFiltrado: number }
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Gestión de Misas';
  wb.created = new Date();

  const ordenadas = [...misasDetalle].sort((a, b) => {
    const c = a.fechacelebracion.localeCompare(b.fechacelebracion);
    if (c !== 0) return c;
    return (a.horainicio || '').localeCompare(b.horainicio || '');
  });

  type DiaAgg = {
    misas: IMisaDetalle[];
    solicitudesIds: Set<number>;
    totalMenciones: number;
    ingresosPorMenciones: number;
  };
  const porDia = new Map<string, DiaAgg>();

  for (const misa of ordenadas) {
    const key = misa.fechacelebracion;
    if (!porDia.has(key)) {
      porDia.set(key, {
        misas: [],
        solicitudesIds: new Set(),
        totalMenciones: 0,
        ingresosPorMenciones: 0,
      });
    }
    const g = porDia.get(key)!;
    g.misas.push(misa);
    const nMen = cantidadMenciones(misa);
    g.totalMenciones += nMen;
    g.ingresosPorMenciones += ingresoTotalPorMenciones(misa);
    for (const mm of misa.menciones ?? []) {
      const id = mm.mencion?.solicitud?.idsolicitud;
      if (id != null) g.solicitudesIds.add(id);
    }
  }

  const diasOrdenados = [...porDia.keys()].sort();

  // ——— Hoja información ———
  const wsInfo = wb.addWorksheet('Información', {
    views: [{ state: 'frozen', ySplit: 0 }],
  });
  wsInfo.getColumn(1).width = 28;
  wsInfo.getColumn(2).width = 72;
  const infoRows: [string, string][] = [
    ['Reporte', 'Misas — ingresos, celebraciones y solicitudes vinculadas (menciones)'],
    ['Generado', new Date().toLocaleString('es-PE')],
    [
      'Uso en Excel',
      'Active filtros (encabezados) o inserte tabla dinámica usando las hojas de detalle. Las columnas de fecha están tipadas como fecha para filtrar por rango.',
    ],
    ['Rango fechas (filtro UI)', `${meta.filtros.fechaDesde || '—'} → ${meta.filtros.fechaHasta || '—'}`],
    ['Búsqueda', meta.filtros.busqueda || '—'],
    ['Tipo de misa', meta.filtros.tipoMisaNombre || 'Todos'],
    ['Estado', meta.filtros.estadoLabel || 'Todos'],
    ['Registros en exportación', String(misasDetalle.length)],
    ['Total en listado filtrado (UI)', String(meta.totalEnListadoFiltrado)],
    [
      'Ingresos por día',
      'Suma de (precio del tipo de misa × cantidad de menciones) por cada celebración ese día. Sin menciones = S/ 0 para esa misa.',
    ],
    [
      'Precio e ingreso',
      'Precio unitario = tarifa del tipo de misa. Ingreso total (por misa) = precio unitario × cantidad de menciones. En la hoja de menciones, cada fila suma una vez el precio unitario (una mención = un cobro).',
    ],
    [
      'Solicitudes por día',
      'Cantidad distinta de IDs de solicitud aparecidas en menciones de misas celebradas ese día.',
    ],
  ];
  infoRows.forEach(([a, b], i) => {
    const row = wsInfo.getRow(i + 1);
    row.getCell(1).value = a;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = b;
    row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
  });

  // ——— Resumen por día ———
  const wsRes = wb.addWorksheet('Resumen por día', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  wsRes.columns = [
    { header: 'Fecha', key: 'fecha', width: 14 },
    { header: 'Cantidad de misas', key: 'nMisas', width: 18 },
    { header: 'Total menciones', key: 'nMen', width: 16 },
    { header: 'Ingresos (precio × menciones)', key: 'ingresos', width: 26 },
    { header: 'Solicitudes únicas (menciones)', key: 'nSol', width: 30 },
  ];
  const headerRes = wsRes.getRow(1);
  styleHeaderRow(headerRes);

  let rowRes = 2;
  for (const dia of diasOrdenados) {
    const g = porDia.get(dia)!;
    const r = wsRes.getRow(rowRes);
    r.getCell(1).value = new Date(`${dia}T12:00:00`);
    r.getCell(1).numFmt = 'yyyy-mm-dd';
    r.getCell(2).value = g.misas.length;
    r.getCell(3).value = g.totalMenciones;
    r.getCell(4).value = g.ingresosPorMenciones;
    r.getCell(4).numFmt = '#,##0.00';
    r.getCell(5).value = g.solicitudesIds.size;
    rowRes++;
  }
  if (diasOrdenados.length > 0) {
    wsRes.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowRes - 1, column: 5 },
    };
  }

  // ——— Detalle misas ———
  const wsDet = wb.addWorksheet('Detalle misas', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  wsDet.columns = [
    { header: 'ID Misa', key: 'id', width: 10 },
    { header: 'Fecha celebración', key: 'fecha', width: 18 },
    { header: 'Hora inicio', key: 'hi', width: 12 },
    { header: 'Hora fin', key: 'hf', width: 12 },
    { header: 'Tipo de misa', key: 'tipo', width: 26 },
    { header: 'Precio unitario tipo (S/)', key: 'precio', width: 22 },
    { header: 'Cant. menciones', key: 'nMen', width: 16 },
    { header: 'Ingreso total (S/)', key: 'ingTotal', width: 20 },
    { header: 'Estado', key: 'estado', width: 10 },
    { header: 'Título', key: 'titulo', width: 36 },
    { header: 'IDs solicitud (menciones)', key: 'ids', width: 36 },
  ];
  styleHeaderRow(wsDet.getRow(1));

  let rowDet = 2;
  for (const misa of ordenadas) {
    const menciones = misa.menciones ?? [];
    const idsSol = [
      ...new Set(
        menciones
          .map((m) => m.mencion?.solicitud?.idsolicitud)
          .filter((id): id is number => id != null)
      ),
    ].sort((a, b) => a - b);
    const r = wsDet.getRow(rowDet);
    r.getCell(1).value = misa.idmisa;
    r.getCell(2).value = new Date(`${misa.fechacelebracion}T12:00:00`);
    r.getCell(2).numFmt = 'yyyy-mm-dd';
    r.getCell(3).value = horaComoFraccionDia(misa.horainicio);
    r.getCell(3).numFmt = 'hh:mm';
    r.getCell(4).value = horaComoFraccionDia(misa.horafin);
    r.getCell(4).numFmt = 'hh:mm';
    r.getCell(5).value = misa.tipomisa?.nombre ?? '—';
    const pUnit = precioUnitarioTipo(misa);
    const nMen = menciones.length;
    const ingresoTotal = ingresoTotalPorMenciones(misa);
    r.getCell(6).value = pUnit;
    r.getCell(6).numFmt = '#,##0.00';
    r.getCell(7).value = nMen;
    r.getCell(8).value = ingresoTotal;
    r.getCell(8).numFmt = '#,##0.00';
    r.getCell(9).value = misa.estado ? 'Activo' : 'Inactivo';
    r.getCell(10).value = misa.titulo ?? '—';
    r.getCell(11).value = idsSol.length ? idsSol.join(', ') : '—';
    rowDet++;
  }
  if (ordenadas.length > 0) {
    wsDet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowDet - 1, column: 11 },
    };
  }

  // ——— Menciones / solicitudes ———
  const wsMen = wb.addWorksheet('Menciones y solicitudes', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  wsMen.columns = [
    { header: 'Fecha misa', key: 'fecha', width: 16 },
    { header: 'ID Misa', key: 'idm', width: 10 },
    { header: 'ID Solicitud', key: 'ids', width: 14 },
    { header: 'Precio unitario tipo (S/)', key: 'pUnit', width: 22 },
    { header: 'Importe línea (S/)', key: 'imp', width: 18 },
    { header: 'Nombres', key: 'nom', width: 22 },
    { header: 'Apellidos', key: 'ape', width: 22 },
    { header: 'Intención', key: 'int', width: 40 },
    { header: 'Descripción mención', key: 'desc', width: 36 },
  ];
  styleHeaderRow(wsMen.getRow(1));

  let rowMen = 2;
  for (const misa of ordenadas) {
    const unit = precioUnitarioTipo(misa);
    for (const item of misa.menciones ?? []) {
      const sol = item.mencion?.solicitud;
      if (!sol) continue;
      const r = wsMen.getRow(rowMen);
      r.getCell(1).value = new Date(`${misa.fechacelebracion}T12:00:00`);
      r.getCell(1).numFmt = 'yyyy-mm-dd';
      r.getCell(2).value = misa.idmisa;
      r.getCell(3).value = sol.idsolicitud;
      r.getCell(4).value = unit;
      r.getCell(4).numFmt = '#,##0.00';
      r.getCell(5).value = unit;
      r.getCell(5).numFmt = '#,##0.00';
      r.getCell(6).value = sol.nombres;
      r.getCell(7).value = sol.apellidos;
      r.getCell(8).value = sol.intencion ?? '—';
      r.getCell(9).value = item.mencion?.descripcion ?? '—';
      rowMen++;
    }
  }
  if (rowMen > 2) {
    wsMen.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowMen - 1, column: 9 },
    };
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const stamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `reporte_misas_${stamp}.xlsx`);
}
