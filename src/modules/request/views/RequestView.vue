<template>
  <div class="request-view">
    
    <!-- Paso 0: Inicio -->
    <StepInicio 
      v-if="currentStep === 0"
      @nueva-solicitud="goToStep(1)"
      @consultar-solicitud="handleConsultar"
    />

    <!-- Paso 1: Datos del solicitante -->
    <StepDatosSolicitante
      v-if="currentStep === 1"
      :form-data="formData"
      @update:form-data="updateFormData"
      @next="goToStep(2)"
    />

    <!-- Paso 2: Datos de la celebración -->
    <StepDatosCelebracion
      v-if="currentStep === 2"
      :form-data="formData"
      @update:form-data="updateFormData"
      @previous="goToStep(1)"
      @next="goToStep(3)"
    />

    <!-- Paso 3: Menciones -->
    <StepMenciones
      v-if="currentStep === 3"
      :form-data="formData"
      @update:form-data="updateFormData"
      @previous="goToStep(2)"
      @next="goToStep(4)"
    />

    <!-- Paso 4: Pago y subida de voucher -->
    <StepPago
      v-if="currentStep === 4"
      :form-data="formData"
      @update:form-data="updateFormData"
      @previous="goToStep(3)"
      @confirm-payment="goToStep(5)"
    />

    <!-- Paso 5: Resumen y confirmación -->
    <StepResumen
      v-if="currentStep === 5"
      :form-data="formData"
      @inicio="goToStep(0)"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import StepInicio from "../components/steps/StepInicio.vue";
import StepDatosSolicitante from "../components/steps/StepDatosSolicitante.vue";
import StepDatosCelebracion from "../components/steps/StepDatosCelebracion.vue";
import StepMenciones from "../components/steps/StepMenciones.vue";
import StepPago from "../components/steps/StepPago.vue";
import StepResumen from "../components/steps/StepResumen.vue";

const router = useRouter();
const route = useRoute();

// Mapeo de rutas a pasos
const routeToStepMap: Record<string, number> = {
  '/': 0,
  '/datos-solicitante': 1,
  '/datos-celebracion': 2,
  '/menciones': 3,
  '/pago': 4,
  '/resumen': 5,
};

// Mapeo de pasos a rutas
const stepToRouteMap: Record<number, string> = {
  0: '/',
  1: '/datos-solicitante',
  2: '/datos-celebracion',
  3: '/menciones',
  4: '/pago',
  5: '/resumen',
};

// Obtener el paso actual desde la ruta
const currentStep = computed(() => {
  return routeToStepMap[route.path] ?? 0;
});

watch(() => route.fullPath, (newPath) => {
  if (window.location.hash && window.location.hash !== '#') {
    // Si hay un hash que no sea solo '#', reemplazar la URL sin hash
    const cleanPath = newPath.split('#')[0] || '/';
    if (cleanPath !== route.path) {
      router.replace(cleanPath).catch(() => {});
    }
  }
}, { immediate: true });

interface RequestFormData {
  tipoDocumento: number | null;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaCelebracion: string;
  tipoCelebracion: string;
  misa: string;
  hora: string;
  intencion: string;
  menciones: string[];
  total: number;
  voucher: File | null;
}

const formData = reactive<RequestFormData>({
  tipoDocumento: null,
  numeroDocumento: "",
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  fechaCelebracion: "",
  tipoCelebracion: "",
  misa: "",
  hora: "",
  intencion: "",
  menciones: [],
  total: 0,
  voucher: null,
});

const goToStep = (step: number) => {
  const targetRoute = stepToRouteMap[step];
  if (targetRoute) {
    router.push(targetRoute).catch(() => {
      // Ignorar errores de navegación si ya estamos en la misma ruta
    });
  }
};

// Limpiar hash de la URL al montar el componente y manejar navegación del navegador
const handlePopState = () => {
  // Usar setTimeout para asegurar que se ejecute después de que el router procese el cambio
  setTimeout(() => {
    // Si hay hash en la URL, reemplazarlo sin hash
    if (window.location.hash && window.location.hash !== '#') {
      const cleanPath = window.location.pathname;
      router.replace(cleanPath).catch(() => {});
    }
    // Si estamos en el paso 0, asegurar que la URL esté limpia
    const step = routeToStepMap[window.location.pathname] ?? 0;
    if (step === 0 && window.location.pathname !== '/') {
      router.replace('/').catch(() => {});
    }
  }, 0);
};

onMounted(() => {
  // Eliminar hash si existe
  if (window.location.hash) {
    router.replace(window.location.pathname).catch(() => {});
  }
  
  // Escuchar cambios en el historial del navegador
  window.addEventListener('popstate', handlePopState);
});

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState);
});

const updateFormData = (data: Partial<typeof formData>) => {
  Object.assign(formData, data);
};

const handleConsultar = () => {
  // TODO: Implementar consulta de solicitud
  console.log("Consultar solicitud");
};
</script>

<style scoped>
/* =========================
   Layout base
========================= */
.request-view {
  min-height: 100svh;
  padding: clamp(1rem, 2vw, 2rem);
  display: grid;
  place-items: center;
  background: var(--church-surface);
}

@media (max-width: 640px) {
  .request-view {
    padding: 1rem;
  }
}

/* Paso inicio: full screen sin “saltos” */
.request-view :deep(.step-inicio) {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* =========================
   Botones (base)
========================= */
.btn {
  --btn-bg: #ffffff;
  --btn-fg: #111827;
  --btn-br: #d1d5db;
  --btn-bg-hover: #f3f4f6;
  --btn-bg-active: #e5e7eb;

  appearance: none;
  border: 1px solid var(--btn-br);
  background: var(--btn-bg);
  color: var(--btn-fg);

  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;

  cursor: pointer;
  user-select: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    transform 120ms ease,
    box-shadow 150ms ease;
}

.btn:hover {
  background: var(--btn-bg-hover);
}

.btn:active {
  background: var(--btn-bg-active);
  transform: translateY(1px);
}

.btn:disabled,
.btn[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/* Focus accesible (teclado) */
.btn:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px rgba(200, 100, 10, 0.25);
  border-color: var(--church-brown-400);
}

/* =========================
   Variantes
========================= */
.btn--primary {
  --btn-bg: #2563eb;
  --btn-fg: #ffffff;
  --btn-br: #2563eb;
  --btn-bg-hover: #1d4ed8;
  --btn-bg-active: #1e40af;
}

.btn--secondary {
  --btn-bg: #ffffff;
  --btn-fg: #374151;
  --btn-br: #d1d5db;
  --btn-bg-hover: #f9fafb;
  --btn-bg-active: #f3f4f6;
}

.btn--purple {
  --btn-bg: #9333ea;
  --btn-fg: #ffffff;
  --btn-br: #9333ea;
  --btn-bg-hover: #7e22ce;
  --btn-bg-active: #6b21a8;
}

/* Tamaños */
.btn--large {
  padding: 0.9rem 1.25rem;
  font-size: 1rem;
  border-radius: 0.9rem;
}

/* Opcional: botón ancho completo para móvil */
@media (max-width: 640px) {
  .btn--large {
    width: 100%;
  }
}
</style>