import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import KeyFilter from "primevue/keyfilter";
import App from "./App.vue";
import router from "./router";
import "primeicons/primeicons.css";
import "./main.css";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.directive("keyfilter", KeyFilter);
app.use(router);
app.mount("#app");
