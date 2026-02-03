<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background Image with Overlay -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
      :style="{ backgroundImage: `url('/images/FondoCatedral.jpeg')` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <HeaderSolicitud />

      <!-- Wizard Container -->
      <main class="flex-1 flex items-center px-4 py-6">
        <div class="w-full max-w-5xl mx-auto">
          <FormWizard
            ref="wizardRef"
            @complete="onComplete"
            @on-change="onStepChange"
            color="#C88A2A"
            title=""
            subtitle=""
            step-size="sm"
            back-button-text="Anterior"
            next-button-text="Siguiente"
            finish-button-text="Finalizar"
          >
            <TabContent 
              title="Solicitante"
              :before-change="validateStep1"
            >
              <StepDatosSolicitante ref="step1Ref" />
            </TabContent>

            <TabContent 
              title="Celebración"
              :before-change="validateStep2"
            >
              <StepDatosCelebracion ref="step2Ref" />
            </TabContent>

            <TabContent 
              title="Menciones"
              :before-change="validateStep3"
            >
              <StepMenciones ref="step3Ref" />
            </TabContent>

            <TabContent 
              title="Pago"
              :before-change="validateStep4"
            >
              <StepPago ref="step4Ref" />
            </TabContent>

            <TabContent 
              title="Confirmación"
              :before-change="() => true"
            >
              <StepResumen ref="step5Ref" />
            </TabContent>
          </FormWizard>
        </div>
      </main>

      <!-- Footer -->
      <FooterSolicitud />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { FormWizard, TabContent } from 'vue3-form-wizard';
import 'vue3-form-wizard/dist/style.css';

import HeaderSolicitud from '../components/HeaderSolicitud.vue';
import FooterSolicitud from '../components/FooterSolicitud.vue';
import StepDatosSolicitante from '../components/steps/StepDatosSolicitante.vue';
import StepDatosCelebracion from '../components/steps/StepDatosCelebracion.vue';
import StepMenciones from '../components/steps/StepMenciones.vue';
import StepPago from '../components/steps/StepPago.vue';
import StepResumen from '../components/steps/StepResumen.vue';
import { useSolicitudStore } from '../stores/solicitud.store';

const store = useSolicitudStore();
const router = useRouter();

// Referencia al FormWizard
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wizardRef = ref<any>(null);

// Referencias a los componentes de pasos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const step1Ref = ref<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const step2Ref = ref<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const step3Ref = ref<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const step4Ref = ref<any>(null);
const isRegistered = ref(false);

// Validaciones por paso
const validateStep1 = async (): Promise<boolean> => {
  if (step1Ref.value?.validate) {
    return await step1Ref.value.validate();
  }
  return true;
};

const validateStep2 = async (): Promise<boolean> => {
  if (step2Ref.value?.validate) {
    const isValid = await step2Ref.value.validate();
    
    if (isValid) {
      // Verificar si es misa privada o comunitaria
      const esMisaPrivada = step2Ref.value?.esMisaPrivada;
      
      if (esMisaPrivada) {
        // Misa privada -> Saltar directamente a Pago (índice 3)
        await nextTick();
        setTimeout(() => {
          if (wizardRef.value) {
            wizardRef.value.changeTab(1, 3); // De Celebración (1) a Pago (3)
          }
        }, 50);
        return false; // Retornar false para que no avance automáticamente
      }
      // Misa comunitaria -> Continuar a Menciones normalmente
      return true;
    }
    return false;
  }
  return true;
};

const validateStep3 = async (): Promise<boolean> => {
  if (step3Ref.value?.validate) {
    return await step3Ref.value.validate();
  }
  return true;
};

const validateStep4 = async (): Promise<boolean> => {
  if (step4Ref.value?.validate) {
    const ok = await step4Ref.value.validate();
    if (ok) {
      isRegistered.value = true;
    }
    return ok;
  }
  return true;
};

