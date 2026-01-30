<template>
  <div class="step">
    <Card class="panel">
      <template #content>
        <div class="title">
          <div class="title-icon"><i class="pi pi-file-edit"></i></div>
          <h2>Menciones</h2>
          <p>Las menciones no tienen costo adicional</p>
        </div>

        <div class="add-row">
          <InputText
            v-model="mencionInput"
            class="w-full"
            placeholder="Escribe una mención (Ej: Por la salud de María)"
            @keyup.enter="addMencion"
          />
          <Button label="Agregar" icon="pi pi-plus" class="btn-add" @click="addMencion" />
        </div>

        <div class="list">
          <div v-for="(m, i) in local.menciones" :key="i" class="item">
            <Tag :value="`Mención ${i + 1}`" class="tag" />
            <div class="text">{{ m }}</div>
            <Button
              icon="pi pi-times"
              severity="danger"
              text
              rounded
              aria-label="Eliminar"
              @click="removeMencion(i)"
            />
          </div>
        </div>

        <Message severity="info" :closable="false" class="msg">
          Las menciones se incluyen sin costo adicional en su solicitud de misa
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
import { ref, watch } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Tag from "primevue/tag";

interface Props {
  formData: {
    menciones: string[];
  };
}
const props = defineProps<Props>();

const emit = defineEmits<{
  "update:form-data": [data: Partial<Props["formData"]>];
  previous: [];
  next: [];
}>();

const local = ref({ ...props.formData });
const mencionInput = ref("");

watch(() => props.formData, (v) => (local.value = { ...v }), { deep: true });
watch(local, (v) => emit("update:form-data", v), { deep: true });

const addMencion = () => {
  const text = mencionInput.value.trim();
  if (!text) return;
  local.value.menciones = [...(local.value.menciones ?? []), text];
  mencionInput.value = "";
};

const removeMencion = (index: number) => {
  local.value.menciones = local.value.menciones.filter((_, i) => i !== index);
};
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
.title p{ margin:.4rem 0 0; color:#6b7280; }

.add-row{
  display:flex; gap:.75rem; align-items:center;
  margin: 1rem 0 1.25rem;
}
.btn-add{ background:#c8640a; border:1px solid #c8640a; white-space:nowrap; }

.list{ display:flex; flex-direction:column; gap:.85rem; }
.item{
  border: 1px solid var(--church-border);
  background: var(--church-brown-50);
  border-radius: 12px;
  padding: .9rem 1rem;
  display:grid;
  grid-template-columns: auto 1fr auto;
  gap: .75rem;
  align-items:center;
}
.tag{ background: var(--church-brown-200); color: var(--church-brown-600); }
.text{ color:#111827; }

.msg{ margin-top: 1.25rem; }

.footer{ display:flex; justify-content:space-between; gap: .75rem; margin-top: 1.5rem; }
.btn-next{ background: var(--church-brown-400); border: 1px solid var(--church-brown-400); }
</style>
