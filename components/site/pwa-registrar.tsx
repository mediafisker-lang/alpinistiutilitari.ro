"use client";

import { useEffect } from "react";

export function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Site-ul continuă să funcționeze normal dacă browserul refuză înregistrarea.
      });
    };
    const installDelay = (
      window as typeof window & {
        __PWA_INSTALL_DELAY__?: {
          isMobile: boolean;
          readyAt: number;
          delayMs: number;
        };
      }
    ).__PWA_INSTALL_DELAY__;
    const remainingDelay =
      installDelay?.isMobile === true
        ? Math.max(0, installDelay.readyAt - Date.now())
        : 0;

    if (remainingDelay === 0) {
      registerServiceWorker();
      return;
    }

    const timer = window.setTimeout(registerServiceWorker, remainingDelay);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
