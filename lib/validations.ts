import { z } from "zod";
import { buildingOptions } from "@/lib/constants";

const phoneRegex = /^[0-9+ ]{8,20}$/;
export const normalizePhone = (value: string) => value.replace(/\s+/g, " ").trim();

export const residentSchema = z.object({
  full_name: z.string().trim().min(3, "Introdu numele complet."),
  building: z
    .string()
    .trim()
    .refine((value) => buildingOptions.includes(value as (typeof buildingOptions)[number]), "Selectează clădirea."),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((value) => phoneRegex.test(value), "Introdu un număr de telefon valid."),
  email: z.string().trim().toLowerCase().email("Introdu o adresă de email validă."),
  password: z
    .string()
    .min(8, "Alege o parolă de cel puțin 8 caractere.")
    .max(72, "Parola este prea lungă."),
  resident_type: z
    .string()
    .trim()
    .refine((value) => ["proprietar", "chirias"].includes(value), "Alege statutul."),
  consent: z
    .boolean()
    .refine((value) => value === true, "Acordul pentru prelucrarea datelor este obligatoriu."),
  website: z.string().max(0).optional(),
  submitted_at: z.coerce.number(),
});

export const issueSchema = z.object({
  contact_name: z.string().trim().min(2, "Introdu numele.").optional().or(z.literal("")),
  contact_phone: z
    .string()
    .transform(normalizePhone)
    .refine((value) => phoneRegex.test(value), "Telefon invalid.")
    .or(z.literal(""))
    .optional(),
  category: z.string().trim().min(2, "Alege categoria."),
  description: z.string().trim().min(12, "Descrierea este prea scurtă."),
  website: z.string().max(0).optional(),
  submitted_at: z.coerce.number(),
});

export const votePasswordSetupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introdu o adresă de email validă."),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((value) => phoneRegex.test(value), "Introdu numărul de telefon folosit la înscriere."),
  password: z
    .string()
    .min(8, "Alege o parolă de cel puțin 8 caractere.")
    .max(72, "Parola este prea lungă."),
});

export function validateAntiSpam(submittedAt: number) {
  const elapsed = Date.now() - submittedAt;
  return elapsed >= 2500;
}
