import { createRouter, createWebHistory } from "vue-router";
// import useNotifier from "@/plugins/notifier";
import routes from "./routes";
import useAuthStore from "@/stores/auth";
import type { Meta } from "@/types/routesTypes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const meta = to.meta as Meta;

  const authStore = useAuthStore();
  document.title = meta.title || "Semo";

  // if (to.meta && to.meta.authless) {
  //   return next();
  // }

  const requiresAuth = !to.meta.authless;

  // if (requiresAuth && !authStore.authenticated) {
  //   return next("/login");
  // }

  if (!requiresAuth && authStore.authenticated) {
    return next({
      path: "/",
    });
  }

  return next();
});
export default router;
