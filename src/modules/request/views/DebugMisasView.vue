<template>
    <div style="padding: 20px;">
        <h2>Debug - Action: Misas con Menciones</h2>

        <button @click="load" style="padding:10px 14px; cursor:pointer;">
            Recargar
        </button>

        <p v-if="loading">Cargando...</p>
        <p v-if="error" style="color:red;">{{ error }}</p>

        <pre v-if="data" style="background:#111;color:#0f0;padding:12px;border-radius:8px;overflow:auto;">
    {{ data }}
      </pre>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getListMisasMencionesAction } from "../actions/listMisasMencion.action.ts";
import type { MisaMencion } from "../interfaces/listMisasMencion.ts";

const loading = ref(false);
const error = ref<string | null>(null);
const data = ref<MisaMencion[] | null>(null);

const load = async () => {
    loading.value = true;
    error.value = null;

    try {
        const res = await getListMisasMencionesAction();
        data.value = res;
        loading.value = false;
        console.log("funciono correctamente");
    } catch (e: any) {
        error.value = e?.message ?? "Error desconocido";
        console.error(error.value);
        loading.value = false;
    }
};
onMounted(load);
</script>