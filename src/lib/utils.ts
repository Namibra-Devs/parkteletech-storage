import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRATION_KEY,
  USER_KEY,
} from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAndRemoveExpiredTokens = () => {
  const expirationTime = localStorage.getItem(TOKEN_EXPIRATION_KEY);
  if (expirationTime && new Date().getTime() > parseInt(expirationTime, 10)) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(USER_KEY);

    return true;
  }
  return;
};

interface DeviceInfo {
  deviceName: string;
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Browser detection
  const browserRegexes = {
    Chrome: /Chrome\/([0-9.]+)/,
    Firefox: /Firefox\/([0-9.]+)/,
    Safari: /Version\/([0-9.]+).*Safari/,
    Edge: /Edg\/([0-9.]+)/,
    Opera: /OPR\/([0-9.]+)/,
  };

  let browser = "Unknown";
  let browserVersion = "Unknown";

  for (const [browserName, regex] of Object.entries(browserRegexes)) {
    const match = userAgent.match(regex);
    if (match) {
      browser = browserName;
      browserVersion = match[1];
      break;
    }
  }

  // OS detection
  let os = "Unknown";
  let osVersion = "Unknown";

  if (userAgent.includes("Windows")) {
    os = "Windows";
    const versionMatch = userAgent.match(/Windows NT ([0-9.]+)/);
    osVersion = versionMatch ? versionMatch[1] : "Unknown";
  } else if (userAgent.includes("Mac")) {
    os = "macOS";
    const versionMatch = userAgent.match(/Mac OS X ([0-9._]+)/);
    osVersion = versionMatch ? versionMatch[1].replace(/_/g, ".") : "Unknown";
  } else if (userAgent.includes("iPhone")) {
    os = "iOS";
    const versionMatch = userAgent.match(/OS ([0-9_]+)/);
    osVersion = versionMatch ? versionMatch[1].replace(/_/g, ".") : "Unknown";
  } else if (userAgent.includes("Android")) {
    os = "Android";
    const versionMatch = userAgent.match(/Android ([0-9.]+)/);
    osVersion = versionMatch ? versionMatch[1] : "Unknown";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  }

  // Device type detection
  let deviceType = "Desktop";
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = "Mobile";
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = "Tablet";
  }

  // Device name detection
  let deviceName = platform;
  if (userAgent.includes("iPhone")) {
    const iPhoneMatch = userAgent.match(
      /iPhone(?:\s+(?:CPU )?(?:iPhone )?OS\s+(\d+))?/i
    );
    deviceName = iPhoneMatch ? `iPhone (iOS ${iPhoneMatch[1]})` : "iPhone";
  } else if (userAgent.includes("iPad")) {
    deviceName = "iPad";
  } else if (userAgent.includes("Android")) {
    const modelMatch = userAgent.match(/\((.+?)\)/);
    deviceName = modelMatch
      ? modelMatch[1].split(";")[1].trim()
      : "Android Device";
  }

  console.log("Device Info:", {
    deviceName,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
  });

  return {
    deviceName,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
  };
};
