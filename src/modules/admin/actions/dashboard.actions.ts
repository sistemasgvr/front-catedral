import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IDashboardData } from "../interfaces/dashboard.interface";

export const getDashboardData = async (): Promise<IDashboardData> => {
  try {
    // 1. Obtener métricas de solicitudes
    // IMPORTANTE: Separar el select en líneas para evitar problemas de codificación
    const selectFields = [
      'idsolicitud',
      'idestadoproceso',
      'fechasolicitud',
      'montototal',
      'idtipomisa',
      'nombres',
      'apellidos'
    ].join(',');

    const solicitudesUrl = `/solicitudes?select=${selectFields}&estado=eq.true&order=fechasolicitud.desc`;

    const { data: solicitudes } = await apiClient.get<any[]>(solicitudesUrl);

    const solicitudesArray = Array.isArray(solicitudes) ? solicitudes : [];

    // Calcular métricas básicas
    const pendientes = solicitudesArray.filter(s => s.idestadoproceso === 17).length;
    const aprobadas = solicitudesArray.filter(s => s.idestadoproceso === 18).length;
    const denegadas = solicitudesArray.filter(s => s.idestadoproceso === 19).length

    // 2. Obtener solicitudes por mes (últimos 6 meses)
    const solicitudesPorMes = calcularSolicitudesPorMes(solicitudesArray);

    // 3. Obtener tipos de misa y calcular estadísticas
    const { data: tiposMisa } = await apiClient.get(`/tipomisa?select=*&estado=eq.true`);

    const tiposMisaArray = Array.isArray(tiposMisa) ? tiposMisa : [];

    const solicitudesPorTipoMisa = tiposMisaArray.map(tipo => {
      // 1. Filtramos por tipo de misa Y por estado aprobado (id 18)
      const solicitudesTipoAprobadas = solicitudesArray.filter(s =>
        s.idtipomisa === tipo.idtipomisa &&
        Number(s.idestadoproceso) === 18
      );

      // 2. Calculamos el monto solo de esas solicitudes aprobadas
      const monto = solicitudesTipoAprobadas.reduce((sum, s) => {
        const montoNum = Number(s.montototal);
        return sum + (isNaN(montoNum) ? 0 : montoNum);
      }, 0);

      return {
        tipo: tipo.nombre,
        cantidad: solicitudesTipoAprobadas.length, // Cantidad de aprobadas
        monto: monto, // Monto de aprobadas
      };
    });

    // 4. Obtener misas próximas
    // 1. Obtener fecha de hoy normalizada (sin horas para evitar desfases)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaHoyISO = hoy.toISOString().split('T')[0];

    // 2. Llamada a la API
    const { data: misas } = await apiClient.get(
      `/misas?select=*&estado=eq.true&fechacelebracion=gte.${fechaHoyISO}&order=fechacelebracion.desc`
    );

    const misasArray = Array.isArray(misas) ? misas : [];

    // 3. Definir los límites temporales exactos
    // --- Fin de esta semana (Domingo actual a las 23:59:59) ---
    const finSemana = new Date(hoy);
    const diaSemana = hoy.getDay(); // 0 es domingo, 1 lunes...
    const diasHastaDomingo = diaSemana === 0 ? 0 : 7 - diaSemana;
    finSemana.setDate(hoy.getDate() + diasHastaDomingo);
    finSemana.setHours(23, 59, 59, 999);

    // --- Fin de este mes (Último día del mes a las 23:59:59) ---
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

    // 4. Calcular contadores en una sola pasada (más eficiente)
    const misasProximas = {
      total: misasArray.length,
      estaSemana: 0,
      esteMes: 0
    };

    misasArray.forEach(m => {
      // Forzamos T00:00:00 para que la fecha se interprete en horario local
      const fechaMisa = new Date(m.fechacelebracion + 'T00:00:00');

      // Misa está dentro de esta semana (hasta el domingo)
      if (fechaMisa >= hoy && fechaMisa <= finSemana) {
        misasProximas.estaSemana++;
      }

      // Misa está dentro de este mes calendario
      if (fechaMisa >= hoy && fechaMisa <= finMes) {
        misasProximas.esteMes++;
      }
    });

    // 5. Calcular ingresos totales (SOLO DE APROBADAS - idestadoproceso = 18)
    const solicitudesAprobadas = solicitudesArray.filter(s => s.idestadoproceso === 18);

    const ingresosTotales = solicitudesAprobadas.reduce((sum, s) => {
      const monto = Number(s.montototal);
      if (isNaN(monto)) {
        console.warn('Monto inválido en solicitud:', s.idsolicitud, s.montototal);
        return sum;
      }
      return sum + monto;
    }, 0);

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
      idestado: s.idestadoproceso, // Para debug
    }));

    const resultado = {
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

    return resultado;
  } catch (error) {
    console.error('=== Error en getDashboardData ===');
    console.error('Error completo:', error);

    if (isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      console.error('Config URL:', error.config?.url);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.data?.hint
        || `Error ${error.response?.status}: ${error.response?.statusText}`;

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