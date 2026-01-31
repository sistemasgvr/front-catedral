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
            :options="store.tiposDocumento"
            :required="true"
            :error-message="errors.idTipoDocumento"
            @blur="validateField('idTipoDocumento')"
          />
          <InputText
            v-model="nroDocumento"
            name="nroDocumento"
            label="Número de Documento"
            placeholder="12345678"
            :required="true"
            :maxlength="12"
            :error-message="errors.nroDocumento"
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
            :error-message="errors.nombres"
            @blur="validateField('nombres')"
          />
          <InputText
            v-model="apellidos"
            name="apellidos"
            label="Apellidos"
            placeholder="Pérez García"
            :required="true"
            :error-message="errors.apellidos"
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
            :error-message="errors.celular"
            @blur="validateField('celular')"
          />
          <InputText
            v-model="correo"
            name="correo"
            type="email"
            label="Correo Electrónico"
            placeholder="correo@ejemplo.com"
            :required="true"
            :error-message="errors.correo"
            @blur="validateField('correo')"
          />
        </div>

        <!-- Validation Message -->
        <div 
          v-if="!isValid && Object.keys(errors).length > 0" 
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
import InputText from '../inputs/InputText.vue';
import InputSelect from '../inputs/InputSelect.vue';

const store = useSolicitudStore();

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
});

// Campos del formulario
const { value: idTipoDocumento } = useField<number | null>('idTipoDocumento');
const { value: nroDocumento } = useField<string>('nroDocumento');
const { value: nombres } = useField<string>('nombres');
const { value: apellidos } = useField<string>('apellidos');
const { value: celular } = useField<string>('celular');
const { value: correo } = useField<string>('correo');

const isValid = ref(false);

// Validar un campo específico
const validateField = async (fieldName: FormFields) => {
  await validateFieldForm(fieldName);
  await checkValidity();
};

// Verificar validez general
const checkValidity = async () => {
  const result = await validate();
  isValid.value = result.valid;
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

// Cargar datos del store al montar
onMounted(() => {
  idTipoDocumento.value = store.solicitud.idTipoDocumento;
  nroDocumento.value = store.solicitud.nroDocumento;
  nombres.value = store.solicitud.nombres;
  apellidos.value = store.solicitud.apellidos;
  celular.value = store.solicitud.celular;
  correo.value = store.solicitud.correo;
  checkValidity();
});

const onSubmit = async () => {
  const result = await validate();
  if (result.valid) {
    console.log('Formulario válido, datos guardados en store');
  }
};

// Exponer método de validación para el wizard
defineExpose({
  validate: async () => {
    const result = await validate();
    return result.valid;
  },
});
</script>

<style scoped>
</style>
