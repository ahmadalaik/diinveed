/*
  Warnings:

  - You are about to drop the column `venue_address` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `venue_name` on the `invitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitations` DROP COLUMN `venue_address`,
    DROP COLUMN `venue_name`;
