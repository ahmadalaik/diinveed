/*
  Warnings:

  - You are about to drop the column `bride_image_public_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `broadcast_message` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image_public_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `groom_image_public_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `music_public_id` on the `invitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitations` DROP COLUMN `bride_image_public_id`,
    DROP COLUMN `broadcast_message`,
    DROP COLUMN `cover_image`,
    DROP COLUMN `cover_image_public_id`,
    DROP COLUMN `groom_image_public_id`,
    DROP COLUMN `music_public_id`,
    ADD COLUMN `bride_image_key` VARCHAR(191) NULL,
    ADD COLUMN `cover_desktop_image` VARCHAR(191) NULL,
    ADD COLUMN `cover_desktop_image_key` VARCHAR(191) NULL,
    ADD COLUMN `cover_mobile_image` VARCHAR(191) NULL,
    ADD COLUMN `cover_mobile_image_key` VARCHAR(191) NULL,
    ADD COLUMN `groom_image_key` VARCHAR(191) NULL,
    ADD COLUMN `music_key` VARCHAR(191) NOT NULL DEFAULT '';
