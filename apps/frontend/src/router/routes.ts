const router = [
  {
    path: "/",
    name: "welcome",
    component: "Yo mon reuf",
    meta: {
      layout: "dashboard",
      authless: true,
      title: "Home",
    },
  },
];

export default router;
