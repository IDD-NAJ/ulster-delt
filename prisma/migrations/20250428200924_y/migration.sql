-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "dailyLimit" DOUBLE PRECISION NOT NULL DEFAULT 1000,
ADD COLUMN     "isVirtual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUsed" TIMESTAMP(3),
ADD COLUMN     "monthlyLimit" DOUBLE PRECISION NOT NULL DEFAULT 10000;
