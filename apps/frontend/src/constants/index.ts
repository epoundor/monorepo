import type { ProofStatusEnum } from "@/types/entities/proof";
import type { UserRole } from "@/types/entities/user";
import type { Menu } from "@/types/globalType";

const ALL_MENU: Menu[] = [
  {
    groupLabel: "Gestion",
    groupItems: [
      {
        iconName: "device",
        label: "Devices",
        path: "/devices",
        basePathName: "/devices",
      },
      {
        iconName: "users",
        label: "Utilisateurs",
        path: "/users",
        basePathName: "/users",
      },
    ],
  },
];

export function getMenuByUserRole(): Menu[] {
  // export function getMenuByUserRole(): Menu[] {
  // const menus: Menu[] = [
  //   {
  //     groupLabel: "Administration",
  //     groupItems: [],
  //   },
  //   {
  //     groupLabel: "Administration",
  //     groupItems: [],
  //   },
  // ];

  // ALL_MENU.forEach((item) => {
  // //   menus.find((el) => {
  //     return el.groupLabel === "Administration";
  //   }).groupItems = item.groupItems.filter((el) => {
  //     return el.roles.includes(role);
  //   });

  //   //   items=[]
  //   ALL_MENU.find((el) => {
  //     return el.groupLabel === "Administration";
  //   }).groupItems = item.groupItems.filter((el) => {
  //     return el.roles.includes(role);
  //   });
  // });
  // return ALL_MENU[role];

  return ALL_MENU;
}

// export const ROUTES: RouteRecordRaw[] = [
//   {
//     path: "/home",
//     name: "Home",
//     meta: {
//       roles: AppRolesAppRoles.OM_INIATOR
//       basePathName: "/",
//     },
//     component: () => import("@/views/HomeView.vue"),
//   },
// ];

export const SEMO_TOKEN_KEY = "prodij.token";
export const SEMO_USER_ROLE_KEY = "prodij.userRole";

export const DEFAULT_UPLOADABLE_FILE = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "image/*",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const DEFAULT_MAX_FILE_UPLOAD_SIZE = 500;

export const DEFAULT_PER_PAGE = 20;

export const devicesState: Record<string, { text: string; color: string }> = {
  conforme: { text: "Conforme", color: "green" },
  non_conforme: { text: "Non Conforme", color: "red" },
};

export const proofState: Record<
  ProofStatusEnum | any,
  { text: string; color: string }
> = {
  VALID: { text: "Validé", color: "green" },
  INVALID: { text: "Invalidé", color: "red" },
  PENDING: { text: "En Attente", color: "orange" },
};

export const userRole: Record<UserRole | any, string> = {
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super Admin",
  AGENT: "Agent",
};
