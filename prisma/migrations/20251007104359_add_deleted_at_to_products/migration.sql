-- AlterTable
ALTER TABLE "public"."Products" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "deletedAt" DROP DEFAULT;
