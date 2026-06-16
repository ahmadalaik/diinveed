-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `method` ENUM('bank_transfer', 'qris', 'e_wallet', 'cash', 'gateway') NOT NULL,
    `amount` INTEGER NOT NULL,
    `reference_number` VARCHAR(191) NULL,
    `sender_name` VARCHAR(191) NULL,
    `sender_bank` VARCHAR(191) NULL,
    `proof_url` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `gateway_provider` VARCHAR(191) NULL,
    `gateway_transaction_id` VARCHAR(191) NULL,
    `gateway_payload` JSON NULL,
    `status` ENUM('pending', 'confirmed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `confirmed_by` VARCHAR(191) NULL,
    `confirmed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `original_price` INTEGER NOT NULL,
    `discount_type` ENUM('percentage', 'fixed') NULL,
    `discount_value` INTEGER NULL,
    `discount_amount` INTEGER NOT NULL DEFAULT 0,
    `final_amount` INTEGER NOT NULL,
    `status` ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    `notes` TEXT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `access_granted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `transactions_user_id_status_idx`(`user_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_confirmed_by_fkey` FOREIGN KEY (`confirmed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
