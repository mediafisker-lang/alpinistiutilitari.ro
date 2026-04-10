import { z } from "zod";

export const leadRequestSchema = z.object({
  companyId: z.string().optional(),
  fullName: z.string().trim().min(3, "Introdu numele complet."),
  phone: z.string().trim().min(10, "Introdu un număr de telefon valid."),
  email: z.email("Introdu o adresă de email validă.").optional().or(z.literal("")),
  countyId: z.string().optional(),
  countyText: z.string().trim().optional(),
  cityId: z.string().optional(),
  cityText: z.string().trim().optional(),
  address: z.string().trim().optional(),
  serviceId: z.string().optional(),
  serviceText: z.string().trim().optional(),
  description: z.string().trim().min(1, "Completează mesajul."),
  urgency: z.enum(["normal", "urgent"]).default("normal"),
  gdprAccepted: z.literal("on").optional().default("on"),
  sourcePage: z.string().optional(),
});

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
