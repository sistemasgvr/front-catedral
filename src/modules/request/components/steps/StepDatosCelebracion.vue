<template>
  <div class="step-content">
    <div class="bg-white rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] mb-2 text-center">
        Datos de la Celebración
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] rounded mx-auto mb-6"></div>
      
      <!-- Form -->
      <form @submit.prevent class="space-y-4">
        <!-- Tipo de Misa -->
        <InputSelect
          v-model="idTipoMisa"
          name="idTipoMisa"
          label="Tipo de Misa"
          placeholder="Seleccionar tipo de misa"
          :options="tiposMisa"
          :loading="loadingTiposMisa"
          :required="true"
          :error-message="fieldErrors.idTipoMisa"
          @blur="touchField('idTipoMisa')"
        />

        <!-- Contenido condicional según tipo de misa -->
        <template v-if="idTipoMisa">
          <!-- MISA PRIVADA -->
          <template v-if="esMisaPrivada">
            <!-- Costo de Misa Privada -->
            <div class="bg-[#FFF5E6] rounded-lg p-4 border border-[#D39E3A]/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="text-[#4A4A4A] font-medium">Costo de Misa Privada</span>
                </div>
                <span class="text-[#C88A2A] font-bold text-xl">S/ {{ PRECIO_MISA_PRIVADA.toFixed(2) }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDate
                v-model="fechaCelebracion"
                name="fechaCelebracion"
                label="Fecha de Celebración"
                :min="fechaMinima"
                :required="true"
                :error-message="fieldErrors.fechaCelebracion"
                @blur="touchField('fechaCelebracion')"
              />
              <InputSelect
                v-model="idHorario"
                name="idHorario"
                label="Horario"
                placeholder="Seleccionar horario"
                :options="horarios"
                :loading="loadingHorarios"
                :required="true"
                :error-message="fieldErrors.idHorario"
                @blur="touchField('idHorario')"
              />
            </div>

            <!-- Intención (solo para misa privada) -->
            <InputTextarea
              v-model="intencion"
              name="intencion"
              label="Intención"
              placeholder="Escriba la intención de la misa (ej: Acción de gracias, por la salud de...)"
              :rows="3"
              :maxlength="500"
              :show-count="true"
              :required="true"
              :error-message="fieldErrors.intencion"
              @blur="touchField('intencion')"
            />
          </template>

          <!-- MISA COMUNITARIA -->
          <template v-else>
            <!-- Listado de misas disponibles -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-[#4A4A4A]">
                Misas Disponibles <span class="text-red-500">*</span>
              </label>
              
              <!-- Skeleton loading -->
              <div v-if="loadingMisas" class="space-y-3">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              <!-- Lista de misas -->
              <div v-else-if="misasDisponibles.length > 0" class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="misa in misasDisponibles"
                  :key="misa.id"
                  @click="seleccionarMisa(misa)"
                  class="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
                  :class="[
                    idMisaSeleccionada === misa.id
                      ? 'border-[#C88A2A] bg-[#FFF5E6]'
                      : 'border-[#E0D5C5] hover:border-[#C88A2A]/50 bg-white'
                  ]"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-[#4A4A4A]">{{ misa.titulo }}</h4>
                      <p class="text-sm text-gray-500">{{ misa.tipoMisa }}</p>
                    </div>
                    <span class="text-[#C88A2A] font-bold">S/ {{ misa.precio.toFixed(2) }}</span>
                  </div>
                  <div class="mt-2 flex gap-4 text-sm text-gray-600">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatDate(misa.fecha) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ misa.horario }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Sin misas disponibles -->
              <div v-else class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No hay misas comunitarias disponibles</p>
              </div>

              <p v-if="fieldErrors.idMisaSeleccionada" class="text-sm text-red-500">
                {{ fieldErrors.idMisaSeleccionada }}
              </p>
            </div>

            <!-- Mostrar fecha y horario seleccionados -->
            <div v-if="idMisaSeleccionada" class="bg-[#FFF5E6] rounded-lg p-4 border border-[#D39E3A]/30">
              <p class="text-sm text-[#4A4A4A]">
                <strong>Fecha:</strong> {{ formatDate(fechaCelebracion) }} | 
                <strong>Horario:</strong> {{ horarioMisaSeleccionada }}
              </p>
            </div>
          </template>
        </template>

        <!-- Validation Message -->
        <div 
          v-if="hasInteracted && hasErrors" 
          class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-amber-700 text-sm">Complete todos los campos para continuar</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from 'vue';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { getMisas } from '../../actions/getMisas.action';
import { type ISelectOption } from '../../interfaces/opcionLista.interface';
import { mapMisaToListItem, type IMisaListItem } from '../../interfaces/misa.interface';
import { InputSelect, InputDate, InputTextarea } from '@/components/inputs';

// Para carga dinámica futura, descomentar:
// import { getOpcionesLista } from '../../actions/getOpcionesLista.action';
// import { mapOpcionToSelect } from '../../interfaces/opcionLista.interface';

const store = useSolicitudStore();

// IDs y constantes
// Para carga dinámica: const ID_LISTA_TIPO_MISA = 2; const ID_LISTA_HORARIOS = 3;
const ID_TIPO_MISA_PRIVADA = 1;
const ID_TIPO_MISA_COMUNITARIA = 2;
const PRECIO_MISA_PRIVADA = 50.00; // Precio estático para misa privada

// Estados de carga
const loadingTiposMisa = ref(false);
const loadingHorarios = ref(true);
const loadingMisas = ref(false);

// Opciones - Estáticas por ahora
const tiposMisa = ref<ISelectOption[]>([
  { id: ID_TIPO_MISA_PRIVADA, nombre: 'Misa Privada' },
  { id: ID_TIPO_MISA_COMUNITARIA, nombre: 'Misa Comunitaria' },
]);
const horarios = ref<ISelectOption[]>([]);
const misasDisponibles = ref<IMisaListItem[]>([]);

// Valores del formulario
const idTipoMisa = ref<number | null>(null);
const fechaCelebracion = ref('');
const idHorario = ref<number | null>(null);
const intencion = ref('');
const idMisaSeleccionada = ref<number | null>(null);
const horarioMisaSeleccionada = ref('');

// Estado de validación
const hasInteracted = ref(false);
const touchedFields = ref<Set<string>>(new Set());
const fieldErrors = reactive<Record<string, string | undefined>>({});

// Fecha mínima (hoy)
const fechaMinima = computed(() => new Date().toISOString().split('T')[0]);

// Determinar si es misa privada
const esMisaPrivada = computed(() => idTipoMisa.value === ID_TIPO_MISA_PRIVADA);

// Verificar si hay errores
const hasErrors = computed(() => Object.values(fieldErrors).some(e => e));

// Cargar tipos de misa (manteniendo la lógica dinámica para futuro)
const cargarTiposMisa = async () => {
  // Por ahora usamos datos estáticos, pero mantenemos la estructura para futuro
  // Para habilitar carga dinámica, descomentar y agregar: const ID_LISTA_TIPO_MISA = 2;
  /*
  try {
    loadingTiposMisa.value = true;
    const opciones = await getOpcionesLista(ID_LISTA_TIPO_MISA);
    tiposMisa.value = opciones.map(mapOpcionToSelect);
  } catch (error) {
    console.error('Error al cargar tipos de misa:', error);
    tiposMisa.value = [
      { id: 1, nombre: 'Misa Privada' },
      { id: 2, nombre: 'Misa Comunitaria' },
    ];
  } finally {
    loadingTiposMisa.value = false;
  }
  */
};

// Cargar horarios (estático por ahora)
const cargarHorarios = () => {
  // Para carga dinámica futura, usar getOpcionesLista(ID_LISTA_HORARIOS)
  horarios.value = [
    { id: 1, nombre: '07:00 AM' },
    { id: 2, nombre: '09:00 AM' },
    { id: 3, nombre: '11:00 AM' },
    { id: 4, nombre: '05:00 PM' },
    { id: 5, nombre: '07:00 PM' },
  ];
  loadingHorarios.value = false;
};

// Cargar misas comunitarias
const cargarMisas = async () => {
  try {
    loadingMisas.value = true;
    // Filtrar misas activas (el filtro se puede ajustar según necesidades)
    const misas = await getMisas('estado=eq.true');
    misasDisponibles.value = misas.map(mapMisaToListItem);
  } catch (error) {
    console.error('Error al cargar misas:', error);
    misasDisponibles.value = [];
  } finally {
    loadingMisas.value = false;
  }
};

// Marcar campo como tocado y validar
const touchField = (fieldName: string) => {
  touchedFields.value.add(fieldName);
  hasInteracted.value = true;
  validateField(fieldName);
};

// Validar un campo específico
const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'idTipoMisa':
      fieldErrors.idTipoMisa = !idTipoMisa.value ? 'Seleccione un tipo de misa' : undefined;
      break;
    case 'fechaCelebracion':
      if (esMisaPrivada.value) {
        fieldErrors.fechaCelebracion = !fechaCelebracion.value ? 'La fecha es requerida' : undefined;
      }
      break;
    case 'idHorario':
      if (esMisaPrivada.value) {
        fieldErrors.idHorario = !idHorario.value ? 'Seleccione un horario' : undefined;
      }
      break;
    case 'idMisaSeleccionada':
      if (!esMisaPrivada.value && idTipoMisa.value) {
        fieldErrors.idMisaSeleccionada = !idMisaSeleccionada.value ? 'Seleccione una misa' : undefined;
      }
      break;
    case 'intencion':
      // Solo validar intención para misa privada
      if (esMisaPrivada.value) {
        if (!intencion.value) {
          fieldErrors.intencion = 'La intención es requerida';
        } else if (intencion.value.length < 10) {
          fieldErrors.intencion = 'Mínimo 10 caracteres';
        } else {
          fieldErrors.intencion = undefined;
        }
      }
      break;
  }
};

