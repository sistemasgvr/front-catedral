<template>
  <div class="step-inicio">
    <div class="bg"></div>
    <div class="overlay"></div>

    <div class="content">
      <!-- Header -->
      <div class="header">
        <div class="header__icon">
          <i class="pi pi-building"></i>
        </div>

        <h1 class="header__title">Iglesia de San Pedro</h1>
        <div class="header__subtitle">Lambayeque</div>
      </div>

      <!-- Card -->
      <Card class="card">
        <template #content>
          <div class="card__body">
            <div class="buttons">
              <Button
                label="Solicitar Misa Privada"
                icon="pi pi-plus"
                class="btn btn--brown"
                @click="$emit('nueva-solicitud')"
              />

              <Button
                label="Consultar Solicitud"
                icon="pi pi-search"
                class="btn btn--blue"
                @click="$emit('consultar-solicitud')"
              />

              <!-- Botón extra como en tu diseño -->
              <Button
                label="Misas Publicas"
                icon="pi pi-calendar"
                class="btn btn--green"
                @click="$emit('consultar-solicitud')"
              />
            </div>

            <Divider class="divider" />

            <div class="quote">
              <em>"La fe mueve montañas"</em>
              <small>Mateo 17:20</small>
            </div>
          </div>
        </template>
      </Card>

      <div class="footer">
        Que Dios los bendiga 🙏
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import Divider from "primevue/divider";

defineEmits<{
  "nueva-solicitud": [];
  "consultar-solicitud": [];
}>();
</script>

<style scoped>
/* Usa variables globales --church-* de main.css */

.step-inicio{
  position: fixed;
  inset: 0;
  overflow: hidden;
}

/* Fondo */
.bg{
  position:absolute; inset:0;
  background-image: url("/images/FondoCatedral.jpeg");
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  transform: scale(1.05);
}
.overlay{
  position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(90,42,12,.82), rgba(58,28,12,.75));
}

/* Layout */
.content{
  position:relative; z-index:1;
  min-height: 100vh;
  padding: 2.5rem 1.25rem 1.5rem;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  gap: 1.35rem;
}

/* Header */
.header{
  text-align:center;
  color:#fff;
  max-width: 780px;
}
.header__icon{
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display:grid;
  place-items:center;
  margin: 0 auto 1rem;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.22);
}
.header__icon i{ font-size: 1.45rem; }

.header__title{
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.9rem, 3.2vw, 2.6rem);
  margin: 0;
  letter-spacing: .2px;
}
.header__subtitle{
  margin-top: .35rem;
  font-weight: 700;
  color: var(--church-brown-200);
  font-size: 1.05rem;
}
.header__desc{
  margin: .75rem 0 0;
  opacity: .92;
  font-size: .95rem;
}

/* Card */
.card{
  width: 100%;
  max-width: 520px;
  background: var(--church-card);
  border-radius: 18px;
  box-shadow: 0 14px 40px rgba(0,0,0,.22);
  border: 1px solid var(--church-border);
  backdrop-filter: blur(18px);
}
.card__body{
  padding: .25rem .25rem .35rem;
}

.logo{
  display:flex;
  justify-content:center;
  margin: .25rem 0 1rem;
}

/* Botones */
.buttons{
  display:flex;
  flex-direction:column;
  gap: .85rem;
}

.btn{
  width: 100%;
  border-radius: 12px;
  padding: .95rem 1rem;
  font-weight: 700;
}

/* Marrón (principal) */
.btn--brown :deep(.p-button){
  width:100%;
  background: var(--church-brown-400);
  border: 1px solid var(--church-brown-400);
}
.btn--brown :deep(.p-button:hover){
  filter: brightness(.95);
}

/* Azul (consultar) */
.btn--blue :deep(.p-button){
  width:100%;
  background: #1d4ed8;
  border: 1px solid #1d4ed8;
}

/* Verde (menciones) */
.btn--green :deep(.p-button){
  width:100%;
  background: #0a8f3b;
  border: 1px solid #0a8f3b;
}

.divider{
  margin: 1.25rem 0 1rem;
}

/* Quote */
.quote{
  text-align:center;
  color: #6b7280;
  display:flex;
  flex-direction:column;
  gap:.25rem;
  padding-bottom: .25rem;
}
.quote em{ font-style: italic; }
.quote small{ opacity: .9; }

/* Footer */
.footer{
  margin-top: auto;
  padding-top: 1rem;
  color: rgba(255,255,255,.85);
  font-size: .95rem;
}

/* Responsive: en desktop, card un poquito más abajo */
@media (min-width: 900px){
  .content{
    padding-top: 3.25rem;
  }
}
</style>
