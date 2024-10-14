import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Trash",
    href: "/trash",
    icon: "trash",
    label: "Trash",
  },
];

export const TOKEN_EXPIRATION_KEY = "tokenExpirationTime";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";