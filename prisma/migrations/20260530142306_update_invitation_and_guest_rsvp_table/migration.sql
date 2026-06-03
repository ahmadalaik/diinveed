/*
  Warnings:

  - You are about to drop the column `email` on the `guest_rsvps` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one` on the `guest_rsvps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guest_rsvps` DROP COLUMN `email`,
    DROP COLUMN `plus_one`,
    ADD COLUMN `guests` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `hope` TEXT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invitations` ADD COLUMN `bride_description` VARCHAR(191) NULL,
    ADD COLUMN `bride_image` VARCHAR(191) NULL,
    ADD COLUMN `bride_image_public_id` VARCHAR(191) NULL,
    ADD COLUMN `bride_name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `bride_nickname` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `cover_subtitle` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `cover_title` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `groom_description` VARCHAR(191) NULL,
    ADD COLUMN `groom_image` VARCHAR(191) NULL,
    ADD COLUMN `groom_image_public_id` VARCHAR(191) NULL,
    ADD COLUMN `groom_name` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `groom_nickname` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `music` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `music_public_id` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `quote` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `quoteReference` VARCHAR(191) NOT NULL DEFAULT '';

-- RenameIndex
ALTER TABLE `guest_rsvps` RENAME INDEX `guest_rsvps_invitation_id_fkey` TO `guest_rsvps_invitation_id_idx`;
