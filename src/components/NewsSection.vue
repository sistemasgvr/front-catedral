<template>
  <div class="news-slider-wrapper">
    <!-- Header -->
    <div class="slider-header">
      <div class="header-left">
        <div class="pulse-dot"></div>
        <span class="header-label">Noticias & Eventos</span>
      </div>
      <span v-if="!loading && noticias.length > 0" class="count-badge">
        {{ noticias.length }} anuncios
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-track">
      <div v-for="i in 3" :key="i" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-lines">
          <div class="skel skel-title"></div>
          <div class="skel skel-body"></div>
          <div class="skel skel-body short"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="noticias.length === 0" class="empty-state">
      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <p>No hay noticias disponibles</p>
    </div>

    <!-- Slider Track -->
    <div v-else class="slider-outer" @mouseenter="pauseSlider" @mouseleave="resumeSlider">
      <div class="slider-track" :style="trackStyle" ref="trackRef">
        <!-- Doubled for infinite loop -->
        <div
          v-for="(noticia, index) in duplicatedNoticias"
          :key="`${noticia.idnoticia}-${index}`"
          class="news-card"
          :class="{ expanded: expandedId === `${noticia.idnoticia}-${index}` }"
        >
          <!-- Destacada badge -->
          <span v-if="noticia.destacada" class="badge-destacada">★ Destacada</span>

          <div class="card-inner">
            <!-- Image -->
            <div v-if="noticia.imagen" class="card-img-wrap">
              <img
                :src="noticia.imagen"
                :alt="noticia.titulo"
                class="card-img"
                @click.stop="abrirImagen(noticia.imagen!, noticia.titulo)"
              />
            </div>

            <!-- Content -->
            <div class="card-body">
              <h4 class="card-title">{{ noticia.titulo }}</h4>

              <div class="card-content-wrap" :class="{ expanded: expandedId === `${noticia.idnoticia}-${index}` }">
                <p class="card-text">{{ noticia.contenido }}</p>
              </div>

              <button
                v-if="noticia.contenido && noticia.contenido.length > 100"
                class="ver-mas"
                @click.stop="toggleExpand(`${noticia.idnoticia}-${index}`)"
              >
                {{ expandedId === `${noticia.idnoticia}-${index}` ? 'Ver menos ↑' : 'Ver más...' }}
              </button>

              <div class="card-meta">
                <span class="meta-date">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatearFecha(noticia.fecha_publicacion) }}
                </span>
                <span v-if="noticia.fecha_evento" class="meta-event">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatearFecha(noticia.fecha_evento) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal imagen -->
    <NoticiaImageModal
      :is-open="imagenModal.abierto"
      :name="'imagenModal'"
      :src="imagenModal.src"
      :alt="imagenModal.alt"
      @close="imagenModal.abierto = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { obtenerNoticiasPublicas } from '../actions/noticias.action';
import NoticiaImageModal from './NoticiaImageModal.vue';
import type { INoticiaResumen } from '@/interfaces/noticia.interface';

const noticias = ref<INoticiaResumen[]>([]);
const loading = ref(false);
const trackRef = ref<HTMLElement | null>(null);
const expandedId = ref<string | null>(null);
const imagenModal = ref({ abierto: false, src: '' as string | null, alt: '' });

// Slider state
const offset = ref(0);
const isPaused = ref(false);
let animFrame: number;
const SPEED = 0.4; // px per frame

const duplicatedNoticias = computed(() => [...noticias.value, ...noticias.value]);

const trackStyle = computed(() => ({
  transform: `translateX(${-offset.value}px)`,
  transition: 'none',
}));

const animate = () => {
  if (!isPaused.value && trackRef.value) {
    offset.value += SPEED;
    const totalWidth = trackRef.value.scrollWidth / 2;
    if (offset.value >= totalWidth) {
      offset.value = 0;
    }
  }
  animFrame = requestAnimationFrame(animate);
};

const pauseSlider = () => { isPaused.value = true; };
const resumeSlider = () => { isPaused.value = false; };

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
  isPaused.value = expandedId.value !== null;
};

const abrirImagen = (src: string, alt: string) => {
  imagenModal.value = { abierto: true, src, alt };
};

const cargarNoticias = async () => {
  loading.value = true;
  try {
    noticias.value = await obtenerNoticiasPublicas(10);
  } catch (error) {
    console.error('Error cargando noticias:', error);
  } finally {
    loading.value = false;
    animFrame = requestAnimationFrame(animate);
  }
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return '';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

onMounted(() => { cargarNoticias(); });
onUnmounted(() => { cancelAnimationFrame(animFrame); });
</script>

<style scoped>
.news-slider-wrapper {
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(211, 158, 58, 0.25);
  border-radius: 20px;
  padding: 20px 0 24px;
  overflow: hidden;
}

/* Header */
.slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 16px;
  border-bottom: 1px solid rgba(211, 158, 58, 0.15);
  margin-bottom: 20px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C88A2A;
  box-shadow: 0 0 0 0 rgba(200, 138, 42, 0.4);
  animation: pulse-ring 2s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,138,42,0.5); }
  50% { box-shadow: 0 0 0 6px rgba(200,138,42,0); }
}
.header-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.count-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 2px 10px;
  border-radius: 999px;
}

/* Slider outer */
.slider-outer {
  position: relative;
  overflow: hidden;
  padding: 4px 0;
}
.slider-track {
  display: flex;
  gap: 16px;
  will-change: transform;
  padding: 8px 24px;
  width: max-content;
}

/* News card */
.news-card {
  flex-shrink: 0;
  width: 280px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
  cursor: default;
}
.news-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(200,138,42,0.15);
  transform: translateY(-3px);
}
.news-card.expanded {
  width: 320px;
}

.badge-destacada {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #C88A2A, #B6791F);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(200,138,42,0.4);
}

.card-inner {
  display: flex;
  flex-direction: column;
}

.card-img-wrap {
  width: 100%;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.4s ease;
}
.card-img:hover {
  transform: scale(1.05);
}

.card-body {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-content-wrap {
  max-height: 48px;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-content-wrap.expanded {
  max-height: 300px;
}
.card-text {
  font-size: 0.75rem;
  color: #555;
  line-height: 1.55;
  margin: 0;
}

.ver-mas {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #C88A2A;
  cursor: pointer;
  text-align: left;
  letter-spacing: 0.02em;
  transition: color 0.2s;
}
.ver-mas:hover {
  color: #B6791F;
  text-decoration: underline;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.meta-date, .meta-event {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  color: #888;
}
.meta-event {
  color: #8C1D40;
  font-weight: 600;
}

/* Loading */
.loading-track {
  display: flex;
  gap: 16px;
  padding: 8px 24px;
  overflow: hidden;
}
.skeleton-card {
  flex-shrink: 0;
  width: 280px;
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.skeleton-img {
  width: 100%;
  height: 140px;
  background: rgba(255,255,255,0.08);
  animation: shimmer 1.5s infinite;
}
.skeleton-lines {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skel {
  height: 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.08);
  animation: shimmer 1.5s infinite;
}
.skel-title { width: 75%; height: 13px; }
.skel-body { width: 100%; }
.skel.short { width: 55%; }
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px;
  color: rgba(255,255,255,0.35);
}
.empty-state p { font-size: 0.85rem; }
</style>