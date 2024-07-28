import { navItems } from "@/constants";

// Custom hook to find the matched path
export const useMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + "/") && item.href !== "/"
    );
  return matchedPath?.title || "";
};
