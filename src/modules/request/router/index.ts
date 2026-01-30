import RequestView from "../views/RequestView.vue";
import DebugMisasView from "../views/DebugMisasView.vue";
const routes = [
  {
    path: "/",
    name: "Inicio",
    component: RequestView,
    props: { step: 0 },
  },
  {
    path: "/datos-solicitante",
    name: "DatosSolicitante",
    component: RequestView,
    props: { step: 1 },
  },
  {
    path: "/datos-celebracion",
    name: "DatosCelebracion",
    component: RequestView,
    props: { step: 2 },
  },
  {
    path: "/menciones",
    name: "Menciones",
    component: RequestView,
    props: { step: 3 },
  },
  {
    path: "/pago",
    name: "Pago",
    component: RequestView,
    props: { step: 4 },
  },
  {
    path: "/resumen",
    name: "Resumen",
    component: RequestView,
    props: { step: 5 },
  },
  {
    path: "/debug-misas-menciones",
    name: "debug-misas-menciones",
    component: DebugMisasView,
  },
];

export default routes;
