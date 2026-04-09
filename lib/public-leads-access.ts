import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const PUBLIC_LEADS_COOKIE = "au_public_leads";
const PUBLIC_LEADS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const DEFAULT_PUBLIC_LEADS_PASSWORD = "Romania1!";
const DEFAULT_PUBLIC_LEADS_SECRET = "alpinistiutilitari-public-leads-secret";

function getPublicLeadsPassword() {
  return process.env.PUBLIC_LEADS_PASSWORD?.trim() || DEFAULT_PUBLIC_LEADS_PASSWORD;
}

function getPublicLeadsSecret() {
  return process.env.PUBLIC_LEADS_COOKIE_SECRET?.trim() || DEFAULT_PUBLIC_LEADS_SECRET;
}

function hashWithSecret(value: string) {
  return createHash("sha256")
    .update(`${value}:${getPublicLeadsSecret()}`)
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getExpectedCookieValue() {
  return hashWithSecret(getPublicLeadsPassword());
}

export function isPublicLeadsPasswordValid(password: string) {
  const hashedPassword = hashWithSecret(password);
  return safeEqual(hashedPassword, getExpectedCookieValue());
}

export async function hasPublicLeadsAccess() {
  const cookieStore = await cookies();
  const currentValue = cookieStore.get(PUBLIC_LEADS_COOKIE)?.value;

  if (!currentValue) {
    return false;
  }

  return safeEqual(currentValue, getExpectedCookieValue());
}

export async function grantPublicLeadsAccess() {
  const cookieStore = await cookies();

  cookieStore.set(PUBLIC_LEADS_COOKIE, getExpectedCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PUBLIC_LEADS_COOKIE_MAX_AGE,
  });
}

export async function revokePublicLeadsAccess() {
  const cookieStore = await cookies();
  cookieStore.delete(PUBLIC_LEADS_COOKIE);
}

