import { isAxiosError } from "axios";
import apiClient from "../../../api/apiClient";
import type { IDashboardData } from "../interfaces/dashboard.interface";

export const getDashboardData = async (): Promise<IDashboardData> => {
  try {
    console.log('=== Iniciando carga de dashboard ===');
    
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
    console.log('URL solicitudes:', solicitudesUrl);

    const { data: solicitudes } = await apiClient.get<any[]>(solicitudesUrl);

    console.log('Solicitudes recibidas:', solicitudes);
    console.log('Cantidad de solicitudes:', solicitudes?.length);

    const solicitudesArray = Array.isArray(solicitudes) ? solicitudes : [];

    if (solicitudesArray.length > 0) {
      console.log('Ejemplo de solicitud:', solicitudesArray[0]);
    }

    // Calcular métricas básicas
    const pendientes = solicitudesArray.filter(s => s.idestadoproceso === 17).length;
    const aprobadas = solicitudesArray.filter(s => s.idestadoproceso === 18).length;
    const denegadas = solicitudesArray.filter(s => s.idestadoproceso === 19).length;

    console.log('Métricas:', { 
      total: solicitudesArray.length,
      pendientes, 
      aprobadas, 
      denegadas,
      conEstado: solicitudesArray.filter(s => s.idestadoproceso != null).length,
      sinEstado: solicitudesArray.filter(s => s.idestadoproceso == null).length
    });

    // 2. Obtener solicitudes por mes (últimos 6 meses)
    const solicitudesPorMes = calcularSolicitudesPorMes(solicitudesArray);
    console.log('Solicitudes por mes:', solicitudesPorMes);

    // 3. Obtener tipos de misa y calcular estadísticas
    const { data: tiposMisa } = await apiClient.get(`/tipomisa?select=*&estado=eq.true`);
    console.log('Tipos de misa recibidos:', tiposMisa);
    
    const tiposMisaArray = Array.isArray(tiposMisa) ? tiposMisa : [];

    const solicitudesPorTipoMisa = tiposMisaArray.map(tipo => {
      const solicitudesTipo = solicitudesArray.filter(s => s.idtipomisa === tipo.idtipomisa);
      const monto = solicitudesTipo.reduce((sum, s) => {
        const montoNum = Number(s.montototal);
        return sum + (isNaN(montoNum) ? 0 : montoNum);
      }, 0);
      
      return {
        tipo: tipo.nombre,
        cantidad: solicitudesTipo.length,
        monto: monto,
      };
    });

    console.log('Solicitudes por tipo de misa:', solicitudesPorTipoMisa);

    // 4. Obtener misas próximas
    const hoy = new Date();
    const fechaHoyISO = hoy.toISOString().split('T')[0];
    
    console.log('Consultando misas desde:', fechaHoyISO);
    
    const { data: misas } = await apiClient.get(
      `/misas?select=*&estado=eq.true&fechacelebracion=gte.${fechaHoyISO}&order=fechacelebracion.asc`
    );
    
    console.log('Misas recibidas:', misas);
    
    const misasArray = Array.isArray(misas) ? misas : [];

    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 7);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const misasProximas = {
      total: misasArray.length,
      estaSemana: misasArray.filter(m => {
        const fechaMisa = new Date(m.fechacelebracion + 'T00:00:00');
        return fechaMisa <= finSemana;
      }).length,
      esteMes: misasArray.filter(m => {
        const fechaMisa = new Date(m.fechacelebracion + 'T00:00:00');
        return fechaMisa <= finMes;
      }).length,
    };

    console.log('Misas próximas:', misasProximas);

    // 5. Calcular ingresos totales (SOLO DE APROBADAS - idestadoproceso = 18)
    const solicitudesAprobadas = solicitudesArray.filter(s => s.idestadoproceso === 18);
    console.log('Solicitudes aprobadas para ingresos:', solicitudesAprobadas.length);
    
    const ingresosTotales = solicitudesAprobadas.reduce((sum, s) => {
      const monto = Number(s.montototal);
      if (isNaN(monto)) {
        console.warn('Monto inválido en solicitud:', s.idsolicitud, s.montototal);
        return sum;
      }
      return sum + monto;
    }, 0);

    console.log('Ingresos totales calculados:', ingresosTotales);

    // 6. Obtener opciones de estado para las solicitudes recientes
    const { data: estadosData } = await apiClient.get(
      `/opcioneslista?select=*&idlista=eq.7&estado=eq.true`
    );
    
    console.log('Estados recibidos:', estadosData);
    
    const estadosArray = Array.isArray(estadosData) ? estadosData : [];
    const estadosMap = new Map(estadosArray.map(e => [e.idopcionlista, e.nombre]));

    console.log('Mapa de estados:', Array.from(estadosMap.entries()));

    // 7. Solicitudes recientes (últimas 5)
    const solicitudesRecientes = solicitudesArray.slice(0, 5).map(s => ({
      idsolicitud: s.idsolicitud,
      nombres: s.nombres,
      apellidos: s.apellidos,
      fechasolicitud: s.fechasolicitud,
      estado: s.idestadoproceso ? estadosMap.get(s.idestadoproceso) || null : null,
      idestado: s.idestadoproceso, // Para debug
    }));

    console.log('Solicitudes recientes:', solicitudesRecientes);

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

    console.log('=== Dashboard cargado exitosamente ===');
    console.log('Resultado final:', resultado);

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