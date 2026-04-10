"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { leadRequestSchema } from "@/lib/schemas/lead";

export type LeadFormState = {
  success?: boolean;
  message?: string;
  redirectTo?: string;
};

export async function submitLeadAction(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = leadRequestSchema.safeParse({
    companyId: formData.get("companyId")?.toString(),
    selectedCompanyIds: formData
      .getAll("selectedCompanyIds")
      .map((value) => value.toString())
      .filter(Boolean),
    fullName: formData.get("fullName")?.toString(),
    phone: formData.get("phone")?.toString(),
    email: formData.get("email")?.toString(),
    countyId: formData.get("countyId")?.toString(),
    countyText: formData.get("countyText")?.toString(),
    cityId: formData.get("cityId")?.toString(),
    cityText: formData.get("cityText")?.toString(),
    address: formData.get("address")?.toString(),
    serviceId: formData.get("serviceId")?.toString(),
    serviceText: formData.get("serviceText")?.toString(),
    description: formData.get("description")?.toString(),
    urgency: formData.get("urgency")?.toString(),
    gdprAccepted: formData.get("gdprAccepted")?.toString() ?? "on",
    sourcePage: formData.get("sourcePage")?.toString(),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Datele formularului nu sunt valide.",
    };
  }

  try {
    const [county, city, service] = await Promise.all([
      parsed.data.countyId
        ? prisma.county.findUnique({ where: { id: parsed.data.countyId } })
        : Promise.resolve(null),
      parsed.data.cityId
        ? prisma.city.findUnique({ where: { id: parsed.data.cityId } })
        : Promise.resolve(null),
      parsed.data.serviceId
        ? prisma.service.findUnique({ where: { id: parsed.data.serviceId } })
        : Promise.resolve(null),
    ]);

    const countyText = parsed.data.countyText?.trim() || county?.name;
    const cityText = parsed.data.cityText?.trim() || city?.name;
    const serviceText = parsed.data.serviceText?.trim() || service?.name;
    const addressText = parsed.data.address?.trim() || "Nespecificata in formular";

    if (!countyText) {
      return {
        success: false,
        message: "Te rugam sa selectezi judetul.",
      };
    }

    const selectedCompanyIds = [
      ...new Set(
        [parsed.data.companyId, ...parsed.data.selectedCompanyIds].filter(
          (value): value is string => Boolean(value),
        ),
      ),
    ];

    const lead = await prisma.leadRequest.create({
      data: {
        companyId: parsed.data.companyId || undefined,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email || undefined,
        countyId: parsed.data.countyId || undefined,
        countyText,
        cityId: parsed.data.cityId || undefined,
        cityText,
        address: addressText,
        serviceId: parsed.data.serviceId || undefined,
        serviceText,
        urgency: parsed.data.urgency,
        description: parsed.data.description,
        gdprAccepted: true,
        sourcePage: parsed.data.sourcePage || undefined,
        events: {
          create: {
            type: "created",
            payloadJson: {
              sourcePage: parsed.data.sourcePage || null,
              urgency: parsed.data.urgency,
              selectedCompanyIds,
            },
          },
        },
        selections: selectedCompanyIds.length
          ? {
              create: selectedCompanyIds.map((companyId) => ({
                companyId,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/cereri");

    return {
      success: true,
      message:
        "Cererea ta a fost inregistrata. Revenim dupa analiza interna cu firmele potrivite.",
      redirectTo: `/multumim?id=${lead.id}`,
    };
  } catch (error) {
    console.error("Lead submit failed:", error);
    return {
      success: false,
      message:
        "Cererea nu a putut fi salvata acum. Incearca din nou sau revino in cateva minute.",
    };
  }
}
