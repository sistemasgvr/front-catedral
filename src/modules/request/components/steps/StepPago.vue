<template>
  <div class="step">
    <Card class="panel">
      <template #content>
        <!-- Título -->
        <div class="title">
          <div class="title-icon"><i class="pi pi-wallet"></i></div>
          <h2>Pago y Comprobante</h2>
          <div class="title-line"></div>
        </div>

        <!-- Resumen pago -->
        <div class="pay-summary">
          <div class="left">
            <div class="label">Concepto:</div>
            <div class="concept">
              <i class="pi pi-bookmark"></i>
              <span>{{ conceptoLabel }}</span>
            </div>
            <small class="hint">(Menciones sin costo adicional)</small>
          </div>

          <div class="right">
            <div class="label">Total a pagar:</div>
            <div class="total">S/ {{ totalPagar }}</div>
          </div>
        </div>

        <!-- Instrucciones + QR -->
        <div class="grid">
          <Card class="box">
            <template #content>
              <div class="box-title">
                <i class="pi pi-info-circle"></i>
                <span>Instrucciones de Pago</span>
              </div>

              <ol class="steps">
                <li>Realice el pago mediante transferencia o depósito bancario</li>
                <li>Escanee el código QR para obtener los datos bancarios</li>
                <li>Suba el comprobante de pago usando el botón inferior</li>
              </ol>
            </template>
          </Card>

          <Card class="box qr">
            <template #content>
              <div class="qr-wrap">
                <!-- Si tienes imagen real, reemplaza src -->
                <img
                  class="qr-img"
                  :src="qrImageSrc"
                  alt="QR"
                />
              </div>

              <div class="qr-info">
                <div><b>Banco:</b> {{ bankName }}</div>
                <div class="cci"><b>CCI:</b> {{ cci }}</div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Subir comprobante -->
        <Card class="upload">
          <template #content>
            <div class="upload-head">
              <div class="upload-icon"><i class="pi pi-upload"></i></div>
              <div>
                <div class="upload-title">Subir Comprobante</div>
                <div class="upload-sub">Adjunte una imagen o PDF del pago</div>
              </div>
            </div>

            <FileUpload
              mode="basic"
              name="voucher"
              chooseLabel="Seleccionar archivo"
              :auto="false"
              :customUpload="true"
              accept="image/*,application/pdf"
              :maxFileSize="5_000_000"
              @select="onSelect"
              class="file-btn"
            />

            <div v-if="local.voucher" class="file-preview">
              <i class="pi pi-file"></i>
              <div class="file-meta">
                <div class="file-name">{{ local.voucher.name }}</div>
                <small class="file-size">{{ prettySize(local.voucher.size) }}</small>
              </div>

              <Button
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                @click="removeFile"
                aria-label="Quitar archivo"
              />
            </div>

            <Message
              v-if="showNoFileWarning"
              severity="warn"
              :closable="false"
              class="msg"
            >
              Debe subir el comprobante para continuar.
            </Message>
          </template>
        </Card>

        <!-- Footer -->
        <div class="footer">
          <Button
            label="Anterior"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            @click="$emit('previous')"
          />

          <Button
            label="Confirmar pago"
            icon="pi pi-check"
            class="btn-next"
            @click="confirm"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Message from "primevue/message";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";

interface Props {
  formData: {
    // lo que ya manejas en tu flujo
    total: number;
    misa: string; // o id
    tipoCelebracion: string;
    menciones: string[];
    voucher: File | null;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:form-data": [data: Partial<Props["formData"]>];
  previous: [];
  "confirm-payment": [];
}>();

const local = ref({ ...props.formData });
const showNoFileWarning = ref(false);

watch(
  () => props.formData,
  (v) => (local.value = { ...v }),
  { deep: true }
);

watch(
  local,
  (v) => emit("update:form-data", v),
  { deep: true }
);

// ---- UI computed (ajusta a tus datos reales) ----
const conceptoLabel = computed(() => {
  // Si en tu formData ya guardas "tipo misa" o "misa", cámbialo aquí
  return local.value.misa || "Por los Difuntos";
});

const totalPagar = computed(() => {
  return local.value.total || 60; // si viene de tipomisa.precio, úsalo aquí
});

// QR + banco (puedes llevarlo luego desde config)
const qrImageSrc = "/images/qr-placeholder.png"; // reemplaza con tu imagen real
const bankName = "BCP";
const cci = "002-XXXX-XXXX-XXXX";

// ---- File upload ----
const onSelect = (event: FileUploadSelectEvent) => {
  showNoFileWarning.value = false;
  const file = event.files?.[0];
  if (!file) return;
  local.value.voucher = file;
};

const removeFile = () => {
  local.value.voucher = null;
};

const confirm = () => {
  if (!local.value.voucher) {
    showNoFileWarning.value = true;
    return;
  }
  emit("confirm-payment");
};

// util
const prettySize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};
</script>

