import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CANONICAL_SITE_URL = "https://alpinistiutilitari.ro";

export function getSiteUrl() {
  return CANONICAL_SITE_URL;
}

export function absoluteUrl(path = "") {
  const base = getSiteUrl();
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${base}${normalizedPath}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
