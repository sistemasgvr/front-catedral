import HomeRequestView from "../views/HomeRequestView.vue";
import RequestView from "../views/RequestView.vue";
import ConsultRequestView from "../views/ConsultRequestView.vue";
import MentionsRequestView from "../views/MentionsRequestView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeRequestView,
  },
  {
    path: "/nueva-solicitud",
    name: "NuevaSolicitud",
    component: RequestView,
  },
  {
    path: "/consultar",
    name: "Consultar",
    component: ConsultRequestView,
  },
  {
    path: "/menciones",
    name: "Menciones",
    component: MentionsRequestView,
  },
];

export default routes;
