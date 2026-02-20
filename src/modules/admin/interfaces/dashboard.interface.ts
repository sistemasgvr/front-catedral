export interface ISolicitudResumen {
  idsolicitud: number;
  idestadoproceso: number | null;
}

export interface IDashboardMetrics {
  pendientes: number;
  aprobadas: number;
  denegadas: number;
  total: number;
}

export interface IDashboardData {
  metrics: IDashboardMetrics;
  solicitudesPorMes: {
    mes: string;
    cantidad: number;
  }[];
  solicitudesPorTipoMisa: {
    tipo: string;
    cantidad: number;
    monto: number;
  }[];
  misasProximas: {
    total: number;
    estaSemana: number;
    esteMes: number;
  };
  ingresosTotales: number;
  solicitudesRecientes: Array<{
    idsolicitud: number;
    nombres: string;
    apellidos: string;
    fechasolicitud: string;
    estado: string | null;
  }>;
}