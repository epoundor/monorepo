import type AppRoles from "@/constants/app.roles";

export interface MenuGroupItemType {
  iconName:
    | "dashboard"
    | "life-proof"
    | "device"
    | "users"
    | "app"
    | "contracts"
    | "security"
    | "notification";
  label: string;
  path: string;
  basePathName: string;
}

export interface Menu {
  groupLabel: string;
  groupItems: MenuGroupItemType[];
}

export enum BandColor {
  DEEPBLUE = "#2E5AAC",
  ORANGE = "#E07A2C",
  VIOLET = "#656ADC",
  GREEN = "#287D3C",
  RED = "#DA1414",
}

export interface GpsCoords {
  lat: number;
  lng: number;
}

export interface InformationPiece {
  label: string;
  content?: string;
  type?: "Text" | "Url" | "Button";
  link?: string;
  onClick?: () => void;
}

export interface ActionItem {
  icon: object;
  label: string;
  onClick: () => void;
}

export type PaginationParams = {
  page: number;
  perPage: number;
};

export type PaginatedData<T> = {
  data: T[];
  count: number;
};

export interface PaginationChangePayload {
  start: number;
  end: number;
  page: number;
  perPage: number;
  total: number;
}
