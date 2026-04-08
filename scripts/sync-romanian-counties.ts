import { PrismaClient } from "@prisma/client";
import {
  buildCityIntro,
  buildCountyIntro,
  buildCountySeoDescription,
  romanianCounties,
} from "../lib/data/romanian-counties";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const prisma = new PrismaClient();

async function main() {
  for (const county of romanianCounties) {
    const savedCounty = await prisma.county.upsert({
      where: { slug: county.slug },
      update: {
        name: county.name,
        shortCode: county.shortCode,
        intro: buildCountyIntro(county.name),
        introText: buildCountyIntro(county.name),
        seoTitle: `Firme de alpinism utilitar ${county.name}`,
        seoDescription: buildCountySeoDescription(county.name),
        isActive: true,
      },
      create: {
        name: county.name,
        slug: county.slug,
        shortCode: county.shortCode,
        intro: buildCountyIntro(county.name),
        introText: buildCountyIntro(county.name),
        seoTitle: `Firme de alpinism utilitar ${county.name}`,
        seoDescription: buildCountySeoDescription(county.name),
        isActive: true,
      },
    });

    const cityNames = [county.countySeat, ...(county.extraCities ?? [])];

    for (const cityName of cityNames) {
      const citySlug = slugify(cityName);
      await prisma.city.upsert({
        where: { slug: citySlug },
        update: {
          countyId: savedCounty.id,
          name: cityName,
          intro: buildCityIntro(cityName, county.name),
          introText: buildCityIntro(cityName, county.name),
          seoTitle: `Alpinism utilitar ${cityName}`,
          seoDescription: `Firme de alpinism utilitar din ${cityName}, județul ${county.name}, pentru lucrări la înălțime și intervenții comerciale.`,
          isActive: true,
        },
        create: {
          countyId: savedCounty.id,
          name: cityName,
          slug: citySlug,
          intro: buildCityIntro(cityName, county.name),
          introText: buildCityIntro(cityName, county.name),
          seoTitle: `Alpinism utilitar ${cityName}`,
          seoDescription: `Firme de alpinism utilitar din ${cityName}, județul ${county.name}, pentru lucrări la înălțime și intervenții comerciale.`,
          isActive: true,
        },
      });
    }
  }

  const countiesCount = await prisma.county.count({ where: { isActive: true } });
  const citiesCount = await prisma.city.count({ where: { isActive: true } });
  console.log(`Sync finalizat: ${countiesCount} județe active, ${citiesCount} orașe/localități active.`);
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