// Validar todo el formulario
const validateAll = (): boolean => {
  // Limpiar errores previos
  Object.keys(fieldErrors).forEach(key => {
    fieldErrors[key] = undefined;
  });

  // Validar tipo de misa (siempre requerido)
  if (!idTipoMisa.value) {
    fieldErrors.idTipoMisa = 'Seleccione un tipo de misa';
  }

  // Validar según tipo de misa
  if (esMisaPrivada.value) {
    // Misa privada: fecha, horario e intención requeridos
    if (!fechaCelebracion.value) {
      fieldErrors.fechaCelebracion = 'La fecha es requerida';
    }
    if (!idHorario.value) {
      fieldErrors.idHorario = 'Seleccione un horario';
    }
    if (!intencion.value) {
      fieldErrors.intencion = 'La intención es requerida';
    } else if (intencion.value.length < 10) {
      fieldErrors.intencion = 'Mínimo 10 caracteres';
    }
    
    // Asignar precio de misa privada
    store.solicitud.montoTotal = PRECIO_MISA_PRIVADA;
  } else if (idTipoMisa.value) {
    // Misa comunitaria: solo requiere seleccionar una misa
    if (!idMisaSeleccionada.value) {
      fieldErrors.idMisaSeleccionada = 'Seleccione una misa';
    }
    // La intención NO es requerida para misa comunitaria
  }

  return !hasErrors.value;
};

