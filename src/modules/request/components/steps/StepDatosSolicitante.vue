<template>
  <div class="wrap">
    <Card class="card">
      <template #content>
        <div class="title">
          <div class="title__icon" aria-hidden="true">
            <i class="pi pi-user"></i>
          </div>
          <h2>Datos del Solicitante</h2>
          <div class="title__line"></div>
        </div>

        <form class="grid" @submit.prevent="handleNext">
          <!-- Tipo documento -->
          <div class="field">
            <label for="tipoDoc">Tipo de Documento <span class="req">*</span></label>
            <Dropdown
              id="tipoDoc"
              v-model="local.tipoDocumento"
              :options="documentosOptions"
              option-label="nombre"
              option-value="idopcionlista"
              placeholder="Seleccionar"
              class="w-full"
              :invalid="!!errors.tipoDocumento"
              @change="touch('tipoDocumento')"
            />
            <Message v-if="errors.tipoDocumento" severity="error" :closable="false" class="field-msg">
              {{ errors.tipoDocumento }}
            </Message>
            <Message v-else-if="docsError" severity="error" :closable="false" class="field-msg">
              {{ docsError }}
            </Message>
          </div>

          <!-- Nro documento: solo números, 8 dígitos -->
          <div class="field">
            <label for="nroDoc">Número de Documento <span class="req">*</span></label>
            <InputText
              id="nroDoc"
              v-model="local.numeroDocumento"
              class="w-full input-numeric"
              placeholder="Ingrese su DNI (8 dígitos)"
              maxlength="8"
              inputmode="numeric"
              autocomplete="off"
              :invalid="!!errors.numeroDocumento"
              @input="onNumeroDocumentoInput"
              @blur="touch('numeroDocumento')"
            />
            <Message v-if="errors.numeroDocumento" severity="error" :closable="false" class="field-msg">
              {{ errors.numeroDocumento }}
            </Message>
          </div>

          <!-- Nombres -->
          <div class="field">
            <label for="nombres">Nombres <span class="req">*</span></label>
            <InputText
              id="nombres"
              v-model="local.nombre"
              class="w-full"
              placeholder="NOMBRES"
              :invalid="!!errors.nombre"
              @input="local.nombre = toUpper(local.nombre); touch('nombre')"
              @blur="touch('nombre')"
            />
            <Message v-if="errors.nombre" severity="error" :closable="false" class="field-msg">
              {{ errors.nombre }}
            </Message>
          </div>

          <!-- Apellidos -->
          <div class="field">
            <label for="apellidos">Apellidos <span class="req">*</span></label>
            <InputText
              id="apellidos"
              v-model="local.apellido"
              class="w-full"
              placeholder="APELLIDOS"
              :invalid="!!errors.apellido"
              @input="local.apellido = toUpper(local.apellido); touch('apellido')"
              @blur="touch('apellido')"
            />
            <Message v-if="errors.apellido" severity="error" :closable="false" class="field-msg">
              {{ errors.apellido }}
            </Message>
          </div>

          <!-- Celular: solo números, 9 dígitos -->
          <div class="field">
            <label for="celular">Número de Celular <span class="req">*</span></label>
            <InputText
              id="celular"
              v-model="local.telefono"
              class="w-full input-numeric"
              placeholder="Ej: 987654321 (9 dígitos)"
              maxlength="9"
              inputmode="numeric"
              autocomplete="off"
              :invalid="!!errors.telefono"
              @input="onTelefonoInput"
              @blur="touch('telefono')"
            />
            <Message v-if="errors.telefono" severity="error" :closable="false" class="field-msg">
              {{ errors.telefono }}
            </Message>
          </div>

          <!-- Email -->
          <div class="field">
            <label for="email">Correo Electrónico <span class="req">*</span></label>
            <InputText
              id="email"
              v-model="local.email"
              type="email"
              class="w-full"
              placeholder="correo@gmail.com"
              :invalid="!!errors.email"
              @input="touch('email')"
              @blur="touch('email')"
            />
            <Message v-if="errors.email" severity="error" :closable="false" class="field-msg">
              {{ errors.email }}
            </Message>
          </div>
        </form>

        <Message :severity="isValid ? 'success' : 'warn'" :closable="false" class="status-msg">
          <span v-if="isValid">Campos completos. Puede continuar.</span>
          <span v-else>Complete todos los campos para continuar</span>
        </Message>

        <div class="footer">
          <Button label="Anterior" icon="pi pi-arrow-left" severity="secondary" outlined @click="$emit('previous')" />
          <Button label="Siguiente" icon="pi pi-arrow-right" icon-pos="right" :disabled="!isValid" @click="handleNext" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { getDocumentos } from "../../actions/listDocumentos";
