"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, MessageCircle, Phone, Trash2, X } from "lucide-react";
import {
  deletePublicLeadsAction,
  type CompactLeadStatus,
  updatePublicLeadStatusAction,
} from "@/lib/actions/public-leads";

export type PublicLeadRow = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  description: string;
  countyLabel: string;
  countyCode: string;
  status: CompactLeadStatus;
};

const statusStyles: Record<CompactLeadStatus, string> = {
  noua: "border-blue-200 bg-blue-50 text-blue-700",
  in_lucru: "border-orange-200 bg-orange-50 text-orange-700",
  rezolvata: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `40${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}

export function PublicLeadsManager({ leads }: { leads: PublicLeadRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, CompactLeadStatus>>(
    Object.fromEntries(leads.map((lead) => [lead.id, lead.status])),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const allSelected = leads.length > 0 && selected.length === leads.length;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleAll() {
    setSelected(allSelected ? [] : leads.map((lead) => lead.id));
  }

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function changeStatus(id: string, nextStatus: CompactLeadStatus) {
    const previous = statuses[id];
    setStatuses((current) => ({ ...current, [id]: nextStatus }));
    setFeedback(null);
    startTransition(async () => {
      const result = await updatePublicLeadStatusAction(id, nextStatus);
      if (!result.ok) {
        setStatuses((current) => ({ ...current, [id]: previous }));
        setFeedback(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove(ids: string[]) {
    const count = ids.length;
    if (!count || !window.confirm(`Ștergi definitiv ${count === 1 ? "această cerere" : `${count} cereri`}?`)) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await deletePublicLeadsAction(ids);
      if (!result.ok) {
        setFeedback(result.error);
        return;
      }
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      setFeedback(`${result.deleted} ${result.deleted === 1 ? "cerere ștearsă" : "cereri șterse"}.`);
      router.refresh();
    });
  }

  const statusSelect = (lead: PublicLeadRow) => (
    <select
      aria-label={`Status pentru ${lead.fullName}`}
      value={statuses[lead.id] ?? lead.status}
      disabled={isPending}
      onChange={(event) => changeStatus(lead.id, event.target.value as CompactLeadStatus)}
      className={`h-8 max-w-[112px] rounded-lg border px-2 text-xs font-semibold outline-none ${statusStyles[statuses[lead.id] ?? lead.status]}`}
    >
      <option value="noua">Nouă</option>
      <option value="in_lucru">În lucru</option>
      <option value="rezolvata">Rezolvată</option>
    </select>
  );

  const compactActions = (lead: PublicLeadRow) => (
    <div className="flex items-center gap-1">
      <a
        href={phoneHref(lead.phone)}
        title="Sună"
        aria-label={`Sună ${lead.fullName}`}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      >
        <Phone className="size-3.5" />
      </a>
      <a
        href={whatsappHref(lead.phone)}
        target="_blank"
        rel="noreferrer"
        title="WhatsApp"
        aria-label={`WhatsApp ${lead.fullName}`}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <MessageCircle className="size-3.5" />
      </a>
      <button
        type="button"
        title="Șterge"
        aria-label={`Șterge cererea de la ${lead.fullName}`}
        disabled={isPending}
        onClick={() => remove([lead.id])}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );

  return (
    <>
      <div className="mb-2 flex min-h-9 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {selected.length ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => remove(selected)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              Șterge selectate ({selected.length})
            </button>
          ) : (
            <span className="text-xs text-slate-500">Selectează cererile pentru ștergere multiplă.</span>
          )}
          {isPending ? <LoaderCircle className="size-4 animate-spin text-slate-400" /> : null}
        </div>
        {feedback ? <p className="text-xs font-medium text-slate-600">{feedback}</p> : null}
      </div>

      <div className="hidden max-h-[calc(100vh-250px)] overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="w-full table-fixed text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-slate-100 text-[11px] uppercase tracking-wide text-slate-600 shadow-[0_1px_0_#e2e8f0]">
            <tr>
              <th className="w-10 px-2 py-2 text-center">
                <input
                  type="checkbox"
                  aria-label="Selectează toate cererile"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="size-4 rounded border-slate-300"
                />
              </th>
              <th className="w-[122px] px-2 py-2">Data</th>
              <th className="w-[150px] px-2 py-2">Nume</th>
              <th className="w-[72px] px-2 py-2">Județ</th>
              <th className="px-2 py-2">Mesaj</th>
              <th className="w-[122px] px-2 py-2">Telefon</th>
              <th className="w-[122px] px-2 py-2">Status</th>
              <th className="w-[116px] px-2 py-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`border-t border-slate-100 align-middle hover:bg-slate-50/70 ${
                  (statuses[lead.id] ?? lead.status) === "rezolvata" ? "opacity-70" : ""
                }`}
              >
                <td className="px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    aria-label={`Selectează cererea de la ${lead.fullName}`}
                    checked={selectedSet.has(lead.id)}
                    onChange={() => toggleOne(lead.id)}
                    className="size-4 rounded border-slate-300"
                  />
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-xs text-slate-600">{lead.createdAt}</td>
                <td className="truncate px-2 py-2 font-semibold text-slate-900" title={lead.fullName}>
                  {lead.fullName}
                </td>
                <td className="px-2 py-2">
                  <span
                    title={lead.countyLabel}
                    className="inline-flex min-w-7 justify-center rounded-md bg-slate-100 px-1.5 py-1 text-[11px] font-bold text-slate-700"
                  >
                    {lead.countyCode}
                  </span>
                </td>
                <td className="px-2 py-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-2 min-w-0 flex-1 leading-4">{lead.description}</p>
                    {lead.description.length > 100 ? (
                      <button
                        type="button"
                        onClick={() => setMessage(lead.description)}
                        className="shrink-0 text-[11px] font-semibold text-sky-700 hover:underline"
                      >
                        Vezi tot
                      </button>
                    ) : null}
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-2">
                  <a href={phoneHref(lead.phone)} className="font-medium text-slate-800 hover:text-sky-700">
                    {lead.phone}
                  </a>
                </td>
                <td className="px-2 py-2">{statusSelect(lead)}</td>
                <td className="px-2 py-2">{compactActions(lead)}</td>
              </tr>
            ))}
            {!leads.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  Nu există cereri pentru filtrele selectate.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white lg:hidden">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className={`px-2.5 py-2.5 ${(statuses[lead.id] ?? lead.status) === "rezolvata" ? "opacity-70" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <input
                type="checkbox"
                aria-label={`Selectează cererea de la ${lead.fullName}`}
                checked={selectedSet.has(lead.id)}
                onChange={() => toggleOne(lead.id)}
                className="size-4 shrink-0 rounded border-slate-300"
              />
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">{lead.fullName}</p>
              <span className="rounded-md bg-slate-100 px-1.5 py-1 text-[10px] font-bold text-slate-700">
                {lead.countyCode}
              </span>
              {statusSelect(lead)}
            </div>
            <div className="mt-1.5 flex items-center gap-2 pl-6 text-[11px] text-slate-500">
              <span>{lead.createdAt}</span>
              <a href={phoneHref(lead.phone)} className="whitespace-nowrap font-semibold text-slate-700">
                {lead.phone}
              </a>
              <a
                href={whatsappHref(lead.phone)}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${lead.fullName}`}
                className="text-emerald-700"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
            <div className="mt-1.5 flex items-end gap-2 pl-6">
              <p className="line-clamp-2 min-w-0 flex-1 text-xs leading-4 text-slate-600">{lead.description}</p>
              {lead.description.length > 100 ? (
                <button
                  type="button"
                  onClick={() => setMessage(lead.description)}
                  className="shrink-0 text-[11px] font-semibold text-sky-700"
                >
                  Vezi tot
                </button>
              ) : null}
              {compactActions(lead)}
            </div>
          </article>
        ))}
        {!leads.length ? (
          <p className="px-3 py-10 text-center text-sm text-slate-500">
            Nu există cereri pentru filtrele selectate.
          </p>
        ) : null}
      </div>

      {message ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mesaj complet"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMessage(null);
          }}
        >
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-slate-950">Mesajul cererii</h2>
              <button
                type="button"
                onClick={() => setMessage(null)}
                aria-label="Închide mesajul"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message}</p>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white"
            >
              <Check className="size-3.5" />
              Închide
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
