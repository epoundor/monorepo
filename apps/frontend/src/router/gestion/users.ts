import AddUserPage from "@/pages/users/add.vue";
import UpdateStatusUserPage from "@/pages/users/update-status.vue";
import UserPage from "@/pages/users/index.vue";
import type { Route } from "@/types/routesTypes";

const users: Route[] = [
  {
    path: "/users",
    name: "users.index",
    component: UserPage,
    children: [
      {
        path: "/users/add",
        name: "users.add",
        component: AddUserPage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Ajouter un utilisateur",
        },
      },
      {
        path: "/users/:id/update-status",
        name: "users.update.status",
        component: UpdateStatusUserPage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Activer un utilisateur",
        },
      },
    ],
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Utilisateurs",
    },
  },
];

export default users;
