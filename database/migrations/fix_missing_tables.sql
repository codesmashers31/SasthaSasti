-- Migration to create missing tables and columns from recent pull
USE `god_statue_erp`;

CREATE TABLE IF NOT EXISTS `supplier_payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `supplier_id` INT UNSIGNED NOT NULL UNIQUE,
  `paid_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('Paid', 'Unpaid', 'Partially Paid') NOT NULL DEFAULT 'Unpaid',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Cash',
  `payment_date` DATE NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `supplier_payment_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `supplier_id` INT UNSIGNED NOT NULL,
  `amount_paid` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `balance_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('Paid', 'Unpaid', 'Partially Paid') NOT NULL DEFAULT 'Unpaid',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Cash',
  `payment_date` DATE NOT NULL,
  `notes` TEXT NULL,
  `created_by` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `margin_percentage` DECIMAL(8,2) NULL DEFAULT 60.00 COMMENT 'Default markup % on piece rate' AFTER `piece_rate`;
