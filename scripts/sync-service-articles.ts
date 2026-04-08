import { PrismaClient } from "@prisma/client";
import { serviceArticleSeeds } from "../lib/content/service-articles";

const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true },
  });

  const serviceIdBySlug = new Map(services.map((service) => [service.slug, service.id]));

  let created = 0;
  let updated = 0;

  for (const article of serviceArticleSeeds) {
    const serviceId = serviceIdBySlug.get(article.serviceSlug);
    if (!serviceId) {
      console.warn(`Serviciu lipsa pentru articol: ${article.serviceSlug}`);
      continue;
    }

    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
      select: { id: true },
    });

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        coverImageUrl: article.coverImageUrl,
        isPublished: true,
        services: {
          deleteMany: {},
          create: [{ serviceId }],
        },
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        coverImageUrl: article.coverImageUrl,
        isPublished: true,
        services: {
          create: [{ serviceId }],
        },
      },
    });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  console.log(`Articole servicii sincronizate. Create: ${created}, actualizate: ${updated}.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

