import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { IssueStatus, PublicIssue } from "@/types/database";

const historySteps: { label: string; value: IssueStatus }[] = [
  { label: "Trimisa", value: "noua" },
  { label: "In analiza", value: "in_analiza" },
  { label: "Rezolvata", value: "rezolvata" },
];

const statusMeta: Record<IssueStatus, { label: string; className: string }> = {
  noua: {
    label: "Noua",
    className: "bg-amber-50 text-amber-700",
  },
  in_analiza: {
    label: "In analiza",
    className: "bg-sky-50 text-sky-700",
  },
  rezolvata: {
    label: "Rezolvata",
    className: "bg-emerald-50 text-emerald-700",
  },
};

const issueCardImages = [
  "/images/cortina/cortina-north-comunitate-04.webp",
  "/images/cortina/cortina-north-comunitate-05.webp",
  "/images/cortina/cortina-north-comunitate-06.webp",
  "/images/cortina/cortina-north-comunitate-07.webp",
];

function isReached(currentStatus: IssueStatus, stepStatus: IssueStatus) {
  return historySteps.findIndex((step) => step.value === stepStatus) <=
    historySteps.findIndex((step) => step.value === currentStatus);
}

export function PublicIssuesList({ issues }: { issues: PublicIssue[] }) {
  return (
    <Card className="rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Sesizari trimise</CardTitle>
          <CardDescription className="mt-3">
            Aici apar cele mai recente sesizari si stadiul lor actual.
          </CardDescription>
        </div>
        <div className="self-start">
          <Badge>{issues.length} afisate</Badge>
        </div>
      </div>

      {issues.length ? (
        <div className="mt-6 space-y-4">
          {issues.map((issue, index) => (
            <div key={issue.id} className="surface-3d rounded-3xl bg-slate-50 p-4 sm:p-5">
              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="relative h-32 overflow-hidden rounded-2xl border border-slate-200 md:h-full">
                  <Image
                    src={issueCardImages[index % issueCardImages.length]}
                    alt={`Imagine sesizare ${issue.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 180px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                </div>
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{issue.title}</CardTitle>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusMeta[issue.status].className}`}
                        >
                          {statusMeta[issue.status].label}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-500">{issue.category}</p>
                      <CardDescription>{issue.description}</CardDescription>
                    </div>

                    <div className="text-sm text-slate-500 sm:text-right">
                      <p>{formatDate(issue.created_at)}</p>
                      <p className="mt-1">
                        {issue.attachment_urls.length
                          ? `${issue.attachment_urls.length} poze atasate`
                          : "Fara poze"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-900">Istoric</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {historySteps.map((step) => {
                        const reached = isReached(issue.status, step.value);

                        return (
                          <div
                            key={step.value}
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              reached
                                ? "surface-3d border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "surface-3d bg-white text-slate-500"
                            }`}
                          >
                            {step.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-900">Nu exista inca sesizari afisate.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dupa ce este trimisa prima sesizare, ea va aparea aici impreuna cu stadiul ei.
          </p>
        </div>
      )}
    </Card>
  );
}
