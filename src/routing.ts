import { createContext, type MouseEvent } from "react";
import { NAV } from "./data";
import type { PagePath } from "./types";

export function getPagePath(value: string): PagePath {
  const normalized = value.replace(/\/$/, "") || "/";
  return normalized === "/payment-success" || normalized === "/payment-cancelled" || NAV.some((item) => item.path === normalized) ? normalized as PagePath : "/";
}

export function isPagePath(value: string): value is PagePath {
  return NAV.some((item) => item.path === value);
}

export function handleRouteClick(e: MouseEvent<HTMLAnchorElement>, path: PagePath, onNavigate: (path: PagePath) => void) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  onNavigate(path);
}

// Lets any component (e.g. CMS-driven buttons) navigate without prop drilling.
export const NavigateContext = createContext<(path: PagePath) => void>((path) => window.location.assign(path));