import type { Documentos } from "../../interfaces/listDocumentos.interface";

interface Props {
  formData: {
    tipoDocumento: number | null;
    numeroDocumento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:form-data": [data: Partial<Props["formData"]>];
  previous: [];
  next: [];
}>();

const local = reactive({
  tipoDocumento: props.formData.tipoDocumento,
  numeroDocumento: props.formData.numeroDocumento ?? "",
  nombre: props.formData.nombre ?? "",
  apellido: props.formData.apellido ?? "",
  telefono: props.formData.telefono ?? "",
  email: props.formData.email ?? "",
});

watch(
  () => props.formData,
  (v) => {
    local.tipoDocumento = v.tipoDocumento;
    local.numeroDocumento = v.numeroDocumento ?? "";
    local.nombre = v.nombre ?? "";
    local.apellido = v.apellido ?? "";
    local.telefono = v.telefono ?? "";
    local.email = v.email ?? "";
  },
  { deep: true }
);

watch(
  () => ({ ...local }),
  (v) => {
    emit("update:form-data", {
      tipoDocumento: v.tipoDocumento ?? null,
      numeroDocumento: v.numeroDocumento ?? "",
      nombre: (v.nombre ?? "").trim(),
      apellido: (v.apellido ?? "").trim(),
      telefono: v.telefono ?? "",
      email: (v.email ?? "").trim(),
    });
  },
  { deep: true }
);

const documentosOptions = ref<Documentos[]>([]);
const loadingDocs = ref(false);
const docsError = ref("");

const loadDocumentos = async () => {
  loadingDocs.value = true;
  docsError.value = "";
  try {
    const docs = await getDocumentos();
    documentosOptions.value = Array.isArray(docs) ? docs : [];
  } catch (e: unknown) {
    docsError.value = (e as Error)?.message || "No se pudo cargar los documentos";
    documentosOptions.value = [];
  } finally {
    loadingDocs.value = false;
  }
};
onMounted(loadDocumentos);

const toUpper = (v: string) => (v ?? "").toUpperCase();

/** Deja solo dígitos y limita longitud (DNI 8, teléfono 9) */
function onlyDigits(value: string, maxLen: number): string {
  const digits = (value ?? "").replace(/\D/g, "");
  return digits.slice(0, maxLen);
}

function getInputValue(e: Event | string): string {
  if (typeof e === "string") return e;
  return (e.target as HTMLInputElement)?.value ?? "";
}

function onNumeroDocumentoInput(e: Event | string) {
  const raw = getInputValue(e);
  local.numeroDocumento = onlyDigits(raw, 8);
  touch("numeroDocumento");
}

function onTelefonoInput(e: Event | string) {
  const raw = getInputValue(e);
  local.telefono = onlyDigits(raw, 9);
  touch("telefono");
}

const errors = reactive<Record<string, string>>({
  tipoDocumento: "",
  numeroDocumento: "",
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
});

const rules = {
  tipoDocumento: (v: number | null) => (v == null ? "Seleccione un tipo de documento." : ""),
  numeroDocumento: (v: string) => {
    if (!v) return "Ingrese el número de documento.";
    if (v.length !== 8) return "DNI debe tener 8 dígitos.";
    return "";
  },
  nombre: (v: string) => {
    if (!v) return "Ingrese nombres.";
    if (v.length < 2) return "Ingrese un nombre válido.";
    return "";
  },
  apellido: (v: string) => {
    if (!v) return "Ingrese apellidos.";
    if (v.length < 2) return "Ingrese un apellido válido.";
    return "";
  },
  telefono: (v: string) => {
    if (!v) return "Ingrese su celular.";
    if (!v.startsWith("9")) return "Debe iniciar con 9.";
    if (v.length !== 9) return "Debe tener 9 dígitos.";
    return "";
  },
  email: (v: string) => {
    if (!v) return "Ingrese su correo.";
    const email = (v ?? "").trim().toLowerCase();
    const okDomain = email.endsWith("@gmail.com") || email.endsWith("@outlook.com");
    if (!okDomain) return "Solo se acepta @gmail.com o @outlook.com.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Correo no válido.";
    return "";
  },
};

type FieldKey = "tipoDocumento" | "numeroDocumento" | "nombre" | "apellido" | "telefono" | "email";

function validateField(name: FieldKey): string {
  switch (name) {
    case "tipoDocumento":
      return rules.tipoDocumento(local.tipoDocumento);
    case "numeroDocumento":
      return rules.numeroDocumento(local.numeroDocumento);
    case "nombre":
      return rules.nombre(local.nombre);
    case "apellido":
      return rules.apellido(local.apellido);
    case "telefono":
      return rules.telefono(local.telefono);
    case "email":
      return rules.email(local.email);
    default:
      return "";
  }
}

function touch(name: FieldKey) {
  errors[name] = validateField(name);
}

const fieldKeys: FieldKey[] = [
  "tipoDocumento",
  "numeroDocumento",
  "nombre",
  "apellido",
  "telefono",
  "email",
];

function validateAll() {
  fieldKeys.forEach((k) => {
    errors[k] = validateField(k);
  });
}

const isValid = computed(() => {
  validateAll();
  return (
    !errors.tipoDocumento &&
    !errors.numeroDocumento &&
    !errors.nombre &&
    !errors.apellido &&
    !errors.telefono &&
    !errors.email &&
    !loadingDocs.value &&
    !docsError.value
  );
});

function handleNext() {
  validateAll();
  if (isValid.value) emit("next");
}
</script>

<style scoped>
.wrap {
  min-height: 100svh;
  padding: clamp(1rem, 2.5vw, 2rem);
  display: grid;
  place-items: start center;
  background: radial-gradient(1200px 500px at 20% 0%, rgba(200, 100, 10, 0.08), transparent 55%),
    linear-gradient(180deg, var(--church-surface) 0%, var(--church-brown-100) 55%, #fff 100%);
}

.card {
  width: 100%;
  max-width: 980px;
  background: var(--church-card);
  border: 1px solid var(--church-border);
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.08);
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.title__icon {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  margin: 0 auto 0.6rem;
  display: grid;
  place-items: center;
  background: var(--church-brown-100);
  border: 1px solid var(--church-border);
  color: var(--church-brown-500);
}

.title__icon i {
  font-size: 1.4rem;
}

.title h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: clamp(1.35rem, 1.8vw, 1.85rem);
  color: var(--church-brown-600);
  font-weight: 800;
}

.title__line {
  width: 92px;
  height: 3px;
  margin: 0.6rem auto 0;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--church-brown-400), transparent);
  opacity: 0.9;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.95rem 1.1rem;
}

@media (min-width: 820px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.field label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 700;
  color: var(--church-brown-600);
  font-size: 0.92rem;
}

.req {
  color: var(--church-brown-400);
}

.field-msg {
  margin-top: 0.35rem;
}

.w-full {
  width: 100%;
}

/* Asegurar inputs y dropdown con fondo claro (nunca negro) */
.card :deep(.p-inputtext),
.card :deep(.p-dropdown .p-dropdown-label) {
  background: #ffffff !important;
  color: var(--church-brown-700) !important;
}
.card :deep(.p-inputtext::placeholder) {
  color: var(--church-brown-300) !important;
}

.status-msg {
  margin-top: 1.1rem;
}

.footer {
  margin-top: 1.1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.footer :deep(.p-button:not(.p-button-secondary):not(.p-button-outlined)) {
  background: var(--church-brown-400);
  border-color: var(--church-brown-400);
}

.footer :deep(.p-button:not(.p-button-secondary):not(.p-button-outlined):hover:not(:disabled)) {
  background: var(--church-brown-500);
  border-color: var(--church-brown-500);
}

@media (max-width: 520px) {
  .footer .p-button {
    width: 100%;
  }
}
</style>
