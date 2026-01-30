<template>
  <div class="step">
    <Card class="panel">
      <template #content>
        <div class="title">
          <div class="title-icon ok"><i class="pi pi-check"></i></div>
          <h2>¡Solicitud Registrada!</h2>
          <p>Su solicitud ha sido registrada exitosamente</p>
        </div>

        <div class="sections">
          <Card class="section">
            <template #content>
              <div class="section-title">
                <i class="pi pi-user"></i><span>Datos del Solicitante</span>
              </div>
              <div class="kv">
                <div><b>Nombre:</b> {{ formData.nombre }} {{ formData.apellido }}</div>
                <div><b>Documento:</b> {{ formData.tipoDocumento }}: {{ formData.numeroDocumento }}</div>
                <div><b>Teléfono:</b> {{ formData.telefono }}</div>
                <div><b>Correo:</b> {{ formData.email }}</div>
              </div>
            </template>
          </Card>

          <Card class="section">
            <template #content>
              <div class="section-title">
                <i class="pi pi-calendar"></i><span>Datos de la Celebración</span>
              </div>
              <div class="kv">
                <div><b>Fecha:</b> {{ formData.fechaCelebracion }}</div>
                <div><b>Tipo:</b> {{ formData.tipoCelebracion }}</div>
                <div><b>Misa:</b> {{ formData.misa }}</div>
                <div><b>Hora:</b> {{ formData.hora }}</div>
                <div><b>Intención:</b> {{ formData.intencion }}</div>
              </div>
            </template>
          </Card>

          <Card class="section">
            <template #content>
              <div class="section-title">
                <i class="pi pi-file-edit"></i><span>Menciones ({{ formData.menciones?.length ?? 0 }})</span>
              </div>
              <ol class="mentions">
                <li v-for="(m, i) in (formData.menciones ?? [])" :key="i">{{ m }}</li>
              </ol>
            </template>
          </Card>

          <Card class="section">
            <template #content>
              <div class="section-title">
                <i class="pi pi-wallet"></i><span>Información de Pago</span>
              </div>
              <div class="pay-row">
                <div>
                  <div class="muted">Total Pagado</div>
                  <div class="total">S/ {{ formData.total }}</div>
                </div>
                <Tag value="Menciones: Gratis" severity="success" />
              </div>
            </template>
          </Card>

          <Message severity="success" :closable="false" class="msg">
            Confirmación enviada. Por favor revise su bandeja de entrada o spam.
          </Message>
        </div>

        <div class="footer">
          <Button label="Volver al Inicio" class="btn-next" @click="$emit('inicio')" />
          <small class="bless">Que Dios los bendiga 🙏</small>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import Message from "primevue/message";
import Tag from "primevue/tag";

defineProps<{
  formData: any;
}>();

defineEmits<{
  inicio: [];
}>();
</script>

<style scoped>
.step{ padding: 2rem 1rem; display:flex; justify-content:center; }
.panel{ width: 100%; max-width: 980px; border-radius: 16px; }

.title{ text-align:center; margin-bottom: 1.25rem; }
.title-icon{
  width:64px; height:64px; border-radius:50%;
  display:grid; place-items:center; margin:0 auto .75rem;
  border: 1px solid #c7f9d5;
  background:#eafff0;
  color:#0a7a2a;
}
.title-icon.ok i{ font-size: 1.4rem; }
.title h2{ margin:0; font-family: Georgia, serif; color: var(--church-brown-600); }
.title p{ margin:.4rem 0 0; color:#6b7280; }

.sections{ display:flex; flex-direction:column; gap: 1rem; }
.section{ border-radius: 14px; }
.section-title{
  display:flex; gap:.5rem; align-items:center;
  font-weight:700; color: var(--church-brown-600); margin-bottom: .75rem;
}
.kv{ display:grid; gap:.35rem; color:#111827; }
.mentions{ margin:0; padding-left: 1.2rem; display:grid; gap:.35rem; }

.pay-row{ display:flex; justify-content:space-between; align-items:center; gap: 1rem; }
.muted{ color:#6b7280; font-size:.9rem; }
.total{ font-size: 2rem; font-weight:800; color: var(--church-brown-600); }

.msg{ margin-top: .5rem; }

.footer{ margin-top: 1.5rem; display:flex; flex-direction:column; align-items:center; gap:.75rem; }
.btn-next{ background: var(--church-brown-400); border: 1px solid var(--church-brown-400); }
.bless{ color:#6b7280; }
</style>
