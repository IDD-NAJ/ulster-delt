/*
  Warnings:

  - You are about to drop the column `expiry` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `expiryMonth` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `expiryYear` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `lastFourDigits` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Card` table. All the data in the column will be lost.
  - The `type` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cardNumber]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
*/

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'EXPIRED');

-- First, add the new columns with nullable constraints
ALTER TABLE "Card" 
ADD COLUMN IF NOT EXISTS "accountId" TEXT,
ADD COLUMN IF NOT EXISTS "cardNumber" TEXT,
ADD COLUMN IF NOT EXISTS "expiryDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "status" "CardStatus";

-- Update existing records with default values
UPDATE "Card"
SET 
  "accountId" = (
    SELECT "id" 
    FROM "Account" 
    WHERE "Account"."userId" = "Card"."userId" 
    AND "Account"."type" = 'CHECKING' 
    LIMIT 1
  ),
  "cardNumber" = CONCAT('4532', FLOOR(RANDOM() * 1000000000000)::TEXT),
  "expiryDate" = NOW() + INTERVAL '3 years',
  "status" = 'ACTIVE';

-- Now make the columns required
ALTER TABLE "Card" 
ALTER COLUMN "accountId" SET NOT NULL,
ALTER COLUMN "cardNumber" SET NOT NULL,
ALTER COLUMN "expiryDate" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Card" 
DROP COLUMN IF EXISTS "expiry",
DROP COLUMN IF EXISTS "expiryMonth",
DROP COLUMN IF EXISTS "expiryYear",
DROP COLUMN IF EXISTS "isActive",
DROP COLUMN IF EXISTS "lastFourDigits",
DROP COLUMN IF EXISTS "number",
DROP COLUMN IF EXISTS "type";

-- Add type column with enum
ALTER TABLE "Card" ADD COLUMN "type" "CardType" NOT NULL DEFAULT 'DEBIT';

-- Create indexes and constraints
DROP INDEX IF EXISTS "Card_cardNumber_key";
CREATE UNIQUE INDEX "Card_cardNumber_key" ON "Card"("cardNumber");

DROP INDEX IF EXISTS "Card_accountId_idx";
CREATE INDEX "Card_accountId_idx" ON "Card"("accountId");

-- Add foreign key (drop if exists first to avoid conflicts)
ALTER TABLE "Card" DROP CONSTRAINT IF EXISTS "Card_accountId_fkey";
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountId_fkey" 
  FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
