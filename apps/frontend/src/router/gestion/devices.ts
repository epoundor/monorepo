import AttributeDevicePage from "@/pages/devices/attribute.vue";
import AddDevicePage from "@/pages/devices/add.vue";
import DevicesPage from "@/pages/devices/index.vue";
import DevicesDetailsPage from "@/pages/devices/details.vue";
import type { Route } from "@/types/routesTypes";

const structure: Route[] = [
  {
    path: "/devices",
    name: "devices.index",
    component: DevicesPage,
    children: [
      {
        path: "/devices/add",
        name: "devices.add",
        component: AddDevicePage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Ajouter un device",
        },
      },
      {
        path: "/devices/:id/attribute",
        name: "devices.attribute",
        component: AttributeDevicePage,
        meta: {
          layout: "dashboard",
          authless: true,
          title: "Attribuer un device",
        },
      },
    ],
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Devices",
    },
  },
  {
    path: "/devices/:id",
    name: "devices.details",
    component: DevicesDetailsPage,
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Information du device",
    },
  },
];

export default structure;
