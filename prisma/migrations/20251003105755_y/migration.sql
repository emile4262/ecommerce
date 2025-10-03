-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "lastPasswordResetAt" TIMESTAMP(3),
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 'USERS';
