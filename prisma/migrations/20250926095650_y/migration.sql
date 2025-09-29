-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "accountLockedUntil" TIMESTAMP(3),
ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'EMPLOYEE';
