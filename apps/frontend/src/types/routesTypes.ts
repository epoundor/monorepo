import type { Component } from "vue";
import type AppRoles from "@/constants/app.roles";

export type Meta = {
  layout: "auth" | "dashboard";
  title: string;
  authless: boolean;
};

export interface Route {
  name: string;
  path: string;
  children?: Route[];
  component: Component;
  meta: Meta;
}