// Manejar cambios de paso (para navegación hacia atrás)
const onStepChange = (prevIndex: number, nextIndex: number) => {
  // Si estamos yendo hacia atrás desde Pago (3) a Menciones (2) y es misa privada
  // Redirigir a Celebración (1)
  if (prevIndex === 3 && nextIndex === 2 && store.esMisaPrivada) {
    nextTick(() => {
      setTimeout(() => {
        if (wizardRef.value) {
          wizardRef.value.changeTab(2, 1); // De Menciones (2) a Celebración (1)
        }
      }, 50);
    });
  }

  // Si ya se registró, no permitir regresar desde Resumen (4)
  if (isRegistered.value && prevIndex === 4 && nextIndex < prevIndex) {
    nextTick(() => {
      setTimeout(() => {
        if (wizardRef.value) {
          wizardRef.value.changeTab(nextIndex, 4);
        }
      }, 50);
    });
  }
};

const onComplete = () => {
  // Limpiar estado persistido y volver al inicio
  localStorage.removeItem('solicitud');
  localStorage.removeItem('solicitud_registered');
  store.resetSolicitud();
  isRegistered.value = false;
  router.push('/');
};
</script>

<style>
/* Personalización del wizard */
.vue-form-wizard {
  padding-bottom: 0 !important;
}

.vue-form-wizard .wizard-header {
  display: none;
}

/* Línea de progreso de fondo */
.vue-form-wizard .wizard-navigation .wizard-progress-with-circle {
  background-color: rgba(255, 255, 255, 0.3) !important;
  height: 3px !important;
  top: 24px !important;
}

/* Línea de progreso activa */
.vue-form-wizard .wizard-navigation .wizard-progress-with-circle .wizard-progress-bar {
  background-color: #C88A2A !important;
}

/* Círculos de pasos - fondo sólido para tapar la línea */
.vue-form-wizard .wizard-nav-pills > li > a .wizard-icon-circle {
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  background-color: #5A5A5A !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.vue-form-wizard .wizard-nav-pills > li > a .wizard-icon-circle .wizard-icon {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 600;
}

/* Círculo activo */
.vue-form-wizard .wizard-nav-pills > li.active > a .wizard-icon-circle {
  background-color: #C88A2A !important;
  border-color: #C88A2A !important;
}

.vue-form-wizard .wizard-nav-pills > li.active > a .wizard-icon-circle .wizard-icon {
  color: white !important;
}

/* Pasos completados */
.vue-form-wizard .wizard-nav-pills > li.checked > a .wizard-icon-circle {
  background-color: #C88A2A !important;
  border-color: #C88A2A !important;
}

.vue-form-wizard .wizard-nav-pills > li.checked > a .wizard-icon-circle .wizard-icon {
  color: white !important;
}

/* Títulos de pasos */
.vue-form-wizard .wizard-nav-pills > li > a .stepTitle {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.75rem;
  margin-top: 8px;
}

.vue-form-wizard .wizard-nav-pills > li.active > a .stepTitle {
  color: #D39E3A !important;
  font-weight: 600;
}

.vue-form-wizard .wizard-nav-pills > li.checked > a .stepTitle {
  color: #D39E3A !important;
}

/* Botones del wizard */
.vue-form-wizard .wizard-footer-left .wizard-btn,
.vue-form-wizard .wizard-footer-right .wizard-btn {
  min-height: 44px;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.vue-form-wizard .wizard-footer-right .wizard-btn {
  background-color: #C88A2A !important;
  border-color: #C88A2A !important;
}

.vue-form-wizard .wizard-footer-right .wizard-btn:hover {
  background-color: #B6791F !important;
  border-color: #B6791F !important;
}

.vue-form-wizard .wizard-footer-left .wizard-btn {
  background-color: white !important;
  border: 1px solid #BFBFBF !important;
  color: #4A4A4A !important;
}

.vue-form-wizard .wizard-footer-left .wizard-btn:hover {
  background-color: #F5F0E8 !important;
  border-color: #999 !important;
}

/* Contenido del tab */
.vue-form-wizard .wizard-tab-content {
  padding: 20px 0 !important;
  min-height: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .vue-form-wizard .wizard-nav-pills > li > a .stepTitle {
    font-size: 0.65rem;
  }
  
  .bg-fixed {
    background-attachment: scroll !important;
  }
}
</style>
