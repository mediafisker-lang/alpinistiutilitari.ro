-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('pending', 'verified', 'hidden');

-- CreateEnum
CREATE TYPE "public"."LeadRequestStatus" AS ENUM ('noua', 'in_analiza', 'executanti_contactati', 'client_contactat', 'ofertare_in_curs', 'finalizata', 'inchisa', 'respinsa');

-- CreateEnum
CREATE TYPE "public"."LeadUrgency" AS ENUM ('normal', 'urgent');

-- CreateEnum
CREATE TYPE "public"."CompanySourceType" AS ENUM ('manual', 'google_places', 'claimed');

-- CreateEnum
CREATE TYPE "public"."ImportRunStatus" AS ENUM ('pending', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('admin', 'editor');

-- CreateTable
CREATE TABLE "public"."County" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortCode" TEXT,
    "intro" TEXT,
    "introText" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "faqJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" TEXT NOT NULL,
    "countyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "intro" TEXT,
    "introText" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "population" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "shortName" TEXT,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoIntro" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "countyId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legalName" TEXT,
    "cui" TEXT,
    "registrationNumber" TEXT,
    "descriptionShort" TEXT NOT NULL,
    "descriptionLong" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "galleryJson" JSONB,
    "sourceType" "public"."CompanySourceType" NOT NULL DEFAULT 'manual',
    "source" TEXT,
    "externalPlaceId" TEXT,
    "googleMapsUrl" TEXT,
    "ratingValue" DOUBLE PRECISION,
    "ratingCount" INTEGER,
    "openingHoursJson" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "manuallyEditedAt" TIMESTAMP(3),
    "foundedYear" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "public"."VerificationStatus" NOT NULL DEFAULT 'pending',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyService" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyCoverage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "countyId" TEXT,
    "cityId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadRequest" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "countyId" TEXT,
    "countyText" TEXT,
    "cityId" TEXT,
    "cityText" TEXT,
    "address" TEXT NOT NULL,
    "serviceId" TEXT,
    "serviceText" TEXT,
    "urgency" "public"."LeadUrgency" NOT NULL DEFAULT 'normal',
    "description" TEXT NOT NULL,
    "gdprAccepted" BOOLEAN NOT NULL,
    "attachmentsJson" JSONB,
    "status" "public"."LeadRequestStatus" NOT NULL DEFAULT 'noua',
    "clientContacted" BOOLEAN NOT NULL DEFAULT false,
    "executantsContacted" BOOLEAN NOT NULL DEFAULT false,
    "resultSummary" TEXT,
    "sourcePage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadRequestImage" (
    "id" TEXT NOT NULL,
    "leadRequestId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadRequestImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadCompanySelection" (
    "id" TEXT NOT NULL,
    "leadRequestId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadCompanySelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadRequestNote" (
    "id" TEXT NOT NULL,
    "leadRequestId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadRequestNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadRequestEvent" (
    "id" TEXT NOT NULL,
    "leadRequestId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadRequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleService" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ArticleService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "pageType" TEXT,
    "pageRefId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "countyId" TEXT,
    "cityId" TEXT,
    "serviceId" TEXT,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyImportRun" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "query" TEXT,
    "countyId" TEXT,
    "cityId" TEXT,
    "totalFound" INTEGER NOT NULL DEFAULT 0,
    "totalImported" INTEGER NOT NULL DEFAULT 0,
    "totalUpdated" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "public"."ImportRunStatus" NOT NULL DEFAULT 'pending',
    "logJson" JSONB,

    CONSTRAINT "CompanyImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyImportEvent" (
    "id" TEXT NOT NULL,
    "importRunId" TEXT NOT NULL,
    "companyId" TEXT,
    "externalId" TEXT,
    "status" TEXT NOT NULL,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyImportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GooglePlaceCategoryMap" (
    "id" TEXT NOT NULL,
    "placeType" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "GooglePlaceCategoryMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminSession" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "County_name_key" ON "public"."County"("name");

-- CreateIndex
CREATE UNIQUE INDEX "County_slug_key" ON "public"."County"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "County_shortCode_key" ON "public"."County"("shortCode");

-- CreateIndex
CREATE INDEX "County_slug_idx" ON "public"."County"("slug");

-- CreateIndex
CREATE INDEX "County_isActive_idx" ON "public"."County"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "public"."City"("slug");

-- CreateIndex
CREATE INDEX "City_countyId_idx" ON "public"."City"("countyId");

-- CreateIndex
CREATE INDEX "City_slug_idx" ON "public"."City"("slug");

-- CreateIndex
CREATE INDEX "City_isActive_idx" ON "public"."City"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "City_countyId_name_key" ON "public"."City"("countyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "public"."Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "public"."Service"("slug");

-- CreateIndex
CREATE INDEX "Service_slug_idx" ON "public"."Service"("slug");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "public"."Service"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "public"."Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cui_key" ON "public"."Company"("cui");

-- CreateIndex
CREATE UNIQUE INDEX "Company_externalPlaceId_key" ON "public"."Company"("externalPlaceId");

-- CreateIndex
CREATE INDEX "Company_countyId_idx" ON "public"."Company"("countyId");

-- CreateIndex
CREATE INDEX "Company_cityId_idx" ON "public"."Company"("cityId");

-- CreateIndex
CREATE INDEX "Company_slug_idx" ON "public"."Company"("slug");

-- CreateIndex
CREATE INDEX "Company_isVerified_idx" ON "public"."Company"("isVerified");

-- CreateIndex
CREATE INDEX "Company_isActive_idx" ON "public"."Company"("isActive");

-- CreateIndex
CREATE INDEX "Company_verificationStatus_idx" ON "public"."Company"("verificationStatus");

-- CreateIndex
CREATE INDEX "Company_isPublished_idx" ON "public"."Company"("isPublished");

-- CreateIndex
CREATE INDEX "Company_externalPlaceId_idx" ON "public"."Company"("externalPlaceId");

-- CreateIndex
CREATE INDEX "Company_countyId_isPublished_isActive_idx" ON "public"."Company"("countyId", "isPublished", "isActive");

-- CreateIndex
CREATE INDEX "Company_cityId_isPublished_isActive_idx" ON "public"."Company"("cityId", "isPublished", "isActive");

-- CreateIndex
CREATE INDEX "CompanyService_companyId_idx" ON "public"."CompanyService"("companyId");

-- CreateIndex
CREATE INDEX "CompanyService_serviceId_idx" ON "public"."CompanyService"("serviceId");

-- CreateIndex
CREATE INDEX "CompanyService_serviceId_companyId_idx" ON "public"."CompanyService"("serviceId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyService_companyId_serviceId_key" ON "public"."CompanyService"("companyId", "serviceId");

-- CreateIndex
CREATE INDEX "CompanyCoverage_companyId_idx" ON "public"."CompanyCoverage"("companyId");

-- CreateIndex
CREATE INDEX "CompanyCoverage_countyId_idx" ON "public"."CompanyCoverage"("countyId");

-- CreateIndex
CREATE INDEX "CompanyCoverage_cityId_idx" ON "public"."CompanyCoverage"("cityId");

-- CreateIndex
CREATE INDEX "CompanyCoverage_countyId_cityId_idx" ON "public"."CompanyCoverage"("countyId", "cityId");

-- CreateIndex
CREATE INDEX "LeadRequest_companyId_idx" ON "public"."LeadRequest"("companyId");

-- CreateIndex
CREATE INDEX "LeadRequest_status_idx" ON "public"."LeadRequest"("status");

-- CreateIndex
CREATE INDEX "LeadRequest_countyId_idx" ON "public"."LeadRequest"("countyId");

-- CreateIndex
CREATE INDEX "LeadRequest_cityId_idx" ON "public"."LeadRequest"("cityId");

-- CreateIndex
CREATE INDEX "LeadRequest_serviceId_idx" ON "public"."LeadRequest"("serviceId");

-- CreateIndex
CREATE INDEX "LeadRequest_countyId_serviceId_status_idx" ON "public"."LeadRequest"("countyId", "serviceId", "status");

-- CreateIndex
CREATE INDEX "LeadRequest_cityId_serviceId_status_idx" ON "public"."LeadRequest"("cityId", "serviceId", "status");

-- CreateIndex
CREATE INDEX "LeadRequestImage_leadRequestId_idx" ON "public"."LeadRequestImage"("leadRequestId");

-- CreateIndex
CREATE INDEX "LeadCompanySelection_leadRequestId_idx" ON "public"."LeadCompanySelection"("leadRequestId");

-- CreateIndex
CREATE INDEX "LeadCompanySelection_companyId_idx" ON "public"."LeadCompanySelection"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadCompanySelection_leadRequestId_companyId_key" ON "public"."LeadCompanySelection"("leadRequestId", "companyId");

-- CreateIndex
CREATE INDEX "LeadRequestNote_leadRequestId_idx" ON "public"."LeadRequestNote"("leadRequestId");

-- CreateIndex
CREATE INDEX "LeadRequestNote_adminUserId_idx" ON "public"."LeadRequestNote"("adminUserId");

-- CreateIndex
CREATE INDEX "LeadRequestEvent_leadRequestId_idx" ON "public"."LeadRequestEvent"("leadRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "public"."Article"("slug");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "public"."Article"("slug");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "public"."Article"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleService_articleId_serviceId_key" ON "public"."ArticleService"("articleId", "serviceId");

-- CreateIndex
CREATE INDEX "FAQ_pageType_pageRefId_idx" ON "public"."FAQ"("pageType", "pageRefId");

-- CreateIndex
CREATE INDEX "FAQ_countyId_idx" ON "public"."FAQ"("countyId");

-- CreateIndex
CREATE INDEX "FAQ_cityId_idx" ON "public"."FAQ"("cityId");

-- CreateIndex
CREATE INDEX "FAQ_serviceId_idx" ON "public"."FAQ"("serviceId");

-- CreateIndex
CREATE INDEX "FAQ_articleId_idx" ON "public"."FAQ"("articleId");

-- CreateIndex
CREATE INDEX "CompanyImportRun_countyId_idx" ON "public"."CompanyImportRun"("countyId");

-- CreateIndex
CREATE INDEX "CompanyImportRun_cityId_idx" ON "public"."CompanyImportRun"("cityId");

-- CreateIndex
CREATE INDEX "CompanyImportEvent_importRunId_idx" ON "public"."CompanyImportEvent"("importRunId");

-- CreateIndex
CREATE INDEX "CompanyImportEvent_companyId_idx" ON "public"."CompanyImportEvent"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "GooglePlaceCategoryMap_placeType_key" ON "public"."GooglePlaceCategoryMap"("placeType");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "public"."AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "public"."AdminSession"("token");

-- CreateIndex
CREATE INDEX "AdminSession_adminUserId_idx" ON "public"."AdminSession"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "public"."AdminSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyService" ADD CONSTRAINT "CompanyService_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyService" ADD CONSTRAINT "CompanyService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyCoverage" ADD CONSTRAINT "CompanyCoverage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyCoverage" ADD CONSTRAINT "CompanyCoverage_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyCoverage" ADD CONSTRAINT "CompanyCoverage_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequest" ADD CONSTRAINT "LeadRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequest" ADD CONSTRAINT "LeadRequest_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequest" ADD CONSTRAINT "LeadRequest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequest" ADD CONSTRAINT "LeadRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequestImage" ADD CONSTRAINT "LeadRequestImage_leadRequestId_fkey" FOREIGN KEY ("leadRequestId") REFERENCES "public"."LeadRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadCompanySelection" ADD CONSTRAINT "LeadCompanySelection_leadRequestId_fkey" FOREIGN KEY ("leadRequestId") REFERENCES "public"."LeadRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadCompanySelection" ADD CONSTRAINT "LeadCompanySelection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequestNote" ADD CONSTRAINT "LeadRequestNote_leadRequestId_fkey" FOREIGN KEY ("leadRequestId") REFERENCES "public"."LeadRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequestNote" ADD CONSTRAINT "LeadRequestNote_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadRequestEvent" ADD CONSTRAINT "LeadRequestEvent_leadRequestId_fkey" FOREIGN KEY ("leadRequestId") REFERENCES "public"."LeadRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleService" ADD CONSTRAINT "ArticleService_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleService" ADD CONSTRAINT "ArticleService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyImportRun" ADD CONSTRAINT "CompanyImportRun_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "public"."County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyImportRun" ADD CONSTRAINT "CompanyImportRun_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyImportEvent" ADD CONSTRAINT "CompanyImportEvent_importRunId_fkey" FOREIGN KEY ("importRunId") REFERENCES "public"."CompanyImportRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyImportEvent" ADD CONSTRAINT "CompanyImportEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GooglePlaceCategoryMap" ADD CONSTRAINT "GooglePlaceCategoryMap_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminSession" ADD CONSTRAINT "AdminSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

