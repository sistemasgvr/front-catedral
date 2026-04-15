<template>
  <Icon
    :icon="iconId"
    :width="size"
    :height="size"
    class="inline-block shrink-0"
    :class="variant === 'filled' ? 'text-[#ff9d14]' : undefined"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    /** Lado del icono en px (cuadrado) */
    size?: number;
    /** `filled`: color ámbar tipo tejado; `outline`: hereda el color del contenedor (p. ej. `class="text-white/20"`) */
    variant?: "filled" | "outline";
  }>(),
  { size: 256, variant: "filled" }
);

const iconId = computed(() =>
  props.variant === "outline" ? "mdi:church-outline" : "mdi:church"
);
</script>
