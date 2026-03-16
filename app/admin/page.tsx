import { cookies } from "next/headers";

import { AdminDeleteVoteMessageButton } from "@/components/admin-delete-vote-message-button";
import { AdminDeleteProposalButton } from "@/components/admin-delete-proposal-button";
import { AdminImageGallery } from "@/components/admin-image-gallery";
import { AdminIssueActions } from "@/components/admin-issue-actions";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminProposalForm } from "@/components/admin-proposal-form";
import { AdminProposalStatusForm } from "@/components/admin-proposal-status-form";
import { AdminResetPasswordForm } from "@/components/admin-reset-password-form";
import { AdminStatusForm } from "@/components/admin-status-form";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { getAdminSessionCookieName, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { buildingOptions } from "@/lib/constants";
import { getAdminIssues, getAdminResidents, getAdminVoteProposals } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const residentOptions = [
  { label: "Nou", value: "nou" },
  { label: "Contactat", value: "contactat" },
  { label: "Validat", value: "validat" },
];

const issueOptions = [
  { label: "Noua", value: "noua" },
  { label: "In analiza", value: "in_analiza" },
  { label: "Rezolvata", value: "rezolvata" },
];

export const metadata = {
  title: "Admin | Cortina North",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ building?: string }>;
}) {
  const params = await searchParams;
  const selectedBuilding = params.building ?? "";
  const cookieStore = await cookies();
  const adminSessionToken = cookieStore.get(getAdminSessionCookieName())?.value ?? "";

  const hasSession = isAdminSessionTokenValid(adminSessionToken);
  const isAuthorized = hasSession;

  const [residents, issues, proposals] = isAuthorized
    ? await Promise.all([
        getAdminResidents(selectedBuilding || undefined),
        getAdminIssues(),
        getAdminVoteProposals(),
      ])
    : [[], [], []];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading
          eyebrow="Admin"
          title="Vizualizare simpla si gestionare de baza"
          description="Zona de admin este protejata si poate fi accesata cu parola unica."
        />
        {isAuthorized ? <AdminLogoutButton /> : null}
      </div>

      {!isAuthorized ? <AdminLoginForm /> : null}

      {isAuthorized ? (
        <div className="mt-8 space-y-8">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Voteaza schimbarile</CardTitle>
                <CardDescription className="mt-2">
                  Creezi subiecte noi de vot, vezi rezultatele si inchizi votul cand este nevoie.
                </CardDescription>
              </div>
              <Badge>{proposals.length} propuneri</Badge>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
              <AdminProposalForm />

              <div className="space-y-4">
                {proposals.length ? (
                  proposals.map((proposal) => (
                    <Card key={proposal.id} className="rounded-3xl border border-slate-200 p-5 shadow-none">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle>{proposal.title}</CardTitle>
                            <Badge
                              className={
                                proposal.status === "open"
                                  ? undefined
                                  : "bg-slate-100 text-slate-700"
                              }
                            >
                              {proposal.status === "open" ? "Deschis" : "Inchis"}
                            </Badge>
                          </div>
                          <CardDescription>{proposal.description}</CardDescription>
                          <p className="text-sm text-slate-500">
                            Publicat la {formatDate(proposal.created_at)}
                          </p>
                        </div>

                        <div className="min-w-48 space-y-3">
                          <AdminProposalStatusForm id={proposal.id} currentValue={proposal.status} />
                          <AdminDeleteProposalButton proposalId={proposal.id} />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-sm font-medium text-emerald-800">Voturi Da</p>
                          <p className="mt-1 text-2xl font-semibold text-emerald-900">
                            {proposal.yes_votes}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 p-4">
                          <p className="text-sm font-medium text-rose-800">Voturi Nu</p>
                          <p className="mt-1 text-2xl font-semibold text-rose-900">
                            {proposal.no_votes}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-semibold text-slate-900">Mesaje lasate la vot</p>
                        <div className="mt-3 space-y-3">
                          {proposal.comments.length ? (
                            proposal.comments.slice(0, 6).map((comment) => (
                              <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-medium text-slate-950">
                                    {comment.resident_name}
                                  </p>
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                      comment.vote_choice === "yes"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {comment.vote_choice === "yes" ? "Da" : "Nu"}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {comment.reason || "Fara mesaj adaugat."}
                                </p>
                                <AdminDeleteVoteMessageButton voteId={comment.id} />
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              Inca nu exista mesaje pentru aceasta propunere.
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="rounded-3xl border border-dashed border-slate-200 p-5 shadow-none">
                    <CardTitle>Nu exista inca propuneri publicate</CardTitle>
                    <CardDescription className="mt-2">
                      Foloseste formularul din stanga pentru a adauga primul subiect de vot.
                    </CardDescription>
                  </Card>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Inscrieri</CardTitle>
                <CardDescription className="mt-2">
                  Ultimele 100 de inscrieri salvate in Supabase.
                </CardDescription>
              </div>
              <Badge>{residents.length} inregistrari</Badge>
            </div>

            <form className="mt-6 grid gap-3 sm:max-w-xs" method="get">
              <label className="text-sm font-medium text-slate-800" htmlFor="building-filter">
                Filtreaza dupa cladire
              </label>
              <Select id="building-filter" name="building" defaultValue={selectedBuilding}>
                <option value="">Toate cladirile</option>
                {buildingOptions.map((building) => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </Select>
              <button
                type="submit"
                className="h-11 rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-900"
              >
                Aplica filtrul
              </button>
            </form>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <TableHead>Nume</TableHead>
                    <TableHead>Cladire</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Acces vot</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Gestionare</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((resident) => (
                    <tr key={resident.id}>
                      <TableCell>{resident.full_name}</TableCell>
                      <TableCell>{resident.building}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p>{resident.phone}</p>
                          <p className="text-slate-500">{resident.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{resident.resident_type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            resident.password_hash
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {resident.password_hash ? "Parola setata" : "Fara parola"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(resident.created_at)}</TableCell>
                      <TableCell className="min-w-64">
                        <div className="space-y-4">
                          <AdminStatusForm
                            id={resident.id}
                            table="residents"
                            currentValue={resident.status}
                            options={residentOptions}
                          />
                          <AdminResetPasswordForm residentId={resident.id} />
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Sesizari</CardTitle>
                <CardDescription className="mt-2">
                  Ultimele 100 de sesizari salvate in Supabase.
                </CardDescription>
              </div>
              <Badge>{issues.length} inregistrari</Badge>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <TableHead>Titlu</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Poze</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Gestionare</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-950">{issue.title}</p>
                          <p className="text-slate-500">{issue.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p>{issue.contact_name}</p>
                          <p className="text-slate-500">
                            {issue.contact_phone || issue.contact_email || "Fara contact"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{issue.category}</TableCell>
                      <TableCell>
                        {issue.attachment_urls?.length ? (
                          <AdminImageGallery urls={issue.attachment_urls} />
                        ) : (
                          <span className="text-slate-400">Fara poze</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(issue.created_at)}</TableCell>
                      <TableCell className="min-w-80">
                        <div className="space-y-4">
                          <AdminStatusForm
                            id={issue.id}
                            table="issues"
                            currentValue={issue.status}
                            options={issueOptions}
                          />
                          <AdminIssueActions issue={issue} />
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
