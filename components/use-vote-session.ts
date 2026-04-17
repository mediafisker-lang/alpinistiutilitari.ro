"use client";

import { useEffect, useState } from "react";

import { fetchCurrentClientIp } from "@/lib/client-ip";
import { readVoteAuth, subscribeVoteAuth, type VoteAuthSession } from "@/lib/vote-auth";

export function useVoteSession() {
  const [currentIp, setCurrentIp] = useState("local");
  const [session, setSession] = useState<VoteAuthSession | null>(null);

  useEffect(() => {
    let isMounted = true;

    void fetchCurrentClientIp().then((ip) => {
      if (!isMounted) {
        return;
      }

      setCurrentIp(ip || "local");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncSession = () => {
      setSession(readVoteAuth(currentIp));
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, [currentIp]);

  return {
    currentIp,
    session,
    isLoggedIn: Boolean(session?.email),
  };
}
