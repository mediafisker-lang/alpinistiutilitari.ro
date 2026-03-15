"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
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
}: {
  mobile?: boolean;
  loggedInEmail: string;
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
      writeVoteAuth({
        email: payload.email,
        password: state.password,
      });
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
    <details ref={detailsRef} className={mobile ? "col-span-2" : "relative"}>
      <summary
        className={
          mobile
            ? "flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
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

  useEffect(() => {
    const syncSession = () => {
      const session = readVoteAuth();
      setLoggedInEmail(session?.email ?? "");
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, []);

  function handleLogout() {
    clearVoteAuth();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(90deg,#e31e24_0%,#005eb8_55%,#005eb8_100%)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs font-medium text-white sm:px-6">
          <p>Portal comunitate</p>
          <p>Acces rapid la vot, sesizari si actualizari</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0 shrink-0">
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Cortina North"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight text-slate-950">
                  Cortina North
                </p>
                <p className="text-xs text-slate-500">Informatii si schimbari in comunitate</p>
              </div>
            </div>
          </Link>

          <div className="hidden flex-1 lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                readOnly
                value="Cauta voturi, sesizari, actualizari..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>

          <details className="group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" />
            </summary>
            <div className="absolute inset-x-4 top-[calc(100%-0.25rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
              <nav className="grid grid-cols-2 gap-3">
                <Link
                  href="/#stadiu"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Stadiu Asoc.
                </Link>
                <Link
                  href="/#beneficii"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Beneficii
                </Link>
                <Link
                  href="/#sesizari"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Sesizari
                </Link>
                <Link
                  href="/#voteaza"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                >
                  Voteaza
                </Link>
                <AccountMenu mobile loggedInEmail={loggedInEmail} />
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
            <AccountMenu loggedInEmail={loggedInEmail} />
            {loggedInEmail ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#005eb8] transition hover:bg-blue-100"
                title="Logout"
              >
                {loggedInEmail}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
