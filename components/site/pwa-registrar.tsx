"use client";

import { useEffect } from "react";

export function PwaRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Site-ul continuă să funcționeze normal dacă browserul refuză înregistrarea.
      });
    }
  }, []);

  return null;
}
