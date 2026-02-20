import LoginAdminView from "../views/LoginAdminView.vue";
import DashboardAdminView from "../views/DashboardView.vue";
import RequestAdminView from "../views/request/RequestAdminView.vue";
import MassesAdminView from "../views/MassesView.vue";

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
];

export default routes;



