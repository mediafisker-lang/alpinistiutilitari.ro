const adminSessionCookieName = "admin_session";
const adminPassword = "Romania1!";

export function getAdminSessionCookieName() {
  return adminSessionCookieName;
}

export function areAdminCredentialsValid(password: string) {
  return password === adminPassword;
}

export function createAdminSessionToken() {
  return adminPassword;
}

export function isAdminSessionTokenValid(token: string) {
  return Boolean(token && token === createAdminSessionToken());
}

export function getAdminCookieValueFromHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return "";
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminSessionCookieName}=`));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

export function isAdminAuthorizedRequest(request: Request) {
  const token = getAdminCookieValueFromHeader(request.headers.get("cookie"));
  return isAdminSessionTokenValid(token);
}
