import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import Application from "@/components/App.vue";

import { registerRequestInterceptor, registerResponseInterceptor } from "./api";

import { VDataTable, VModal, VConfirm } from "@preuve-de-vie/ui/Molecules";
import {
  VButton,
  VLabel,
  VPagination,
  BaseInput,
} from "@preuve-de-vie/ui/Atoms";
import Icon from "./components/Icon.vue";

// import "./assets/tailwind";
// import "./assets/fonts/index.css";
import type { AxiosRequestConfig } from "axios";

registerRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
  // console.warn("Vous êtes branché sur Fake Api");
  // // console.log(config.url, "url");

  // config.baseURL = "/mocks";
  // config.url =
  //   config.method?.toLowerCase() + "/" + config.url?.trim().slice(1) + ".json";
  return config;
});
const app = createApp(App);
// ---------- Plugins -------------
app.use(createPinia());
app.use(router);
// ----------- Global Component ------------
app.component("App", Application);
app.component("Icon", Icon);
app.component("VDataTable", VDataTable);
app.component("VPagination", VPagination);
app.component("BaseInput", BaseInput);
app.component("VModal", VModal);
app.component("VConfirm", VConfirm);
app.component("VButton", VButton);
app.component("VLabel", VLabel);
// ----------- Global Properties ------------
app.mount("#app");
