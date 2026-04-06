export async function fetchCurrentClientIp() {
  try {
    const response = await fetch("/api/client-ip", { cache: "no-store" });
    if (!response.ok) {
      return "";
    }

    const payload = (await response.json()) as { ip?: string };
    return payload.ip?.trim() ?? "";
  } catch {
    return "";
  }
}
