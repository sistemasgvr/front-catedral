import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { IMisaDetalle, IMencionMisa } from '../interfaces/misa.interface';

export interface MisaReportFiltrosExcel {
  fechaDesde: string;
  fechaHasta: string;
  busqueda: string;
  tipoMisaNombre: string | null;
  estadoLabel: string | null;
}

/** Coincide con `aprobar` en cambiarEstadoSolicitud.action.ts */
const ID_ESTADO_SOLICITUD_APROBADA = 18;

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

/**
 * OOXML no admite caracteres de control en shared strings (Excel puede marcar el libro como dañado).
 */
function textoExcelSeguro(value: string | null | undefined): string {
  if (value == null) return '';
  return String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function numeroSeguro(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

function styleHeaderRow(row: ExcelJS.Row, lastCol: number) {
  for (let c = 1; c <= lastCol; c++) {
    const cell = row.getCell(c);
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT as ExcelJS.Font;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  }
  row.height = 24;
}

function parseTimeParts(hora: string): { h: number; m: number } {
  if (!hora || !hora.includes(':')) return { h: 0, m: 0 };
  const [hh = '0', mm = '0'] = hora.split(':');
  return { h: parseInt(hh, 10) || 0, m: parseInt(mm, 10) || 0 };
}

function horaComoFraccionDia(hora: string): number {
  const { h, m } = parseTimeParts(hora);
  return (h * 3600 + m * 60) / 86400;
}

function precioUnitarioTipo(misa: IMisaDetalle): number {
  const p = misa.tipomisa?.precio ?? 0;
  return Number.isFinite(p) ? p : 0;
}

function esSolicitudAprobada(
  solicitud: { idestadoproceso?: number } | null | undefined
): boolean {
  return solicitud != null && solicitud.idestadoproceso === ID_ESTADO_SOLICITUD_APROBADA;
}

function mencionesAprobadas(misa: IMisaDetalle): IMencionMisa[] {
  return (misa.menciones ?? []).filter((mm) => esSolicitudAprobada(mm.mencion?.solicitud));
}

function cantidadMencionesAprobadas(misa: IMisaDetalle): number {
  return mencionesAprobadas(misa).length;
}

/** Ingreso: tarifa del tipo × cada mención con solicitud aprobada. */
function ingresoPorMencionesAprobadas(misa: IMisaDetalle): number {
  return precioUnitarioTipo(misa) * cantidadMencionesAprobadas(misa);
}

/**
 * Excel: Información + detalle de misas + menciones aprobadas.
 * Ingresos y menciones solo con solicitud aprobada.
 */
export async function generarYDescargarReporteMisasExcel(
  misasDetalle: IMisaDetalle[],
  meta: { filtros: MisaReportFiltrosExcel; totalEnListadoFiltrado: number }
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Gestion de Misas';
  wb.created = new Date();

  const ordenadas = [...misasDetalle].sort((a, b) => {
    const c = a.fechacelebracion.localeCompare(b.fechacelebracion);
    if (c !== 0) return c;
    return (a.horainicio || '').localeCompare(b.horainicio || '');
  });

  // ——— Hoja información ———
  const wsInfo = wb.addWorksheet('Informacion', {});
  wsInfo.getColumn(1).width = 28;
  wsInfo.getColumn(2).width = 72;
  const infoRows: [string, string][] = [
    ['Reporte', 'Misas - solo solicitudes aprobadas en ingresos y menciones'],
    ['Generado', new Date().toLocaleString('es-PE')],
    [
      'Criterio',
      'Solo se consideran menciones cuya solicitud tiene estado APROBADA.',
    ],
    [
      'Uso',
      'La hoja "Detalle misas" lista cada celebracion; puede filtrar y agrupar en Excel. La hoja "Menciones aprobadas" detalla cada linea.',
    ],
    ['Rango fechas (filtro UI)', `${meta.filtros.fechaDesde || '-'} -> ${meta.filtros.fechaHasta || '-'}`],
    ['Busqueda', meta.filtros.busqueda || '-'],
    ['Tipo de misa', meta.filtros.tipoMisaNombre || 'Todos'],
    ['Estado misa (UI)', meta.filtros.estadoLabel || 'Todos'],
    ['Registros en exportacion', String(misasDetalle.length)],
    ['Total en listado filtrado (UI)', String(meta.totalEnListadoFiltrado)],
    [
      'Ingresos',
      'Precio del tipo de misa por cada mencion con solicitud aprobada. Sin menciones aprobadas = 0 en esa misa.',
    ],
  ];
  infoRows.forEach(([a, b], i) => {
    const row = wsInfo.getRow(i + 1);
    row.getCell(1).value = textoExcelSeguro(a);
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = textoExcelSeguro(b);
    row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
  });

  // ——— Detalle misas (una sola tabla; sin resumen por dia) ———
  const ws = wb.addWorksheet('Detalle misas', {});
  const colCount = 11;
  const colWidths = [10, 18, 12, 12, 28, 20, 18, 18, 12, 38, 28];
  for (let c = 1; c <= colCount; c++) {
    ws.getColumn(c).width = colWidths[c - 1] ?? 14;
  }

  ws.getCell(1, 1).value = textoExcelSeguro('Reporte de misas (solo solicitudes aprobadas)');
  ws.getCell(1, 1).font = { bold: true, size: 14 };

  const detalleHeaderRow = 2;
  const hdrDet = ws.getRow(detalleHeaderRow);
  const detHeaders = [
    'ID Misa',
    'Fecha celebracion',
    'Hora inicio',
    'Hora fin',
    'Tipo de misa',
    'Precio unitario (S/)',
    'Menc. aprobadas',
    'Ingreso total (S/)',
    'Estado misa',
    'Titulo',
    'IDs solicitud aprobadas',
  ];
  detHeaders.forEach((text, i) => {
    hdrDet.getCell(i + 1).value = textoExcelSeguro(text);
  });
  styleHeaderRow(hdrDet, colCount);

  let r = detalleHeaderRow + 1;
  for (const misa of ordenadas) {
    const menciones = mencionesAprobadas(misa);
    const idsSol = [
      ...new Set(
        menciones
          .map((m) => m.mencion?.solicitud?.idsolicitud)
          .filter((id): id is number => id != null)
      ),
    ].sort((a, b) => a - b);
    const row = ws.getRow(r);
    row.getCell(1).value = misa.idmisa;
    row.getCell(2).value = new Date(`${misa.fechacelebracion}T12:00:00`);
    row.getCell(2).numFmt = 'yyyy-mm-dd';
    row.getCell(3).value = horaComoFraccionDia(misa.horainicio);
    row.getCell(3).numFmt = 'hh:mm';
    row.getCell(4).value = horaComoFraccionDia(misa.horafin);
    row.getCell(4).numFmt = 'hh:mm';
    row.getCell(5).value = textoExcelSeguro(misa.tipomisa?.nombre || '-');
    const pUnit = precioUnitarioTipo(misa);
    const nMen = menciones.length;
    const ingresoTotal = ingresoPorMencionesAprobadas(misa);
    row.getCell(6).value = numeroSeguro(pUnit);
    row.getCell(6).numFmt = '#,##0.00';
    row.getCell(7).value = nMen;
    row.getCell(8).value = numeroSeguro(ingresoTotal);
    row.getCell(8).numFmt = '#,##0.00';
    row.getCell(9).value = textoExcelSeguro(misa.estado ? 'Activo' : 'Inactivo');
    row.getCell(10).value = textoExcelSeguro(misa.titulo ?? '-');
    row.getCell(11).value = textoExcelSeguro(idsSol.length ? idsSol.join(', ') : '-');
    r++;
  }

  const lastDataRow = r - 1;
  if (ordenadas.length > 0 && lastDataRow > detalleHeaderRow) {
    ws.autoFilter = {
      from: { row: detalleHeaderRow, column: 1 },
      to: { row: lastDataRow, column: colCount },
    };
  }
  ws.views = [{ state: 'frozen', ySplit: detalleHeaderRow - 1 }];

  // ——— Menciones aprobadas (cabecera manual; sin columns{} para evitar XML duplicado) ———
  const wsMen = wb.addWorksheet('Menciones aprobadas', {});
  const menCols = 10;
  const menWidths = [16, 10, 14, 14, 20, 18, 22, 22, 40, 36];
  for (let c = 1; c <= menCols; c++) {
    wsMen.getColumn(c).width = menWidths[c - 1] ?? 14;
  }
  const menHdr = wsMen.getRow(1);
  const menHeaders = [
    'Fecha misa',
    'ID Misa',
    'ID Solicitud',
    'Estado',
    'Precio unit. (S/)',
    'Importe (S/)',
    'Nombres',
    'Apellidos',
    'Intencion',
    'Descripcion mencion',
  ];
  menHeaders.forEach((text, i) => {
    menHdr.getCell(i + 1).value = textoExcelSeguro(text);
  });
  styleHeaderRow(menHdr, menCols);

  let rowMen = 2;
  for (const misa of ordenadas) {
    const unit = precioUnitarioTipo(misa);
    for (const item of mencionesAprobadas(misa)) {
      const sol = item.mencion?.solicitud;
      if (!sol) continue;
      const rr = wsMen.getRow(rowMen);
      rr.getCell(1).value = new Date(`${misa.fechacelebracion}T12:00:00`);
      rr.getCell(1).numFmt = 'yyyy-mm-dd';
      rr.getCell(2).value = misa.idmisa;
      rr.getCell(3).value = sol.idsolicitud;
      rr.getCell(4).value = textoExcelSeguro('Aprobada');
      rr.getCell(5).value = numeroSeguro(unit);
      rr.getCell(5).numFmt = '#,##0.00';
      rr.getCell(6).value = numeroSeguro(unit);
      rr.getCell(6).numFmt = '#,##0.00';
      rr.getCell(7).value = textoExcelSeguro(sol.nombres);
      rr.getCell(8).value = textoExcelSeguro(sol.apellidos);
      rr.getCell(9).value = textoExcelSeguro(sol.intencion ?? '-');
      rr.getCell(10).value = textoExcelSeguro(item.mencion?.descripcion ?? '-');
      rowMen++;
    }
  }
  if (rowMen > 2) {
    wsMen.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowMen - 1, column: menCols },
    };
  }
  wsMen.views = [{ state: 'frozen', ySplit: 1 }];

  const raw = await wb.xlsx.writeBuffer({
    useSharedStrings: false,
  });
  const u8 = raw instanceof Uint8Array ? raw : new Uint8Array(raw as ArrayBuffer);
  const blob = new Blob([u8], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const stamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `reporte_misas_${stamp}.xlsx`);
}

