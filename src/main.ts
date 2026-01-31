import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./main.css";

const app = createApp(App);
const pinia = createPinia();

// Plugin para persistir el estado en localStorage
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
app.mount("#app");
