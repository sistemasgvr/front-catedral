import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import router from "./router";

import "./main.css";

const app = createApp(App);
const pinia = createPinia();

// Persistencia Pinia
pinia.use(({ store }) => {
  const storedState = localStorage.getItem(store.$id);
  if (storedState) {
    store.$patch(JSON.parse(storedState));
  }
  store.$subscribe((_, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
});

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.mount("#app");