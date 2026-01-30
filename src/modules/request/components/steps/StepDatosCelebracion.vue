<template>
  <div class="step">
    <Card class="panel">
      <template #content>
        <div class="title">
          <div class="title-icon"><i class="pi pi-calendar"></i></div>
          <h2>Datos de la Celebración</h2>
        </div>

        <div class="grid">
          <div class="field">
            <label>Fecha de Celebración *</label>
            <Calendar v-model="local.fechaCelebracion" dateFormat="dd/mm/yy" class="w-full" showIcon />
          </div>

          <div class="field">
            <label>Tipo de Celebración *</label>
            <Dropdown
              v-model="local.tipoCelebracion"
              :options="tipoCelebracionOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione"
              class="w-full"
            />
          </div>

          <div class="field">
            <label>Misa *</label>
            <Dropdown
              v-model="local.misa"
              :options="misaOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione"
              class="w-full"
            />
          </div>

          <div class="field">
            <label>Hora *</label>
            <Calendar v-model="local.hora" timeOnly class="w-full" iconDisplay="input" showIcon />
          </div>

          <div class="field field-full">
            <label>Intención *</label>
            <InputText v-model="local.intencion" class="w-full" placeholder="Intención" />
          </div>
        </div>

        <Message severity="success" class="msg" :closable="false">
          Disponibilidad confirmada. Complete el tipo de misa e intención para continuar.
        </Message>

        <div class="footer">
          <Button label="Anterior" icon="pi pi-arrow-left" severity="secondary" outlined @click="$emit('previous')" />
          <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="btn-next" @click="$emit('next')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch,onMounted} from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import {getListMisasAction} from "../../actions/listMisas.action.ts";
import type {Misa} from "../../interfaces/listMisas.interface.ts";
const error = ref<string | null>(null);
const data = ref<Misa[] | null>(null);

const load = async () => {
    error.value = null;

    try {
        const res = await getListMisasAction();
        data.value = res;
    } catch (e: any) {
        error.value = e?.message ?? "Error desconocido";
        console.error(error.value);
    }
};
onMounted(load);
interface Props {
  formData: {
    fechaCelebracion: any;
    tipoCelebracion: string;
    misa: any;
    hora: any;
    intencion: string;
  };
}
const props = defineProps<Props>();

const emit = defineEmits<{
  "update:form-data": [data: Partial<Props["formData"]>];
  previous: [];
  next: [];
}>();

const local = ref({ ...props.formData });

watch(() => props.formData, (v) => (local.value = { ...v }), { deep: true });
watch(local, (v) => emit("update:form-data", v), { deep: true });

const tipoCelebracionOptions = [
  { label: "Misa", value: "misa" },
  { label: "Bautizo", value: "bautizo" },
  { label: "Matrimonio", value: "matrimonio" },
];

// de momento “mock”; luego lo llenas con tu action real
const misaOptions = [
  { label: "Misa 1", value: "misa1" },
  { label: "Misa 2", value: "misa2" },
];
</script>

<style scoped>
.step{ padding: 2rem 1rem; display:flex; justify-content:center; }
.panel{ width: 100%; max-width: 980px; border-radius: 16px; }
.title{ text-align:center; margin-bottom: 1.25rem; }
.title-icon{
  width:54px; height:54px; border-radius:50%;
  background: var(--church-brown-100); color: var(--church-brown-500);
  display:grid; place-items:center; margin:0 auto .75rem;
  border: 1px solid var(--church-border);
}
.title h2{ margin:0; font-family: Georgia, serif; color: var(--church-brown-600); }

.grid{
  display:grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media(min-width: 768px){
  .grid{ grid-template-columns: 1fr 1fr; }
  .field-full{ grid-column: 1 / -1; }
}
.field label{ font-size:.9rem; color:#7a3a10; font-weight:600; display:block; margin-bottom:.35rem; }

.msg{ margin-top: 1.25rem; }

.footer{ display:flex; justify-content:space-between; gap: .75rem; margin-top: 1.5rem; }
.btn-next{ background: var(--church-brown-400); border: 1px solid var(--church-brown-400); }
</style>
