export type VoteAuthSession = {
  email: string;
  password: string;
  lastIp?: string | null;
};

const storageKey = "vote-auth-session";
const changeEvent = "vote-auth-changed";

function normalizeIp(ip?: string | null) {
  return ip?.trim().toLowerCase() ?? "";
}

function readStoredVoteAuth(): VoteAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<VoteAuthSession>;
    if (!parsed.email || !parsed.password) {
      return null;
    }

    return {
      email: parsed.email,
      password: parsed.password,
      lastIp: typeof parsed.lastIp === "string" ? parsed.lastIp : null,
    };
  } catch {
    return null;
  }
}

export function readVoteAuth(currentIp?: string | null): VoteAuthSession | null {
  const session = readStoredVoteAuth();
  if (!session) {
    return null;
  }

  const normalizedCurrentIp = normalizeIp(currentIp);
  const normalizedSavedIp = normalizeIp(session.lastIp);

  if (!normalizedCurrentIp || !normalizedSavedIp || normalizedCurrentIp !== normalizedSavedIp) {
    return null;
  }

  return session;
}

export function writeVoteAuth(session: VoteAuthSession, currentIp?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...session,
      lastIp: normalizeIp(currentIp) || normalizeIp(session.lastIp) || null,
    }),
  );
  window.dispatchEvent(new Event(changeEvent));
}

export function clearVoteAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeVoteAuth(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", listener);
  };
}
