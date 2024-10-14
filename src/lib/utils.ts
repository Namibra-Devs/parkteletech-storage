import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRATION_KEY, USER_KEY } from "@/constants";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export const checkAndRemoveExpiredTokens = () => {
   const expirationTime = localStorage.getItem(TOKEN_EXPIRATION_KEY);
   if (expirationTime && new Date().getTime() > parseInt(expirationTime, 10)) {
     localStorage.removeItem(ACCESS_TOKEN_KEY);
     localStorage.removeItem(REFRESH_TOKEN_KEY);
     localStorage.removeItem(TOKEN_EXPIRATION_KEY);
     localStorage.removeItem(USER_KEY);
   }
 };