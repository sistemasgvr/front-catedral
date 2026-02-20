<template>
  <div class="sidebar-skeleton">
    <div class="item" v-for="i in 5" :key="i">
      <div class="icon"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Sin lógica reactiva, solo animación
</script>

<style scoped>
.sidebar-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%; /* ajusta al ancho de tu sidebar */
  padding: 8px;
}

/* Cada ítem del menú */
.item {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Efecto shimmer */
.icon,
.line {
  background-image: linear-gradient(
    90deg,
    #ddd 0px,
    #e8e8e8 40px,
    #ddd 80px
  );
  background-size: 600px;
  animation: shine 1.6s infinite linear;
}

/* Icono circular */
.icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* Línea (texto del menú) */
.line {
  flex: 1;
  height: 14px;
  border-radius: 7px;
}

/* Animación del brillo */
@keyframes shine {
  0% {
    background-position: -100px;
  }
  40%,
  100% {
    background-position: 140px;
  }
}
</style>
