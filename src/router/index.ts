import { createRouter, createWebHistory } from "vue-router";
import requestRoutes from "../modules/request/router/index";
import adminRoutes from "../modules/admin/router/index";

const routes = [...requestRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
