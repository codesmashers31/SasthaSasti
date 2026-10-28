-- Migration: Add sales_mode to invoices table
ALTER TABLE `invoices` ADD COLUMN `sales_mode` VARCHAR(20) NOT NULL DEFAULT 'offline' AFTER `payment_method`;
ALTER TABLE `invoices` ADD INDEX `idx_invoices_sales_mode` (`sales_mode`);
