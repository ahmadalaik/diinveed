-- DropIndex
DROP INDEX `guests_slug_key` ON `guests`;

-- CreateIndex
CREATE UNIQUE INDEX `guests_invitation_id_slug_key` ON `guests`(`invitation_id`, `slug`);
