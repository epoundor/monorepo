import WelcomePage from "@/pages/index.vue";
import type { Route } from "@/types/routesTypes";

const agents: Route[] = [
  {
    path: "/login",
    name: "login",
    component: WelcomePage,
    meta: {
      layout: "auth",
      authless: true,
      title: "Login",
    },
  },
];

export default agents;