<style scoped>
.step {
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
}
.panel {
  width: 100%;
  max-width: 980px;
  border-radius: 16px;
}

/* title */
.title {
  text-align: center;
  margin-bottom: 1.25rem;
}
.title-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--church-brown-100);
  color: var(--church-brown-500);
  display: grid;
  place-items: center;
  margin: 0 auto 0.6rem;
  border: 1px solid var(--church-border);
}
.title-icon i { font-size: 1.4rem; }
.title h2 {
  margin: 0;
  font-family: Georgia, serif;
  color: var(--church-brown-600);
}
.title-line{
  width: 80px;
  height: 3px;
  margin: .6rem auto 0;
  background: linear-gradient(90deg, transparent, var(--church-brown-400), transparent);
  border-radius: 99px;
}

/* summary */
.pay-summary {
  background: var(--church-brown-500);
  border-radius: 14px;
  color: #fff;
  padding: 1.25rem 1.25rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin: 1.2rem 0 1.5rem;
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}
.pay-summary .label { opacity: .9; font-size: .9rem; }
.concept { display:flex; align-items:center; gap:.5rem; font-weight: 700; }
.hint { opacity: .9; }
.total { font-size: 2rem; font-weight: 900; }

/* grid */
.grid{
  display:grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media(min-width: 900px){
  .grid{ grid-template-columns: 1fr 1fr; }
}
.box { border-radius: 14px; }
.box-title{
  display:flex; align-items:center; gap:.5rem;
  font-weight: 800;
  color: var(--church-brown-600);
  margin-bottom: .75rem;
}
.steps{
  margin: 0;
  padding-left: 1.2rem;
  display:grid;
  gap:.6rem;
  color:#374151;
}
.steps li::marker{ color: var(--church-brown-400); font-weight: 800; }

/* qr */
.qr{
  background: var(--church-brown-500);
  color:#fff;
}
.qr-wrap{
  display:flex;
  justify-content:center;
  margin-bottom: 1rem;
}
.qr-img{
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
  background: #fff;
  padding: 12px;
}
.qr-info{
  text-align:center;
  display:grid;
  gap:.5rem;
  opacity: .95;
}
.cci{ opacity:.95; }

/* upload */
.upload{
  margin-top: 1rem;
  border-radius: 14px;
  border: 2px dashed var(--church-brown-300);
}
.upload-head{
  display:flex; align-items:center; gap:.75rem;
  margin-bottom: .75rem;
}
.upload-icon{
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--church-brown-100); color: var(--church-brown-500);
  display:grid; place-items:center;
  border: 1px solid var(--church-border);
}
.upload-title{ font-weight: 900; color: var(--church-brown-600); }
.upload-sub{ font-size: .9rem; color:#6b7280; }

.file-btn :deep(.p-button){
  background:#c8640a;
  border:1px solid #c8640a;
}
.file-preview{
  margin-top: .9rem;
  display:flex; align-items:center; justify-content:space-between;
  gap: .75rem;
  padding: .75rem 1rem;
  border-radius: 12px;
  background: #fffaf0;
  border: 1px solid #fde7c7;
}
.file-preview i{ font-size: 1.15rem; color:#c8640a; }
.file-meta{ flex:1; min-width:0; }
.file-name{ font-weight: 800; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.file-size{ color:#6b7280; }

.msg{ margin-top: .85rem; }

/* footer */
.footer{
  margin-top: 1.5rem;
  display:flex;
  justify-content: space-between;
  gap:.75rem;
}
.btn-next{
  background: var(--church-brown-400);
  border: 1px solid var(--church-brown-400);
}
</style>
