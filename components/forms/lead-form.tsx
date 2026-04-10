"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: LeadFormState = {};

type Option = {
  id?: string;
  label: string;
};

type LeadFormProps = {
  companyId?: string;
  selectableCompanies?: Option[];
  selectedCompanyIds?: string[];
  serviceId?: string;
  countyId?: string;
  countyName?: string;
  cityId?: string;
  cityName?: string;
  sourcePage: string;
  services?: Option[];
  counties?: Option[];
  variant?: "default" | "compact";
};

export function LeadForm({
  companyId,
  selectableCompanies = [],
  selectedCompanyIds = [],
  serviceId,
  countyId,
  countyName,
  cityId,
  cityName,
  sourcePage,
  services = [],
  counties = [],
  variant = "default",
}: LeadFormProps) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state.redirectTo, state.success]);

  const defaultServiceText = useMemo(() => {
    return services.find((item) => item.id === serviceId)?.label ?? "";
  }, [serviceId, services]);

  const isCompact = variant === "compact";

  return (
    <form
      ref={formRef}
      action={formAction}
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5",
        isCompact ? "space-y-3 p-4 sm:p-5" : "space-y-4 p-6",
      ].join(" ")}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Cerere unica de oferta
        </p>
      </div>

      <input type="hidden" name="companyId" value={companyId ?? ""} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="gdprAccepted" value="on" />
      <input type="hidden" name="urgency" value="normal" />
      <input type="hidden" name="cityId" value={cityId ?? ""} />
      <input type="hidden" name="cityText" value={cityName ?? ""} />
      <input type="hidden" name="address" value="Nespecificata in formular" />
      <input type="hidden" name="serviceId" value={serviceId ?? ""} />
      <input type="hidden" name="serviceText" value={defaultServiceText} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="fullName" placeholder="Nume" required className={isCompact ? "h-11 rounded-xl" : undefined} />
        <Input name="phone" placeholder="Telefon" required className={isCompact ? "h-11 rounded-xl" : undefined} />
      </div>

      <div className="space-y-2">
        <label className={isCompact ? "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500" : "text-sm font-medium text-slate-700"}>Judet</label>
        <select
          name="countyId"
          defaultValue={countyId ?? ""}
          className={[
            "w-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-300",
            isCompact ? "h-11 rounded-xl" : "h-12 rounded-2xl",
          ].join(" ")}
        >
          <option value="">Selecteaza judet</option>
          {counties.map((county) => (
            <option key={county.id ?? county.label} value={county.id}>
              {county.label}
            </option>
          ))}
        </select>
        <input type="hidden" name="countyText" value={countyName ?? ""} />
      </div>

      <Textarea
        name="description"
        placeholder="Descrie detaliat lucrarea, accesul, inaltimea aproximativa, termenul si orice informatie relevanta."
        required
        className={isCompact ? "min-h-28 rounded-2xl" : undefined}
      />

      <Button
        data-offer-cta="true"
        disabled={pending}
        className={isCompact ? "h-11 w-full rounded-xl" : "w-full"}
      >
        {pending ? "Se inregistreaza..." : "Trimite cererea"}
      </Button>

      {state.message ? (
        <p
          className={
            state.success ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-rose-700"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
