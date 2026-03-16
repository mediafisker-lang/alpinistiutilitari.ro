"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import {
  clearVoteAuth,
  readVoteAuth,
  subscribeVoteAuth,
  writeVoteAuth,
} from "@/lib/vote-auth";

type LoginState = {
  email: string;
  password: string;
  message: string;
  error: string;
};

const initialLoginState: LoginState = {
  email: "",
  password: "",
  message: "",
  error: "",
};

function AccountMenu({
  mobile = false,
  loggedInEmail,
  currentIp,
}: {
  mobile?: boolean;
  loggedInEmail: string;
  currentIp: string;
}) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [state, setState] = useState<LoginState>(initialLoginState);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  async function handleLogin() {
    setState((current) => ({ ...current, error: "", message: "" }));

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        password: state.password,
      }),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      email?: string;
      message?: string;
    };

    if (payload.success && payload.email) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      writeVoteAuth({
        email: payload.email,
        password: state.password,
      }, ipToUse);
      setState(initialLoginState);
      setShowLoginForm(false);
      if (detailsRef.current) {
        detailsRef.current.open = false;
      }
      return;
    }

    setState((current) => ({
      ...current,
      message: "",
      error: payload.message ?? "Nu am putut face autentificarea.",
    }));
    setShowLoginForm(true);
  }

  return (
    <details ref={detailsRef} className={mobile ? "w-full" : "relative"}>
      <summary
        className={
          mobile
            ? "flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
            : "flex cursor-pointer list-none items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
        }
      >
        Contul meu
        <ChevronDown className="size-4" />
      </summary>
      <div
        className={
          mobile
            ? "mt-3 grid gap-3"
            : "absolute right-0 top-[calc(100%+0.65rem)] z-30 min-w-[20rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/10"
        }
      >
        <div className="grid gap-3">
          {mobile && loggedInEmail ? (
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-medium text-[#005eb8]">
              Logat cu {loggedInEmail}
            </div>
          ) : null}

          {!loggedInEmail ? (
            <button
              type="button"
              onClick={() => setShowLoginForm((current) => !current)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                clearVoteAuth();
                setState(initialLoginState);
                setShowLoginForm(false);
                if (detailsRef.current) {
                  detailsRef.current.open = false;
                }
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Logout
            </button>
          )}

          {showLoginForm ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3">
                <Input
                  type="email"
                  value={state.email}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Email"
                />
                <Input
                  type="password"
                  value={state.password}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Parola"
                />
                <button
                  type="button"
                  onClick={handleLogin}
                  className="rounded-xl bg-[#005eb8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004799]"
                >
                  Intra in cont
                </button>
              </div>
            </div>
          ) : null}

          {state.error ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p>
          ) : null}
          {state.message ? (
            <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-[#005eb8]">{state.message}</p>
          ) : null}

          <Link
            href="/#inscriere"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            Inscriere
          </Link>
        </div>
      </div>
    </details>
  );
}

export function SiteHeader() {
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [currentIp, setCurrentIp] = useState("");
  const [loginState, setLoginState] = useState<LoginState>(initialLoginState);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void fetchCurrentClientIp().then((ip) => {
      if (!isMounted) {
        return;
      }

      setCurrentIp(ip);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncSession = () => {
      const session = readVoteAuth(currentIp);
      setLoggedInEmail(session?.email ?? "");
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, [currentIp]);

  function handleLogout() {
    clearVoteAuth();
  }

  async function handleDesktopLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginState((current) => ({ ...current, error: "", message: "" }));

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginState.email,
        password: loginState.password,
      }),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      email?: string;
      message?: string;
    };

    if (payload.success && payload.email) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      if (ipToUse && ipToUse !== currentIp) {
        setCurrentIp(ipToUse);
      }

      writeVoteAuth(
        {
          email: payload.email,
          password: loginState.password,
        },
        ipToUse,
      );
      setLoginState(initialLoginState);
      setLoginLoading(false);
      return;
    }

    setLoginState((current) => ({
      ...current,
      message: "",
      error: payload.message ?? "Nu am putut face autentificarea.",
    }));
    setLoginLoading(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(90deg,#e31e24_0%,#005eb8_55%,#005eb8_100%)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-medium text-white sm:px-6 sm:text-xs">
          <p>Portal comunitate</p>
          <p className="hidden sm:block">Acces rapid la vot, sesizari si actualizari</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="min-w-0 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Image
                src="/logo.png"
                alt="Cortina North"
                width={196}
                height={64}
                className="h-10 w-auto object-contain sm:h-14"
                priority
              />
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                  Cortina North
                </p>
                <p className="hidden text-xs text-slate-500 sm:block">Informatii si schimbari in comunitate</p>
              </div>
            </div>
          </Link>

          <details className="group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" />
            </summary>
            <div className="absolute inset-x-3 top-[calc(100%-0.2rem)] rounded-[1.75rem] border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-950/12 backdrop-blur sm:inset-x-4">
              <nav className="grid gap-2">
                <Link
                  href="/#stadiu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Stadiu Asoc.
                </Link>
                <Link
                  href="/#beneficii"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Beneficii
                </Link>
                <Link
                  href="/#sesizari"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Sesizari
                </Link>
                <Link
                  href="/#voteaza"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Voteaza
                </Link>
                <AccountMenu mobile loggedInEmail={loggedInEmail} currentIp={currentIp} />
              </nav>
            </div>
          </details>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/#stadiu"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Stadiu Asoc.
            </Link>
            <Link
              href="/#beneficii"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Beneficii
            </Link>
            <Link
              href="/#sesizari"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sesizari
            </Link>
            <Link
              href="/#voteaza"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voteaza
            </Link>
            {loggedInEmail ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#005eb8] transition hover:bg-blue-100"
                title="Logout"
              >
                {loggedInEmail}
              </button>
            ) : (
              <>
                <form onSubmit={handleDesktopLogin} className="flex items-center gap-2">
                  <Button type="submit" size="sm" disabled={loginLoading}>
                    {loginLoading ? "Se verifica..." : "Login"}
                  </Button>
                  <Input
                    type="email"
                    value={loginState.email}
                    onChange={(event) =>
                      setLoginState((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="User"
                    className="h-9 w-28 px-3 text-sm"
                  />
                  <Input
                    type="password"
                    value={loginState.password}
                    onChange={(event) =>
                      setLoginState((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Parola"
                    className="h-9 w-24 px-3 text-sm"
                  />
                  <Link
                    href="/#inscriere"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Inscriere
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
        {!loggedInEmail && loginState.error ? (
          <p className="mt-3 hidden rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 lg:block">
            {loginState.error}
          </p>
        ) : null}
      </div>
    </header>
  );
}
