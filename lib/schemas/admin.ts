import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().min(8, "Parola trebuie să aibă cel puțin 8 caractere."),
});

export const leadStatusSchema = z.object({
  leadRequestId: z.string().min(1),
  status: z.enum([
    "noua",
    "in_analiza",
    "executanti_contactati",
    "client_contactat",
    "ofertare_in_curs",
    "finalizata",
    "inchisa",
    "respinsa",
  ]),
});

export const leadMetaSchema = z.object({
  leadRequestId: z.string().min(1),
  clientContacted: z.union([z.literal("on"), z.undefined()]),
  executantsContacted: z.union([z.literal("on"), z.undefined()]),
  resultSummary: z.string().trim().optional().or(z.literal("")),
});

export const leadNoteSchema = z.object({
  leadRequestId: z.string().min(1),
  note: z.string().trim().min(3, "Introdu o notiță internă."),
});
