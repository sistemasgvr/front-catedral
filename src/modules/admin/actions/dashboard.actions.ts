import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IDashboardData, ISolicitudResumen } from "../interfaces/dashboard.interface";

export const getDashboardData = async (): Promise<IDashboardData> => {
  try {
    // 1. Obtener métricas de solicitudes
    const { data: solicitudes } = await apiClient.get<any[]>(
      `/solicitudes?select=idsolicitud,idEstadoProceso,fechasolicitud,montototal,idtipomisa,nombres,apellidos&estado=eq.true&order=fechasolicitud.desc`
    );

    const solicitudesArray = Array.isArray(solicitudes) ? solicitudes : [];

    // Calcular métricas básicas
    const pendientes = solicitudesArray.filter(s => s.idestadoproceso === 17).length;
    const aprobadas = solicitudesArray.filter(s => s.idestadoproceso === 18).length;
    const denegadas = solicitudesArray.filter(s => s.idestadoproceso === 19).length;

    // 2. Obtener solicitudes por mes (últimos 6 meses)
    const solicitudesPorMes = calcularSolicitudesPorMes(solicitudesArray);

    // 3. Obtener tipos de misa y calcular estadísticas
    const { data: tiposMisa } = await apiClient.get(`/tipomisa?select=*&estado=eq.true`);
    const tiposMisaArray = Array.isArray(tiposMisa) ? tiposMisa : [];

    const solicitudesPorTipoMisa = tiposMisaArray.map(tipo => {
      const solicitudesTipo = solicitudesArray.filter(s => s.idtipomisa === tipo.idtipomisa);
      return {
        tipo: tipo.nombre,
        cantidad: solicitudesTipo.length,
        monto: solicitudesTipo.reduce((sum, s) => sum + (Number(s.montototal) || 0), 0),
      };
    });

    // 4. Obtener misas próximas
    const { data: misas } = await apiClient.get(
      `/misas?select=*&estado=eq.true&fechacelebracion=gte.${new Date().toISOString().split('T')[0]}&order=fechacelebracion.asc`
    );
    const misasArray = Array.isArray(misas) ? misas : [];

    const hoy = new Date();
    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 7);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const misasProximas = {
      total: misasArray.length,
      estaSemana: misasArray.filter(m => new Date(m.fechacelebracion) <= finSemana).length,
      esteMes: misasArray.filter(m => new Date(m.fechacelebracion) <= finMes).length,
    };

    // 5. Calcular ingresos totales
    const ingresosTotales = solicitudesArray
      .filter(s => s.idestadoproceso === 18) // Solo aprobadas
      .reduce((sum, s) => sum + (Number(s.montototal) || 0), 0);

    // 6. Obtener opciones de estado para las solicitudes recientes
    const { data: estadosData } = await apiClient.get(
      `/opcioneslista?select=*&idlista=eq.7&estado=eq.true`
    );
    const estadosArray = Array.isArray(estadosData) ? estadosData : [];
    const estadosMap = new Map(estadosArray.map(e => [e.idopcionlista, e.nombre]));

    // 7. Solicitudes recientes (últimas 5)
    const solicitudesRecientes = solicitudesArray.slice(0, 5).map(s => ({
      idsolicitud: s.idsolicitud,
      nombres: s.nombres,
      apellidos: s.apellidos,
      fechasolicitud: s.fechasolicitud,
      estado: s.idestadoproceso ? estadosMap.get(s.idestadoproceso) || null : null,
    }));

    return {
      metrics: {
        pendientes,
        aprobadas,
        denegadas,
        total: solicitudesArray.length,
      },
      solicitudesPorMes,
      solicitudesPorTipoMisa,
      misasProximas,
      ingresosTotales,
      solicitudesRecientes,
    };
  } catch (error) {
    if (
      isAxiosError(error) &&
      [400, 401, 422].includes(error.response?.status ?? 0)
    ) {
      const errorMessage =
        error.response?.data?.error || "Error al obtener datos del dashboard";
      throw new Error(errorMessage);
    }
    throw new Error("No se pudo realizar la petición del dashboard");
  }
};

function calcularSolicitudesPorMes(solicitudes: any[]): { mes: string; cantidad: number }[] {
  const meses = [];
  const hoy = new Date();

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const mesAnio = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const nombreMes = fecha.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
    
    const cantidad = solicitudes.filter(s => 
      s.fechasolicitud && s.fechasolicitud.startsWith(mesAnio)
    ).length;

    meses.push({
      mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      cantidad,
    });
  }

  return meses;
}