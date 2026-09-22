import type React from "react";
import { NAV } from "./data";
import type { PagePath } from "./types";

export function getPagePath(value: string): PagePath {
  const normalized = value.replace(/\/$/, "") || "/";
  return normalized === "/payment-success" || normalized === "/payment-cancelled" || NAV.some((item) => item.path === normalized) ? normalized as PagePath : "/";
}

export function handleRouteClick(e: React.MouseEvent<HTMLAnchorElement>, path: PagePath, onNavigate: (path: PagePath) => void) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  onNavigate(path);
}