// Seleccionar misa comunitaria
const seleccionarMisa = (misa: IMisaListItem) => {
  idMisaSeleccionada.value = misa.id;
  fechaCelebracion.value = misa.fecha;
  horarioMisaSeleccionada.value = misa.horario;
  fieldErrors.idMisaSeleccionada = undefined;
  
  // Actualizar monto en el store
  store.solicitud.montoTotal = misa.precio;
};

// Formatear fecha
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Watch para cambios en tipo de misa
watch(idTipoMisa, async (newValue, oldValue) => {
  if (newValue !== oldValue && oldValue !== null) {
    // Resetear valores al cambiar tipo de misa
    fechaCelebracion.value = '';
    idHorario.value = null;
    idMisaSeleccionada.value = null;
    horarioMisaSeleccionada.value = '';
    intencion.value = '';
    
    // Limpiar errores
    fieldErrors.fechaCelebracion = undefined;
    fieldErrors.idHorario = undefined;
    fieldErrors.idMisaSeleccionada = undefined;
    fieldErrors.intencion = undefined;
  }
  
  // Cargar misas si es comunitaria
  if (newValue && newValue !== ID_TIPO_MISA_PRIVADA) {
    await cargarMisas();
  }
});

// Watch para guardar en store
watch(
  [idTipoMisa, fechaCelebracion, idHorario, intencion, idMisaSeleccionada],
  () => {
    store.updateDatosCelebracion({
      idTipoMisa: idTipoMisa.value,
      fechaCelebracion: fechaCelebracion.value,
      idHorario: idHorario.value,
      intencion: esMisaPrivada.value ? intencion.value : '', // Solo guardar intención si es privada
    });
  },
  { deep: true }
);

// Cargar datos al montar
onMounted(async () => {
  await Promise.all([cargarTiposMisa(), cargarHorarios()]);
  
  // Cargar datos del store
  idTipoMisa.value = store.solicitud.idTipoMisa;
  fechaCelebracion.value = store.solicitud.fechaCelebracion;
  idHorario.value = store.solicitud.idHorario;
  intencion.value = store.solicitud.intencion;
  
  // Si ya había un tipo de misa comunitaria seleccionado, cargar misas
  if (idTipoMisa.value && idTipoMisa.value !== ID_TIPO_MISA_PRIVADA) {
    await cargarMisas();
  }
});

// Exponer método de validación y estado para el wizard
defineExpose({
  validate: async () => {
    hasInteracted.value = true;
    const isValid = validateAll();
    return isValid;
  },
  esMisaPrivada, // Exponer para que RequestView pueda decidir el flujo
});
</script>

<style scoped>
</style>
