import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean;
    requiresAuth?: boolean;
    /** Si true, solo usuarios con rol `admin` (operador se redirige). */
    adminOnly?: boolean;
  }
}

export {};
