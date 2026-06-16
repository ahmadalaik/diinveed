/*
  Warnings:

  - You are about to drop the column `font_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `palette_idx` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `invitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitations` DROP COLUMN `font_id`,
    DROP COLUMN `palette_idx`,
    DROP COLUMN `template_id`,
    ADD COLUMN `token_id` VARCHAR(191) NOT NULL DEFAULT 'aura',
    ADD COLUMN `token_overrides` JSON NULL;
