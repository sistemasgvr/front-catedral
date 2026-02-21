import LoginAdminView from "../views/LoginAdminView.vue";
import DashboardAdminView from "../views/DashboardView.vue";
import RequestAdminView from "../views/request/RequestAdminView.vue";
import MassesAdminView from "../views/MassesView.vue";
import MassesTypeAdminView from "../views/MassTypesAdminView.vue";
import NewsAdminView from "../views/NewsAdminView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginAdminView
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardAdminView
  },
  {
    path: "/solicitudes",
    name: "Solicitudes",
    component: RequestAdminView
  },
  {
    path: "/misas",
    name: "Misas",
    component: MassesAdminView
  },
  {
    path: "/tipos-misa",
    name: "TiposMisa",
    component: MassesTypeAdminView
  },
  {
    path: "/noticias", 
    name: "Noticias", 
    component: NewsAdminView
  }
];

export default routes;



