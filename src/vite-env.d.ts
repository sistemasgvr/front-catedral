/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública del portal web (sin barra final recomendada). Ej: https://catedral.ejemplo.com */
  readonly VITE_PUBLIC_WEB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
