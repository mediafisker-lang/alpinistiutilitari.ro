"use client";

import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import { clearVoteAuth, readVoteAuth, subscribeVoteAuth, writeVoteAuth } from "@/lib/vote-auth";

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

export function SiteHeader() {
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [currentIp, setCurrentIp] = useState("");
  const [loginState, setLoginState] = useState<LoginState>(initialLoginState);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginStateMobile, setLoginStateMobile] = useState<LoginState>(initialLoginState);
  const [loginLoadingMobile, setLoginLoadingMobile] = useState(false);
  const [dateTimeLabel, setDateTimeLabel] = useState("");

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

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updateLabel = () => {
      setDateTimeLabel(formatter.format(new Date()));
    };

    updateLabel();
    const timer = setInterval(updateLabel, 30_000);
    return () => clearInterval(timer);
  }, []);

  const loggedInName = loggedInEmail.includes("@")
    ? loggedInEmail.split("@")[0] || loggedInEmail
    : loggedInEmail;

  function handleLogout() {
    clearVoteAuth();
    setLoginState(initialLoginState);
    setLoginStateMobile(initialLoginState);
    setLoginLoading(false);
    setLoginLoadingMobile(false);
  }

  async function runLogin(
    email: string,
    password: string,
    setLoading: (loading: boolean) => void,
    setState: Dispatch<SetStateAction<LoginState>>,
  ) {
    setLoading(true);
    setState((current) => ({ ...current, error: "", message: "" }));

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
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
          password,
        },
        ipToUse,
      );
      setState(initialLoginState);
      setLoading(false);
      return;
    }

    setState((current) => ({
      ...current,
      message: "",
      error: payload.message ?? "Nu am putut face autentificarea.",
    }));
    setLoading(false);
  }

  async function handleDesktopLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runLogin(loginState.email, loginState.password, setLoginLoading, setLoginState);
  }

  async function handleMobileLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runLogin(
      loginStateMobile.email,
      loginStateMobile.password,
      setLoginLoadingMobile,
      setLoginStateMobile,
    );
  }

  return (
    <header
      id="portal-login"
      className="sticky top-0 z-20 border-b border-amber-200/80 bg-[rgba(255,247,225,0.74)] shadow-[0_8px_24px_rgba(56,41,10,0.16)] backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-3 py-1.5 sm:px-6 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Image
                src="/logo.png"
                alt="Cortina North"
                width={320}
                height={104}
                className="h-12 w-auto object-contain sm:h-14"
                priority
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[13px] font-extrabold tracking-tight text-slate-950 sm:text-base">
                    Cortina North
                  </p>
                  <span className="hidden rounded-full border border-amber-400/70 bg-amber-100/85 px-1.5 py-0.5 text-[9px] font-bold text-amber-950 sm:inline-flex sm:text-[10px]">
                    Portal comunitate
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 sm:hidden">Comunitate</p>
                <p className="hidden text-[11px] font-semibold text-slate-700 xl:block">
                  Acces rapid la vot, sesizari si actualizari
                </p>
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-1.5 lg:flex">
            <Link
              href="/stadiu-asociatie"
              className="inline-flex h-8 items-center rounded-md border border-amber-400/80 bg-amber-100/70 px-2.5 text-[12px] font-extrabold tracking-[0.01em] text-slate-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-200/80"
            >
              Asociatie
            </Link>
            <Link
              href="/sesizari"
              className="inline-flex h-8 items-center rounded-md border border-amber-400/80 bg-amber-100/70 px-2.5 text-[12px] font-extrabold tracking-[0.01em] text-slate-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-200/80"
            >
              Sesizari / Istoric
            </Link>
            <Link
              href="/voteaza"
              className="inline-flex h-8 items-center rounded-md border border-amber-400/80 bg-amber-100/70 px-2.5 text-[12px] font-extrabold tracking-[0.01em] text-slate-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-200/80"
            >
              Voteaza propuneri
            </Link>
            <Link
              href="/#comunitate"
              className="inline-flex h-8 items-center rounded-md border border-amber-400/80 bg-amber-100/70 px-2.5 text-[12px] font-extrabold tracking-[0.01em] text-slate-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-200/80"
            >
              Comunitate
            </Link>
            {loggedInEmail ? (
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-amber-300/90 bg-amber-100/70 px-2.5 py-1.5">
                <p className="whitespace-nowrap text-[11px] leading-4 font-semibold text-slate-700">
                  Data si ora {dateTimeLabel || "--"}
                </p>
                <p className="min-w-0 truncate text-sm font-semibold text-slate-900">Hello, {loggedInName}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-amber-400/70 bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-800 transition hover:bg-amber-100/90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleDesktopLogin}
                className="flex items-center gap-1 rounded-md border border-amber-300/90 bg-amber-100/60 px-1.5 py-1"
              >
                <Input
                  type="email"
                  value={loginState.email}
                  onChange={(event) =>
                    setLoginState((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="USER"
                  className="h-7 w-20 rounded-md px-2 text-[11px]"
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
                  placeholder="PASSWORD"
                  className="h-7 w-20 rounded-md px-2 text-[11px]"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loginLoading}
                  className="h-7 border border-amber-500 bg-amber-500 px-2 text-[11px] font-extrabold text-slate-950 hover:bg-amber-400"
                >
                  {loginLoading ? "Se verifica..." : "Login"}
                </Button>
                <Link
                  href="/inregistrare"
                  className="inline-flex h-7 items-center rounded-md border border-amber-500 bg-amber-500 px-2 text-[11px] font-extrabold text-slate-950 transition hover:bg-amber-400"
                >
                  Inregistreaza-te
                </Link>
              </form>
            )}
          </div>
        </div>

        <div className="mt-1.5 lg:hidden">
          {loggedInEmail ? (
            <div
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 rounded-xl border border-amber-300/90 bg-amber-100/75 px-2 py-1"
              style={{ fontFamily: "\"Trebuchet MS\", Verdana, Arial, sans-serif" }}
            >
              <p className="whitespace-nowrap text-[10px] font-semibold text-slate-700">
                Data si ora {dateTimeLabel || "--"}
              </p>
              <p className="min-w-0 truncate text-xs font-semibold text-slate-900">Hello, {loggedInName}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-amber-400/70 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800 transition hover:bg-amber-100/90"
              >
                Logout
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleMobileLogin}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] items-center gap-1"
              style={{ fontFamily: "\"Trebuchet MS\", Verdana, Arial, sans-serif" }}
            >
              <Input
                type="email"
                value={loginStateMobile.email}
                onChange={(event) =>
                  setLoginStateMobile((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="USER"
                className="h-7 min-w-0 rounded-lg px-2 text-[12px] font-semibold"
              />
              <Input
                type="password"
                value={loginStateMobile.password}
                onChange={(event) =>
                  setLoginStateMobile((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="PASSWORD"
                className="h-7 min-w-0 rounded-lg px-2 text-[12px] font-semibold"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loginLoadingMobile}
                className="h-7 rounded-lg border border-amber-500 bg-amber-400 px-2 text-[12px] font-bold text-slate-950 hover:bg-amber-300"
              >
                {loginLoadingMobile ? "Se verifica..." : "Login"}
              </Button>
              <Link
                href="/inregistrare"
                className="flex h-7 items-center justify-center whitespace-nowrap rounded-lg border border-amber-500 bg-amber-100/90 px-2 text-[11px] font-bold text-slate-900 transition hover:bg-amber-200"
              >
                Inregistreaza-te
              </Link>
            </form>
          )}
        </div>

        <div className="mt-1.5 border-t border-amber-300/60 pt-1.5 lg:hidden">
          <nav
            className="grid grid-cols-2 gap-1.5"
            style={{ fontFamily: "\"Trebuchet MS\", Verdana, Arial, sans-serif" }}
          >
            <Link
              href="/stadiu-asociatie"
              className="rounded-lg border border-amber-500/95 bg-amber-300/90 px-2 py-1.5 text-center text-[13px] font-bold leading-none tracking-normal text-slate-950 shadow-sm transition hover:bg-amber-200"
            >
              Asociatie
            </Link>
            <Link
              href="/#comunitate"
              className="rounded-lg border border-amber-500/95 bg-amber-300/90 px-2 py-1.5 text-center text-[13px] font-bold leading-none tracking-normal text-slate-950 shadow-sm transition hover:bg-amber-200"
            >
              Comunitate
            </Link>
            <Link
              href="/sesizari"
              className="rounded-lg border border-amber-500/95 bg-amber-300/90 px-2 py-1.5 text-center text-[13px] font-bold leading-none tracking-normal text-slate-950 shadow-sm transition hover:bg-amber-200"
            >
              Sesizari / Istoric
            </Link>
            <Link
              href="/voteaza"
              className="rounded-lg border border-amber-500/95 bg-amber-300/90 px-2 py-1.5 text-center text-[13px] font-bold leading-none tracking-normal text-slate-950 shadow-sm transition hover:bg-amber-200"
            >
              Voteaza propuneri
            </Link>
          </nav>
        </div>

        {!loggedInEmail && loginState.error ? (
          <p className="mt-3 hidden rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 lg:block">
            {loginState.error}
          </p>
        ) : null}
        {!loggedInEmail && loginStateMobile.error ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 lg:hidden">
            {loginStateMobile.error}
          </p>
        ) : null}
      </div>
    </header>
  );
}
