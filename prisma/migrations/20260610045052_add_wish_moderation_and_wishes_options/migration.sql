/*
  Warnings:

  - You are about to drop the column `hope` on the `guest_rsvps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guest_rsvps` DROP COLUMN `hope`,
    ADD COLUMN `moderation_status` ENUM('PENDING', 'APPROVED', 'HIDDEN') NOT NULL DEFAULT 'APPROVED',
    ADD COLUMN `wish` TEXT NULL;

-- AlterTable
ALTER TABLE `invitations` ADD COLUMN `wishes_options` JSON NULL;
