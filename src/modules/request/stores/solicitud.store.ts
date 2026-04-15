import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ISolicitud, ITipoDocumento, ITipoMisa, IHorario, IMencion } from '../interfaces/solicitud.interface';
import { solicitudInicial, COSTO_MENCION } from '../interfaces/solicitud.interface';
import {
  getModoRegistroLineas,
  omitePasoRegistroLineas,
  etiquetaPasoRegistro,
} from '../constants/tipoMisaRegistro';

export const useSolicitudStore = defineStore('solicitud', () => {
  const solicitud = ref<ISolicitud>({ ...solicitudInicial });

  const currentStep = ref(0);

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

  /** Un solo monto (sin paso de líneas): privada, funeral, etc. */
  const esPagoSoloTarifaPlana = computed(() =>
    omitePasoRegistroLineas(solicitud.value.idTipoMisa, solicitud.value.nombreTipoMisa),
  );

  const etiquetaPasoLineas = computed(() =>
    etiquetaPasoRegistro(solicitud.value.idTipoMisa, solicitud.value.nombreTipoMisa),
  );

  const modoRegistroLineas = computed(() =>
    getModoRegistroLineas(solicitud.value.idTipoMisa, solicitud.value.nombreTipoMisa),
  );

  function recalcMontoTotalDesdeLineas() {
    if (omitePasoRegistroLineas(solicitud.value.idTipoMisa, solicitud.value.nombreTipoMisa)) return;
    solicitud.value.montoTotal = solicitud.value.menciones.reduce((s, m) => s + m.costo, 0);
  }

  const updateDatosSolicitante = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  const updateDatosCelebracion = (datos: Partial<ISolicitud>) => {
    const idAnterior = solicitud.value.idTipoMisa;
    solicitud.value = { ...solicitud.value, ...datos };
    if (datos.idTipoMisa !== undefined && datos.idTipoMisa !== idAnterior) {
      solicitud.value.menciones = [];
    }
    if (omitePasoRegistroLineas(solicitud.value.idTipoMisa, solicitud.value.nombreTipoMisa)) {
      const p = solicitud.value.costoMencion;
      if (p > 0) solicitud.value.montoTotal = p;
    } else {
      recalcMontoTotalDesdeLineas();
    }
  };

  const updatePago = (datos: Partial<ISolicitud>) => {
    solicitud.value = { ...solicitud.value, ...datos };
  };

  const agregarMencion = (descripcion: string) => {
    const unit =
      solicitud.value.costoMencion > 0 ? solicitud.value.costoMencion : COSTO_MENCION;
    const nuevaMencion: IMencion = {
      id: Date.now(),
      descripcion,
      costo: unit,
    };
    solicitud.value.menciones.push(nuevaMencion);
    recalcMontoTotalDesdeLineas();
  };

  const eliminarMencion = (id: number) => {
    solicitud.value.menciones = solicitud.value.menciones.filter(m => m.id !== id);
    recalcMontoTotalDesdeLineas();
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

  /**
   * Tras registro exitoso o al salir: borra el snapshot en localStorage (Pinia)
   * y reinicia el estado. Evita que queden datos personales en el navegador (útil en equipos compartidos).
   */
  const limpiarDatosSolicitud = () => {
    localStorage.removeItem('solicitud_registered');
    resetSolicitud();
    // El plugin de Pinia en main.ts vuelve a guardar tras reset; borrar en el siguiente microtask.
    queueMicrotask(() => {
      localStorage.removeItem('solicitud');
    });
  };

  const getSolicitudJSON = () => {
    return JSON.stringify(solicitud.value, null, 2);
  };

  return {
    solicitud,
    currentStep,
    tiposDocumento,
    tiposMisa,
    horarios,
    datosSolicitanteCompletos,
    datosCelebracionCompletos,
    tipoMisaSeleccionado,
    /** @deprecated usar esPagoSoloTarifaPlana */
    esMisaPrivada: esPagoSoloTarifaPlana,
    esPagoSoloTarifaPlana,
    etiquetaPasoLineas,
    modoRegistroLineas,
    totalMenciones,
    updateDatosSolicitante,
    updateDatosCelebracion,
    updatePago,
    agregarMencion,
    eliminarMencion,
    actualizarMencion,
    setCurrentStep,
    resetSolicitud,
    limpiarDatosSolicitud,
    getSolicitudJSON,
  };
});
