-- CreateTable
CREATE TABLE `Invitation` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `subtitle` VARCHAR(191) NOT NULL DEFAULT '',
    `date` VARCHAR(191) NOT NULL DEFAULT '',
    `time` VARCHAR(191) NOT NULL DEFAULT '',
    `hosts` VARCHAR(191) NOT NULL DEFAULT '',
    `message` VARCHAR(191) NOT NULL DEFAULT '',
    `venue_name` VARCHAR(191) NOT NULL DEFAULT '',
    `venue_address` VARCHAR(191) NOT NULL DEFAULT '',
    `cover_image` VARCHAR(191) NULL,
    `template_id` VARCHAR(191) NOT NULL DEFAULT 'kelana',
    `palette_idx` INTEGER NULL,
    `font_id` VARCHAR(191) NOT NULL DEFAULT 'serif-display',
    `background_type` VARCHAR(191) NOT NULL DEFAULT 'solid',
    `dress_code` VARCHAR(191) NOT NULL DEFAULT '',
    `rsvp_deadline` VARCHAR(191) NOT NULL DEFAULT '',
    `rsvp_options` JSON NOT NULL,
    `events` JSON NOT NULL,
    `stories` JSON NOT NULL,
    `gallery` JSON NOT NULL,
    `stickers` JSON NOT NULL,
    `gifts` JSON NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invitation_user_id_key`(`user_id`),
    UNIQUE INDEX `Invitation_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuestRsvp` (
    `id` VARCHAR(191) NOT NULL,
    `invitation_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `response` ENUM('ACCEPT', 'DECLINE', 'MAYBE') NOT NULL,
    `plus_one` BOOLEAN NOT NULL DEFAULT false,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuestRsvp` ADD CONSTRAINT `GuestRsvp_invitation_id_fkey` FOREIGN KEY (`invitation_id`) REFERENCES `Invitation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
