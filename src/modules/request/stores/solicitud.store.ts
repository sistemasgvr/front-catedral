import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ISolicitud, ITipoDocumento, ITipoMisa, IHorario, IMencion } from '../interfaces/solicitud.interface';
import { solicitudInicial, COSTO_MENCION } from '../interfaces/solicitud.interface';

export const useSolicitudStore = defineStore('solicitud', () => {
  // Estado de la solicitud
  const solicitud = ref<ISolicitud>({ ...solicitudInicial });

  // Paso actual
  const currentStep = ref(0);

  // Datos estáticos para selects
  const tiposDocumento = ref<ITipoDocumento[]>([
    { id: 1, nombre: 'DNI' },
    { id: 2, nombre: 'Carnet de Extranjería' },
    { id: 3, nombre: 'Pasaporte' },
  ]);

  const tiposMisa = ref<ITipoMisa[]>([
    { id: 1, nombre: 'Misa de Difuntos', precio: 30 },
    { id: 2, nombre: 'Misa de Acción de Gracias', precio: 50 },
    { id: 3, nombre: 'Misa por Salud', precio: 40 },
    { id: 4, nombre: 'Misa de Aniversario', precio: 50 },
    { id: 5, nombre: 'Misa Especial', precio: 80 },
  ]);

  const horarios = ref<IHorario[]>([
    { id: 1, hora: '07:00', descripcion: '7:00 AM' },
    { id: 2, hora: '09:00', descripcion: '9:00 AM' },
    { id: 3, hora: '11:00', descripcion: '11:00 AM' },
    { id: 4, hora: '17:00', descripcion: '5:00 PM' },
    { id: 5, hora: '19:00', descripcion: '7:00 PM' },
  ]);

  // Getters
  const datosSolicitanteCompletos = computed(() => {
    return (
      solicitud.value.idTipoDocumento !== null &&
      solicitud.value.nroDocumento !== '' &&
      solicitud.value.nombres !== '' &&
      solicitud.value.apellidos !== '' &&
      solicitud.value.celular !== '' &&
      solicitud.value.correo !== ''
    );
  });

  const datosCelebracionCompletos = computed(() => {
    return (
      solicitud.value.fechaCelebracion !== '' &&
      solicitud.value.idTipoMisa !== null &&
      solicitud.value.idHorario !== null
    );
  });

  const tipoMisaSeleccionado = computed(() => {
    return tiposMisa.value.find(t => t.id === solicitud.value.idTipoMisa);
  });

  // Verificar si es misa privada (por flag o por nombre del tipo)
  const esMisaPrivada = computed(() => {
    if (solicitud.value.esMisaPrivada === true) return true;
    const tipo = tiposMisa.value.find(t => t.id === solicitud.value.idTipoMisa);
    return tipo?.nombre?.toLowerCase().includes('privada') ?? false;
  });

  // Actions
  const updateDatosSolicitante = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  const updateDatosCelebracion = (datos: Partial<ISolicitud> & { esMisaPrivada?: boolean }) => {
    solicitud.value = { ...solicitud.value, ...datos };
    // Si es misa privada: limpiar menciones y usar solo costo privada
    if (datos.esMisaPrivada === true) {
      solicitud.value.menciones = [];
      solicitud.value.montoTotal = 50; // PRECIO_MISA_PRIVADA
    } else if (datos.idTipoMisa) {
      const tipoMisa = tiposMisa.value.find(t => t.id === datos.idTipoMisa);
      if (tipoMisa) {
        solicitud.value.montoTotal = tipoMisa.precio;
      }
    }
  };

  const updatePago = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  // Menciones
  const agregarMencion = (descripcion: string) => {
    const nuevaMencion: IMencion = {
      id: Date.now(), // ID único basado en timestamp
      descripcion,
      costo: COSTO_MENCION,
    };
    solicitud.value.menciones.push(nuevaMencion);
  };

  const eliminarMencion = (id: number) => {
    solicitud.value.menciones = solicitud.value.menciones.filter(m => m.id !== id);
  };

  const actualizarMencion = (id: number, descripcion: string) => {
    const mencion = solicitud.value.menciones.find(m => m.id === id);
    if (mencion) {
      mencion.descripcion = descripcion;
    }
  };

  const totalMenciones = computed(() => {
    return solicitud.value.menciones.reduce((sum, m) => sum + m.costo, 0);
  });

  const setCurrentStep = (step: number) => {
    currentStep.value = step;
  };

  const resetSolicitud = () => {
    solicitud.value = { ...solicitudInicial, menciones: [] };
    currentStep.value = 0;
  };

  const getSolicitudJSON = () => {
    return JSON.stringify(solicitud.value, null, 2);
  };

  return {
    // State
    solicitud,
    currentStep,
    tiposDocumento,
    tiposMisa,
    horarios,
    // Getters
    datosSolicitanteCompletos,
    datosCelebracionCompletos,
    tipoMisaSeleccionado,
    esMisaPrivada,
    totalMenciones,
    // Actions
    updateDatosSolicitante,
    updateDatosCelebracion,
    updatePago,
    agregarMencion,
    eliminarMencion,
    actualizarMencion,
    setCurrentStep,
    resetSolicitud,
    getSolicitudJSON,
  };
});
