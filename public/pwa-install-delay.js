(() => {
  const MOBILE_INSTALL_DELAY_MS = 9 * 60 * 1000;
  const SESSION_START_KEY = "alpinisti-pwa-mobile-visit-started-at";
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (!isMobile) {
    window.__PWA_INSTALL_DELAY__ = {
      isMobile: false,
      readyAt: Date.now(),
      delayMs: 0,
    };
    return;
  }

  let startedAt = Date.now();

  try {
    const storedStartedAt = Number(window.sessionStorage.getItem(SESSION_START_KEY));

    if (Number.isFinite(storedStartedAt) && storedStartedAt > 0) {
      startedAt = storedStartedAt;
    } else {
      window.sessionStorage.setItem(SESSION_START_KEY, String(startedAt));
    }
  } catch {
    // Dacă stocarea este blocată, temporizarea rămâne valabilă pentru pagina curentă.
  }

  const readyAt = startedAt + MOBILE_INSTALL_DELAY_MS;

  window.__PWA_INSTALL_DELAY__ = {
    isMobile: true,
    readyAt,
    delayMs: MOBILE_INSTALL_DELAY_MS,
  };

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      if (Date.now() < readyAt) {
        event.preventDefault();
      }
    },
    { capture: true },
  );
})();
