import WelcomePage from "@/pages/index.vue";
import type { Route } from "@/types/routesTypes";
import lifeProofRoutes from "./life-proof";
import profile from "./profile";
import usersRoutes from "./gestion/users";
import devicesRoutes from "./gestion/devices";
import authRoutes from "./auth";

const router: Route[] = [
  {
    path: "/",
    name: "welcome",
    component: WelcomePage,
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Home",
    },
  },
  ...lifeProofRoutes,
  ...usersRoutes,
  ...profile,
  ...devicesRoutes,
  ...authRoutes,
];

export default router;
