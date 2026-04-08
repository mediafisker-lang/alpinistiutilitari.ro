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

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    return normalizeBaseUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  if (process.env.VERCEL_URL?.trim()) {
    return normalizeBaseUrl(`https://${process.env.VERCEL_URL}`);
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://alpinistiutilitari.ro";
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
