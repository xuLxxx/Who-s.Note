import type { Menu } from "@/api/system/menu";

export type UserInfo = {
  username?: string;
  password?: string;
  token?: string;
  role?: string;
  exp?: number;
  iat?: number;
  id: number | null;
};

export type Setting = {
  menu: Menu[];
  collapse: boolean;
  theme: "light" | "dark";
};
