<template>
  <div class="step-content">
    <div class="bg-white rounded-2xl shadow-sm border border-[#E0D5C5] p-6 md:p-8 w-full max-w-2xl mx-auto">
      
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] mb-2 text-center">
        Datos del Solicitante
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] rounded mx-auto mb-6"></div>
      
      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Row 1: Tipo y Número de Documento -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputSelect
            v-model="idTipoDocumento"
            name="idTipoDocumento"
            label="Tipo de Documento"
            placeholder="Seleccionar"
            :options="tiposDocumento"
            :loading="loadingTiposDocumento"
            :required="true"
            :error-message="getFieldError('idTipoDocumento')"
            @blur="validateField('idTipoDocumento')"
          />
          <InputText
            v-model="nroDocumento"
            name="nroDocumento"
            label="Número de Documento"
            placeholder="12345678"
            :required="true"
            :maxlength="12"
            :error-message="getFieldError('nroDocumento')"
            @blur="validateField('nroDocumento')"
          />
        </div>

        <!-- Row 2: Nombres y Apellidos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText
            v-model="nombres"
            name="nombres"
            label="Nombres"
            placeholder="Juan Carlos"
            :required="true"
            :error-message="getFieldError('nombres')"
            @blur="validateField('nombres')"
          />
          <InputText
            v-model="apellidos"
            name="apellidos"
            label="Apellidos"
            placeholder="Pérez García"
            :required="true"
            :error-message="getFieldError('apellidos')"
            @blur="validateField('apellidos')"
          />
        </div>

        <!-- Row 3: Celular y Correo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText
            v-model="celular"
            name="celular"
            label="Número de Celular"
            placeholder="987654321"
            :required="true"
            :maxlength="9"
            :error-message="getFieldError('celular')"
            @blur="validateField('celular')"
          />
          <InputText
            v-model="correo"
            name="correo"
            type="email"
            label="Correo Electrónico"
            placeholder="correo@ejemplo.com"
            :required="true"
            :error-message="getFieldError('correo')"
            @blur="validateField('correo')"
          />
        </div>

        <!-- Validation Message - Solo mostrar si ha interactuado y hay errores -->
        <div 
          v-if="hasInteracted && !isValid && touchedFields.size > 0" 
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
import { ref, watch, onMounted } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { getOpcionesLista } from '../../actions/getOpcionesLista.action';
import { mapOpcionToSelect, type ISelectOption } from '../../interfaces/opcionLista.interface';
import { InputText, InputSelect } from '@/components/inputs';

const store = useSolicitudStore();

// Estado para tipos de documento
const tiposDocumento = ref<ISelectOption[]>([]);
const loadingTiposDocumento = ref(true);

// Cargar tipos de documento desde la API
const cargarTiposDocumento = async () => {
  try {
    loadingTiposDocumento.value = true;
    const opciones = await getOpcionesLista(1); // ID 1 = Tipos de Documento
    tiposDocumento.value = opciones.map(mapOpcionToSelect);
  } catch (error) {
    console.error('Error al cargar tipos de documento:', error);
    // Fallback a datos estáticos en caso de error
    tiposDocumento.value = [
      { id: 1, nombre: 'DNI' },
      { id: 2, nombre: 'Carnet de Extranjería' },
      { id: 3, nombre: 'Pasaporte' },
    ];
  } finally {
    loadingTiposDocumento.value = false;
  }
};

// Schema de validación con Yup
const validationSchema = yup.object({
  idTipoDocumento: yup
    .number()
    .required('Seleccione un tipo de documento')
    .nullable(),
  nroDocumento: yup
    .string()
    .required('El número de documento es requerido')
    .min(8, 'Mínimo 8 caracteres'),
  nombres: yup
    .string()
    .required('Los nombres son requeridos')
    .min(2, 'Mínimo 2 caracteres'),
  apellidos: yup
    .string()
    .required('Los apellidos son requeridos')
    .min(2, 'Mínimo 2 caracteres'),
  celular: yup
    .string()
    .required('El número de celular es requerido')
    .matches(/^[0-9]{9}$/, 'Debe tener 9 dígitos'),
  correo: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingrese un correo válido'),
});

type FormFields = 'idTipoDocumento' | 'nroDocumento' | 'nombres' | 'apellidos' | 'celular' | 'correo';

// Configurar vee-validate
const { errors, validate, validateField: validateFieldForm } = useForm<Record<FormFields, unknown>>({
  validationSchema,
  initialValues: {
    idTipoDocumento: store.solicitud.idTipoDocumento,
    nroDocumento: store.solicitud.nroDocumento,
    nombres: store.solicitud.nombres,
    apellidos: store.solicitud.apellidos,
    celular: store.solicitud.celular,
    correo: store.solicitud.correo,
  },
  validateOnMount: false,
});

// Campos del formulario
const { value: idTipoDocumento } = useField<number | null>('idTipoDocumento');
const { value: nroDocumento } = useField<string>('nroDocumento');
const { value: nombres } = useField<string>('nombres');
const { value: apellidos } = useField<string>('apellidos');
const { value: celular } = useField<string>('celular');
const { value: correo } = useField<string>('correo');

const isValid = ref(true);
const hasInteracted = ref(false);
const touchedFields = ref<Set<FormFields>>(new Set());

// Validar un campo específico solo si fue tocado
const validateField = async (fieldName: FormFields) => {
  touchedFields.value.add(fieldName);
  hasInteracted.value = true;
  await validateFieldForm(fieldName);
};

// Watch para guardar en store cuando cambien los valores
watch(
  [idTipoDocumento, nroDocumento, nombres, apellidos, celular, correo],
  () => {
    store.updateDatosSolicitante({
      idTipoDocumento: idTipoDocumento.value,
      nroDocumento: nroDocumento.value,
      nombres: nombres.value,
      apellidos: apellidos.value,
      celular: celular.value,
      correo: correo.value,
    });
  },
  { deep: true }
);

// Cargar datos al montar
onMounted(async () => {
  // Cargar tipos de documento
  await cargarTiposDocumento();
  
  // Cargar datos del store
  idTipoDocumento.value = store.solicitud.idTipoDocumento;
  nroDocumento.value = store.solicitud.nroDocumento;
  nombres.value = store.solicitud.nombres;
  apellidos.value = store.solicitud.apellidos;
  celular.value = store.solicitud.celular;
  correo.value = store.solicitud.correo;
});

const onSubmit = async () => {
  const result = await validate();
  if (result.valid) {
    console.log('Formulario válido, datos guardados en store');
  }
};

// Obtener error solo si el campo fue tocado
const getFieldError = (fieldName: FormFields): string | undefined => {
  if (touchedFields.value.has(fieldName)) {
    return errors.value[fieldName];
  }
  return undefined;
};

// Exponer método de validación para el wizard
defineExpose({
  validate: async () => {
    const allFields: FormFields[] = ['idTipoDocumento', 'nroDocumento', 'nombres', 'apellidos', 'celular', 'correo'];
    allFields.forEach(field => touchedFields.value.add(field));
    hasInteracted.value = true;
    
    const result = await validate();
    isValid.value = result.valid;
    return result.valid;
  },
});
</script>

<style scoped>
</style>
