-- AlterTable
ALTER TABLE `guests` ADD COLUMN `category` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `message_templates` (
    `id` VARCHAR(191) NOT NULL,
    `invitation_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `message_templates_invitation_id_idx`(`invitation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `message_templates` ADD CONSTRAINT `message_templates_invitation_id_fkey` FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
