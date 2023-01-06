import LifeProofDetailsPage from "@/pages/lifeproof/details.vue";
import LifeProofPage from "@/pages/lifeproof/index.vue";
import type { Route } from "@/types/routesTypes";

const agents: Route[] = [
  {
    path: "/life-proof",
    name: "lifeproof.index",
    component: LifeProofPage,
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Missions",
    },
  },
  {
    path: "/life-proof/:id/details",
    name: "lifeproof.details",
    component: LifeProofDetailsPage,
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Détails de la preuve",
    },
  },
];

export default agents;
