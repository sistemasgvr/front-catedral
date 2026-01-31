import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ISolicitud, ITipoDocumento, ITipoMisa, IHorario } from '../interfaces/solicitud.interface';
import { solicitudInicial } from '../interfaces/solicitud.interface';

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

  // Actions
  const updateDatosSolicitante = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  const updateDatosCelebracion = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
    // Actualizar monto total según tipo de misa
    if (datos.idTipoMisa) {
      const tipoMisa = tiposMisa.value.find(t => t.id === datos.idTipoMisa);
      if (tipoMisa) {
        solicitud.value.montoTotal = tipoMisa.precio;
      }
    }
  };

  const updatePago = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  const setCurrentStep = (step: number) => {
    currentStep.value = step;
  };

  const resetSolicitud = () => {
    solicitud.value = { ...solicitudInicial };
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
    // Actions
    updateDatosSolicitante,
    updateDatosCelebracion,
    updatePago,
    setCurrentStep,
    resetSolicitud,
    getSolicitudJSON,
  };
});
