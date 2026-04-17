export async function fetchCurrentClientIp() {
  const fallbackIp = "local";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch("/api/client-ip", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      return fallbackIp;
    }

    const payload = (await response.json()) as { ip?: string };
    return payload.ip?.trim() || fallbackIp;
  } catch {
    return fallbackIp;
  } finally {
    clearTimeout(timeout);
  }
}
