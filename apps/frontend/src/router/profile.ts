import ProfilePage from "@/pages/profile/index.vue";
import ProfileNamePage from "@/pages/profile/name.vue";
import ProfilePasswordPage from "@/pages/profile/password.vue";
import ProfileEmailPage from "@/pages/profile/email.vue";
import type { Route } from "@/types/routesTypes";

const profile: Route[] = [
  {
    path: "/profile",
    name: "profile.index",
    component: ProfilePage,
    children: [
      {
        path: "/profile/name",
        name: "profile.name",
        component: ProfileNamePage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Modifier mon nom",
        },
      },
      {
        path: "/profile/email",
        name: "profile.email",
        component: ProfileEmailPage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Modifier mon email",
        },
      },
      {
        path: "/profile/password",
        name: "profile.password",
        component: ProfilePasswordPage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Modifier mon mot de passe",
        },
      },
    ],
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Mon Profil",
    },
  },
];

export default profile;
