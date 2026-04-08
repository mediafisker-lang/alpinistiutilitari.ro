import { z } from "zod";

export const leadRequestSchema = z.object({
  companyId: z.string().optional(),
  selectedCompanyIds: z.array(z.string()).default([]),
  fullName: z.string().trim().min(3, "Introdu numele complet."),
  phone: z.string().trim().min(10, "Introdu un număr de telefon valid."),
  email: z.email("Introdu o adresă de email validă.").optional().or(z.literal("")),
  countyId: z.string().optional(),
  countyText: z.string().trim().optional(),
  cityId: z.string().optional(),
  cityText: z.string().trim().optional(),
  address: z.string().trim().min(6, "Introdu adresa lucrării."),
  serviceId: z.string().optional(),
  serviceText: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .min(30, "Descrierea trebuie să aibă cel puțin 30 de caractere."),
  urgency: z.enum(["normal", "urgent"]).default("normal"),
  gdprAccepted: z.literal("on").optional().default("on"),
  sourcePage: z.string().optional(),
});

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
