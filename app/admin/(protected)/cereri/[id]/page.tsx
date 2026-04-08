import { notFound } from "next/navigation";
import { addLeadNoteAction, updateLeadMetaAction, updateLeadStatusAction } from "@/lib/actions/admin";
import { getLeadRequest } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadRequest(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Cerere #{lead.id.slice(0, 8)}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {lead.fullName}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{formatDate(lead.createdAt)}</p>
          </div>
          <form action={updateLeadStatusAction} className="flex flex-wrap gap-3">
            <input type="hidden" name="leadRequestId" value={lead.id} />
            <select
              name="status"
              defaultValue={lead.status}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm"
            >
              <option value="noua">Nouă</option>
              <option value="in_analiza">În analiză</option>
              <option value="executanti_contactati">Executanți contactați</option>
              <option value="client_contactat">Client contactat</option>
              <option value="ofertare_in_curs">Ofertare în curs</option>
              <option value="finalizata">Finalizată</option>
              <option value="inchisa">Închisă</option>
              <option value="respinsa">Respinsă</option>
            </select>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              Salvează status
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Date client</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Telefon</p>
                <p className="mt-2 font-medium text-slate-950">{lead.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                <p className="mt-2 font-medium text-slate-950">{lead.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Județ</p>
                <p className="mt-2 font-medium text-slate-950">
                  {lead.countyText ?? lead.county?.name ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Oraș</p>
                <p className="mt-2 font-medium text-slate-950">
                  {lead.cityText ?? lead.city?.name ?? "-"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Adresă lucrare</p>
                <p className="mt-2 font-medium text-slate-950">{lead.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tip lucrare</p>
                <p className="mt-2 font-medium text-slate-950">
                  {lead.serviceText ?? lead.service?.name ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Descriere</p>
                <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                  {lead.description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Imagini încărcate</h2>
            {lead.images.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {lead.images.map((image) => (
                  <a
                    key={image.id}
                    href={image.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-3xl border border-slate-200 p-4 text-sm text-sky-700 hover:bg-slate-50"
                  >
                    {image.fileName}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">Nu există imagini încărcate.</p>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Firme selectate de client</h2>
            {lead.selections.length ? (
              <div className="mt-5 grid gap-3">
                {lead.selections.map((selection) => (
                  <div key={selection.id} className="rounded-3xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-950">{selection.company.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selection.company.cityId ? "Profil cu localizare configurată" : "Profil fără localizare completă"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Cererea nu are încă firme selectate explicit. Poate proveni dintr-un formular generic sau dintr-un profil individual.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Workflow intern</h2>
            <form action={updateLeadMetaAction} className="mt-5 space-y-4">
              <input type="hidden" name="leadRequestId" value={lead.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  <input type="checkbox" name="clientContacted" defaultChecked={lead.clientContacted} />
                  Client contactat
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="executantsContacted"
                    defaultChecked={lead.executantsContacted}
                  />
                  Executanți contactați
                </label>
              </div>
              <textarea
                name="resultSummary"
                defaultValue={lead.resultSummary ?? ""}
                className="min-h-28 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-300"
                placeholder="Rezultat final, concluzii sau direcție de ofertare."
              />
              <button
                type="submit"
                className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
              >
                Salvează workflow
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Notițe interne</h2>
            <form action={addLeadNoteAction} className="mt-5 space-y-4">
              <input type="hidden" name="leadRequestId" value={lead.id} />
              <textarea
                name="note"
                className="min-h-32 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-300"
                placeholder="Adaugă o notiță despre contactarea clientului sau a executanților."
              />
              <button
                type="submit"
                className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
              >
                Salvează notița
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {lead.notes.length ? (
                lead.notes.map((note) => (
                  <div key={note.id} className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-950">{note.adminUser.email}</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {note.note}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Nu există notițe interne încă.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <h2 className="text-xl font-bold text-slate-950">Istoric</h2>
            <div className="mt-5 space-y-4">
              {lead.events.map((event) => (
                <div key={event.id} className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-950">{event.type}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(event.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
