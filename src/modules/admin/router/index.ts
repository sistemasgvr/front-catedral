import LoginAdminView from "../views/LoginAdminView.vue";
import DashboardAdminView from "../views/DashboardView.vue";
import RequestAdminView from "../views/request/RequestAdminView.vue";
import MassesAdminView from "../views/MassesView.vue";
import MassesTypeAdminView from "../views/MassTypesAdminView.vue";
import NewsAdminView from "../views/NewsAdminView.vue";
import ProfileAdminView from "../views/ProfileView.vue";
import SettingsAdminView from "../views/SettingsView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginAdminView,
    meta: { public: true } // ← ruta pública
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/solicitudes",
    name: "Solicitudes",
    component: RequestAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/misas",
    name: "Misas",
    component: MassesAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/tipos-misa",
    name: "TiposMisa",
    component: MassesTypeAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/noticias", 
    name: "Noticias", 
    component: NewsAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: ProfileAdminView,
    meta: { requiresAuth: true }
  },
  {
    path: "/configuracion",
    name: "Configuracion",
    component: SettingsAdminView,
    meta: { requiresAuth: true }
  }
];

export default routes;



