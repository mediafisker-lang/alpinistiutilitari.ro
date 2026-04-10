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

export const countySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Introdu numele județului."),
  slug: z.string().trim().min(2, "Introdu slug-ul."),
  shortCode: z.string().trim().max(5).optional().or(z.literal("")),
  intro: z.string().trim().optional().or(z.literal("")),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export const citySchema = z.object({
  id: z.string().optional(),
  countyId: z.string().min(1, "Selectează județul."),
  name: z.string().trim().min(2, "Introdu numele localității."),
  slug: z.string().trim().min(2, "Introdu slug-ul."),
  intro: z.string().trim().optional().or(z.literal("")),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Introdu numele serviciului."),
  slug: z.string().trim().min(2, "Introdu slug-ul."),
  category: z.string().trim().optional().or(z.literal("")),
  shortName: z.string().trim().optional().or(z.literal("")),
  shortDescription: z.string().trim().min(20, "Descrierea scurtă este prea scurtă."),
  longDescription: z.string().trim().min(60, "Descrierea lungă este prea scurtă."),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  seoIntro: z.string().trim().optional().or(z.literal("")),
});

export const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(5, "Introdu titlul articolului."),
  slug: z.string().trim().min(5, "Introdu slug-ul."),
  excerpt: z.string().trim().min(20, "Excerptul este prea scurt."),
  content: z.string().trim().min(100, "Conținutul este prea scurt."),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  isPublished: z.union([z.literal("on"), z.literal("true"), z.undefined()]),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  pageType: z.string().trim().min(2, "Introdu tipul paginii."),
  pageRefId: z.string().trim().optional().or(z.literal("")),
  countyId: z.string().trim().optional().or(z.literal("")),
  cityId: z.string().trim().optional().or(z.literal("")),
  serviceId: z.string().trim().optional().or(z.literal("")),
  articleId: z.string().trim().optional().or(z.literal("")),
  question: z.string().trim().min(10, "Întrebarea este prea scurtă."),
  answer: z.string().trim().min(20, "Răspunsul este prea scurt."),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(3, "Introdu numele firmei."),
  slug: z.string().trim().min(3, "Introdu slug-ul."),
  countyId: z.string().min(1, "Selectează județul."),
  cityId: z.string().min(1, "Selectează orașul."),
  descriptionShort: z.string().trim().min(20, "Descrierea scurtă este prea scurtă."),
  descriptionLong: z.string().trim().min(60, "Descrierea lungă este prea scurtă."),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().optional().or(z.literal("")),
  website: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  verificationStatus: z.enum(["pending", "verified", "hidden"]),
  isPublished: z.union([z.literal("on"), z.literal("true"), z.undefined()]),
  isFeatured: z.union([z.literal("on"), z.literal("true"), z.undefined()]),
});
