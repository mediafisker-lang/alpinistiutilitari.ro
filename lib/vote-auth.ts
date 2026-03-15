export type VoteAuthSession = {
  email: string;
  password: string;
};

const storageKey = "vote-auth-session";
const changeEvent = "vote-auth-changed";

export function readVoteAuth(): VoteAuthSession | null {
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
    };
  } catch {
    return null;
  }
}

export function writeVoteAuth(session: VoteAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
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
