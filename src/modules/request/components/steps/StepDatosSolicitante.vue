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
            :maxlength="nroDocumentoMaxLength"
            :inputmode="esDniSeleccionado ? 'numeric' : undefined"
            :integer-only="esDniSeleccionado"
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
import { ref, watch, onMounted, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useSolicitudStore } from '../../stores/solicitud.store';
import { getOpcionesLista } from '../../actions/getOpcionesLista.action';
import { mapOpcionToSelect, type ISelectOption } from '../../interfaces/opcionLista.interface';
import { InputText, InputSelect } from '@/components/inputs';
import { Icon } from '@iconify/vue';

const store = useSolicitudStore();

/** Reconoce DNI según el nombre devuelto por la lista (API), sin depender del id fijo. */
function esNombreTipoDni(nombre: string | undefined): boolean {
  if (!nombre) return false;
  const n = nombre.trim().toUpperCase();
  if (n === 'DNI' || n.startsWith('DNI ') || n.includes('DOCUMENTO NACIONAL DE IDENTIDAD')) return true;
  if (/\bDNI\b/.test(n)) return true;
  const compact = n.replace(/[\s.]/g, '');
  return compact === 'DNI';
}

function esDniPorIdTipo(id: number | string | null | undefined): boolean {
  if (id == null || id === '') return false;
  const idNum = typeof id === 'number' ? id : Number(id);
  if (Number.isNaN(idNum)) return false;
  const opt = tiposDocumento.value.find((o) => Number(o.id) === idNum);
  return esNombreTipoDni(opt?.nombre);
}

// Estado para tipos de documento
const tiposDocumento = ref<ISelectOption[]>([]);
const loadingTiposDocumento = ref(true);

function soloDigitos(s: string): string {
  return s.replace(/\D/g, '');
}

/** Misma regla que el `transform` de Yup: el valor guardado nunca lleva basura si es DNI. */
function normalizarNroDocumento(
  nro: string | undefined | null,
  idTipo: number | string | null | undefined,
): string {
  if (!esDniPorIdTipo(idTipo)) return nro == null ? '' : String(nro);
  return soloDigitos(String(nro ?? '')).slice(0, 8);
}

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

// Schema de validación con Yup (transform = fuente de verdad al validar / castear)
const validationSchema = yup.object({
  idTipoDocumento: yup
    .number()
    .required('Seleccione un tipo de documento'),
  nroDocumento: yup
    .string()
    .transform((value, _originalValue, _schema, options) => {
      const id = (options as { parent?: { idTipoDocumento?: number | string | null } })?.parent
        ?.idTipoDocumento;
      return normalizarNroDocumento(String(value ?? ''), id);
    })
    .required('El número de documento es requerido')
    .test('doc-format', function (value) {
      const id = this.parent.idTipoDocumento as number | string | null | undefined;
      if (esDniPorIdTipo(id)) {
        if (!value || !/^\d{8}$/.test(value)) {
          return this.createError({
            message: 'El DNI solo permite números y debe tener exactamente 8 dígitos',
          });
        }
        return true;
      }
      if (!value || value.length < 8) {
        return this.createError({ message: 'Mínimo 8 caracteres' });
      }
      return true;
    }),
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
  validationSchema: toTypedSchema(validationSchema),
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

const esDniSeleccionado = computed(() => esDniPorIdTipo(idTipoDocumento.value));

const nroDocumentoMaxLength = computed(() => (esDniSeleccionado.value ? 8 : 20));

/** Sincroniza el modelo con la misma regla que el `transform` de Yup (DNI = solo dígitos). */
watch(
  () => [nroDocumento.value, idTipoDocumento.value] as const,
  ([nro, id]) => {
    const next = normalizarNroDocumento(nro, id);
    if (next !== nro) {
      nroDocumento.value = next;
    }
  },
);

const isValid = ref(true);
const hasInteracted = ref(false);
const touchedFields = ref<Set<FormFields>>(new Set());

const validateField = async (fieldName: FormFields) => {
  touchedFields.value.add(fieldName);
  hasInteracted.value = true;
  if (fieldName === 'nroDocumento') {
    const next = normalizarNroDocumento(nroDocumento.value, idTipoDocumento.value);
    if (next !== nroDocumento.value) {
      nroDocumento.value = next;
    }
  }
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

    const nroNorm = normalizarNroDocumento(nroDocumento.value, idTipoDocumento.value);
    if (nroNorm !== nroDocumento.value) {
      nroDocumento.value = nroNorm;
    }

    const result = await validate();
    isValid.value = result.valid;
    return result.valid;
  },
});
</script>

<style scoped>
</style>