function etiquetaEstadoSolicitud(id: number | undefined | null): string {
  if (id == null) return '-';
  if (id === ID_ESTADO_SOLICITUD_APROBADA) return 'Aprobada';
  return `Estado ${id}`;
}

/**
 * Excel dedicado: una misa y todas sus líneas de mención (con estado de solicitud).
 * Importe económico solo cuando la solicitud está aprobada (misma regla que el reporte global).
 */
export async function generarYDescargarExcelMencionesUnaMisa(misa: IMisaDetalle): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Gestion de Misas';
  wb.created = new Date();

  const menciones = misa.menciones ?? [];
  const aprobadas = menciones.filter((mm) => esSolicitudAprobada(mm.mencion?.solicitud));

  const wsInfo = wb.addWorksheet('Informacion', {});
  wsInfo.getColumn(1).width = 28;
  wsInfo.getColumn(2).width = 72;
  const infoRows: [string, string][] = [
    ['Reporte', 'Menciones por misa especifica'],
    ['Generado', new Date().toLocaleString('es-PE')],
    ['ID Misa', String(misa.idmisa)],
    ['Fecha celebracion', misa.fechacelebracion],
    ['Hora', `${misa.horainicio || '-'} - ${misa.horafin || '-'}`],
    ['Tipo de misa', misa.tipomisa?.nombre || '-'],
    ['Titulo', misa.titulo ?? '-'],
    ['Estado misa', misa.estado ? 'Activo' : 'Inactivo'],
    ['Total menciones (lineas)', String(menciones.length)],
    ['Menciones con solicitud aprobada', String(aprobadas.length)],
    [
      'Criterio importe',
      'Precio unitario del tipo de misa solo cuenta como importe por linea si la solicitud vinculada esta APROBADA.',
    ],
    [
      'Uso',
      'Hoja "Menciones": filtre o ordene en Excel por estado, solicitante o intencion.',
    ],
  ];
  infoRows.forEach(([a, b], i) => {
    const row = wsInfo.getRow(i + 1);
    row.getCell(1).value = textoExcelSeguro(a);
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = textoExcelSeguro(b);
    row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
  });

  const wsMen = wb.addWorksheet('Menciones', {});
  const menCols = 16;
  const menWidths = [14, 10, 14, 14, 16, 18, 14, 14, 16, 18, 18, 16, 14, 24, 36, 36];
  for (let c = 1; c <= menCols; c++) {
    wsMen.getColumn(c).width = menWidths[c - 1] ?? 14;
  }
  const menHdr = wsMen.getRow(1);
  const menHeaders = [
    'Fecha misa',
    'ID Misa',
    'ID Mencion misa',
    'ID Solicitud',
    'ID estado solicitud',
    'Estado solicitud',
    'Aprobada (Si/No)',
    'Precio unit. (S/)',
    'Importe linea (S/)',
    'Nombres',
    'Apellidos',
    'Documento',
    'Celular',
    'Correo',
    'Intencion',
    'Descripcion mencion',
  ];
  menHeaders.forEach((text, i) => {
    menHdr.getCell(i + 1).value = textoExcelSeguro(text);
  });
  styleHeaderRow(menHdr, menCols);

  const unit = precioUnitarioTipo(misa);
  let rowMen = 2;
  for (const item of menciones) {
    const sol = item.mencion?.solicitud;
    const aprobada = esSolicitudAprobada(sol);
    const idEst = sol?.idestadoproceso;
    const rr = wsMen.getRow(rowMen);
    rr.getCell(1).value = new Date(`${misa.fechacelebracion}T12:00:00`);
    rr.getCell(1).numFmt = 'yyyy-mm-dd';
    rr.getCell(2).value = misa.idmisa;
    rr.getCell(3).value = item.idmencionmisa;
    rr.getCell(4).value = sol?.idsolicitud ?? '-';
    rr.getCell(5).value = idEst != null ? idEst : '-';
    rr.getCell(6).value = textoExcelSeguro(etiquetaEstadoSolicitud(idEst));
    rr.getCell(7).value = textoExcelSeguro(aprobada ? 'Si' : 'No');
    rr.getCell(8).value = numeroSeguro(unit);
    rr.getCell(8).numFmt = '#,##0.00';
    const importe = aprobada ? unit : 0;
    rr.getCell(9).value = numeroSeguro(importe);
    rr.getCell(9).numFmt = '#,##0.00';
    rr.getCell(10).value = textoExcelSeguro(sol?.nombres ?? '-');
    rr.getCell(11).value = textoExcelSeguro(sol?.apellidos ?? '-');
    rr.getCell(12).value = textoExcelSeguro(sol?.nrodocumento != null ? String(sol.nrodocumento) : '-');
    rr.getCell(13).value = sol?.celular != null ? sol.celular : '-';
    rr.getCell(14).value = textoExcelSeguro(sol?.correo ?? '-');
    rr.getCell(15).value = textoExcelSeguro(sol?.intencion ?? '-');
    rr.getCell(16).value = textoExcelSeguro(item.mencion?.descripcion ?? '-');
    rowMen++;
  }

  if (rowMen > 2) {
    wsMen.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: rowMen - 1, column: menCols },
    };
  }
  wsMen.views = [{ state: 'frozen', ySplit: 1 }];

  const raw = await wb.xlsx.writeBuffer({
    useSharedStrings: false,
  });
  const u8 = raw instanceof Uint8Array ? raw : new Uint8Array(raw as ArrayBuffer);
  const blob = new Blob([u8], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const stamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `menciones_misa_${misa.idmisa}_${stamp}.xlsx`);
}
