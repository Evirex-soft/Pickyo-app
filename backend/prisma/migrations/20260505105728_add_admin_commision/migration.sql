/*
  Warnings:

  - Added the required column `adminCommission` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverEarning` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "adminCommission" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "driverEarning" DOUBLE PRECISION NOT NULL;
