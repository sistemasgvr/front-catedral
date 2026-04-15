<template>
  <div class="step-content">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E0D5C5] dark:border-gray-700 p-6 md:p-8 w-full max-w-3xl mx-auto">
      
      <!-- Title -->
      <h2 class="text-2xl font-serif font-bold text-[#C88A2A] dark:text-[#E5A84A] mb-2 text-center">
        Datos del Solicitante
      </h2>
      <div class="w-12 h-1 bg-[#C88A2A] dark:bg-[#E5A84A] rounded mx-auto mb-6"></div>
      
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
            :required="false"
            :error-message="getFieldError('correo')"
            @blur="validateField('correo')"
          />
        </div>

        <!-- Validation Message -->
        <div 
          v-if="hasInteracted && !isValid && touchedFields.size > 0" 
          class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 flex items-center gap-3"
        >
          <Icon icon="mdi:alert-outline" class="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <p class="text-amber-700 dark:text-amber-300 text-sm">Complete todos los campos para continuar</p>
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
import { Icon } from '@iconify/vue';

const store = useSolicitudStore();

// Estado para tipos de documento
const tiposDocumento = ref<ISelectOption[]>([]);
const loadingTiposDocumento = ref(true);

// Cargar tipos de documento desde la API
const cargarTiposDocumento = async () => {
  try {
    loadingTiposDocumento.value = true;
    const opciones = await getOpcionesLista(1);
    tiposDocumento.value = opciones.map(mapOpcionToSelect);
  } catch (error) {
    console.error('Error al cargar tipos de documento:', error);
  } finally {
    loadingTiposDocumento.value = false;
  }
};

// Schema de validación con Yup
const validationSchema = yup.object({
  idTipoDocumento: yup
    .number()
    .required('Seleccione un tipo de documento'),
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

const { value: idTipoDocumento } = useField<number | null>('idTipoDocumento');
const { value: nroDocumento } = useField<string>('nroDocumento');
const { value: nombres } = useField<string>('nombres');
const { value: apellidos } = useField<string>('apellidos');
const { value: celular } = useField<string>('celular');
const { value: correo } = useField<string>('correo');

const isValid = ref(true);
const hasInteracted = ref(false);
const touchedFields = ref<Set<FormFields>>(new Set());

const validateField = async (fieldName: FormFields) => {
  touchedFields.value.add(fieldName);
  hasInteracted.value = true;
  await validateFieldForm(fieldName);
};

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

onMounted(async () => {
  await cargarTiposDocumento();
  
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

const getFieldError = (fieldName: FormFields): string | undefined => {
  if (touchedFields.value.has(fieldName)) {
    return errors.value[fieldName];
  }
  return undefined;
};

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