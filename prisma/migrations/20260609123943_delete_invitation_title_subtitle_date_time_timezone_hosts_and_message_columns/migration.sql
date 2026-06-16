/*
  Warnings:

  - You are about to drop the column `cover_subtitle` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `cover_title` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `hosts` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `invitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitations` DROP COLUMN `cover_subtitle`,
    DROP COLUMN `cover_title`,
    DROP COLUMN `date`,
    DROP COLUMN `hosts`,
    DROP COLUMN `message`,
    DROP COLUMN `subtitle`,
    DROP COLUMN `time`,
    DROP COLUMN `timezone`;
