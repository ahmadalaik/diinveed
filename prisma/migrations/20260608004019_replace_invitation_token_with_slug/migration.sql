-- Replace Invitation.token (uuid) with slug (cosmetic) + public_token (opaque lookup id)

-- 1. Add new columns (public_token temporarily nullable for backfill)
ALTER TABLE `invitations` ADD COLUMN `slug` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `invitations` ADD COLUMN `public_token` VARCHAR(191) NULL;

-- 2. Backfill public_token for any existing rows with an 8-char token
UPDATE `invitations` SET `public_token` = SUBSTRING(MD5(RAND()), 1, 8) WHERE `public_token` IS NULL;

-- 3. Enforce NOT NULL now that all rows have a value
ALTER TABLE `invitations` MODIFY `public_token` VARCHAR(191) NOT NULL;

-- 4. Drop the old token column (its single-column unique index is dropped with it)
ALTER TABLE `invitations` DROP COLUMN `token`;

-- 5. Unique index on public_token
CREATE UNIQUE INDEX `invitations_public_token_key` ON `invitations`(`public_token`);
