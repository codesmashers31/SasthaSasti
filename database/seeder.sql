-- Enterprise God Statue Inventory, Billing & Accounting Management System
-- Database Seed Data

USE `god_statue_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED DEPARTMENTS
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `status`) VALUES
(1, 'Executive & Administration', 'DEPT-EXEC', 'Overall business management and system governance', 'active'),
(2, 'Sales & Retail Showroom', 'DEPT-SALES', 'Showroom POS billing, walk-in customers and sales inquiries', 'active'),
(3, 'Inventory & Warehouse', 'DEPT-WH', 'Stock management, idol safe-keeping, quality checks and packaging', 'active'),
(4, 'Accounts & Finance', 'DEPT-ACC', 'Ledgers, bookkeeping, supplier payments and expense audits', 'active'),
(5, 'Procurement & Sculpting', 'DEPT-PROC', 'Artisan relations, raw brass/marble sourcing and procurement', 'active');

-- 2. SEED ROLES
INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `is_system`, `status`) VALUES
(1, 'Super Admin', 'super-admin', 'Complete unrestricted system access', 1, 'active'),
(2, 'Admin', 'admin', 'Administrative management and high-level operations', 1, 'active'),
(3, 'Billing Manager', 'billing-manager', 'Supervises POS billing, sales returns, and discounts', 1, 'active'),
(4, 'Billing Staff', 'billing-staff', 'Performs POS sales, customer searches, and receipt printing', 1, 'active'),
(5, 'Accounts Manager', 'accounts-manager', 'Supervises finances, approving expenses and reconciliations', 1, 'active'),
(6, 'Accountant', 'accountant', 'Manages daily cash book, bank entries, and supplier payouts', 1, 'active'),
(7, 'Inventory Manager', 'inventory-manager', 'Controls stock transactions, adjustments, and warehouse transfers', 1, 'active'),
(8, 'Sales Staff', 'sales-staff', 'Assists customers, manages quotes and catalogs', 1, 'active'),
(9, 'Viewer', 'viewer', 'Read-only access to catalogs and non-sensitive reports', 1, 'active');

-- 3. SEED PERMISSIONS
INSERT INTO `permissions` (`id`, `module`, `name`, `slug`, `description`) VALUES
-- Users
(1, 'users', 'View Users', 'users.view', 'View users listing and profiles'),
(2, 'users', 'Create Users', 'users.create', 'Create new staff user accounts'),
(3, 'users', 'Edit Users', 'users.edit', 'Edit user information and status'),
(4, 'users', 'Delete Users', 'users.delete', 'Delete user accounts'),
-- Roles & Permissions
(5, 'roles', 'View Roles', 'roles.view', 'View roles and permission matrices'),
(6, 'roles', 'Manage Roles', 'roles.manage', 'Create, edit roles and assign permissions'),
-- Departments
(7, 'departments', 'View Departments', 'departments.view', 'View departments list'),
(8, 'departments', 'Manage Departments', 'departments.manage', 'Create and modify departments'),
-- Categories & Subcategories
(9, 'catalog', 'View Categories', 'categories.view', 'View categories and subcategories'),
(10, 'catalog', 'Manage Categories', 'categories.manage', 'Create, update, delete categories & subcategories'),
-- Products (God Statues & Items)
(11, 'products', 'View Products', 'products.view', 'View products list and details'),
(12, 'products', 'Create Products', 'products.create', 'Add new statues and religious products'),
(13, 'products', 'Edit Products', 'products.edit', 'Modify product specs, pricing, and images'),
(14, 'products', 'Delete Products', 'products.delete', 'Delete products from catalog'),
(15, 'products', 'Export Products', 'products.export', 'Export product list to Excel/CSV'),
-- Inventory
(16, 'inventory', 'View Inventory', 'inventory.view', 'View current stock levels and history'),
(17, 'inventory', 'Stock Adjustment', 'inventory.adjust', 'Perform stock adjustments and damage write-offs'),
(18, 'inventory', 'Stock In', 'inventory.stock_in', 'Perform manual stock additions'),
-- Customers
(19, 'customers', 'View Customers', 'customers.view', 'View customer directory and balances'),
(20, 'customers', 'Create Customers', 'customers.create', 'Add new customers'),
(21, 'customers', 'Edit Customers', 'customers.edit', 'Edit customer details and credit limits'),
(22, 'customers', 'Delete Customers', 'customers.delete', 'Delete customers'),
-- Suppliers
(23, 'suppliers', 'View Suppliers', 'suppliers.view', 'View artisans and suppliers directory'),
(24, 'suppliers', 'Manage Suppliers', 'suppliers.manage', 'Add and edit supplier records'),
-- Purchases
(25, 'purchases', 'View Purchases', 'purchases.view', 'View purchase orders'),
(26, 'purchases', 'Create Purchases', 'purchases.create', 'Create statue procurement orders'),
(27, 'purchases', 'Approve Purchases', 'purchases.approve', 'Approve purchases and auto-increment stock'),
(28, 'purchases', 'Cancel Purchases', 'purchases.cancel', 'Cancel purchase orders'),
-- Billing / POS
(29, 'billing', 'POS Terminal', 'billing.pos', 'Access point-of-sale billing terminal'),
(30, 'billing', 'View Invoices', 'billing.view', 'View sales invoices list and history'),
(31, 'billing', 'Create Invoice', 'billing.create', 'Generate and complete sales invoices'),
(32, 'billing', 'Cancel Invoice', 'billing.cancel', 'Cancel sales invoices with audit note'),
(33, 'billing', 'Print Invoice', 'billing.print', 'Print A4 and thermal receipts'),
(34, 'billing', 'Sales Returns', 'billing.returns', 'Process statue returns and issue refunds'),
-- Accounts & Expenses
(35, 'accounts', 'View Accounts', 'accounts.view', 'View cash book, bank book, and balances'),
(36, 'accounts', 'Manage Payments', 'accounts.payments', 'Record customer receipts and supplier disbursements'),
(37, 'accounts', 'View Expenses', 'expenses.view', 'View expense list and vouchers'),
(38, 'accounts', 'Create Expenses', 'expenses.create', 'Submit new expense vouchers'),
(39, 'accounts', 'Approve Expenses', 'expenses.approve', 'Approve expense payments'),
-- Reports
(40, 'reports', 'Sales Reports', 'reports.sales', 'Access sales analytics and date filters'),
(41, 'reports', 'Inventory Reports', 'reports.inventory', 'Access stock valuation and movement reports'),
(42, 'reports', 'Financial Reports', 'reports.financial', 'Access P&L, collections, and expense reports'),
-- Settings & Audit
(43, 'settings', 'Manage Settings', 'settings.manage', 'Configure company profile, taxes, and printers'),
(44, 'audit', 'View Audit Logs', 'audit.view', 'Inspect full system audit trails');

-- 4. SEED ROLE PERMISSIONS
-- Super Admin has all permissions (1..44)
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM `permissions`;

-- Admin has all permissions except dangerous actions
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, id FROM `permissions` WHERE slug NOT IN ('users.delete');

-- Billing Manager: POS, View Invoices, Print, Sales Returns, Customers, View Products, View Stock, Sales Reports
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 3, id FROM `permissions` WHERE module IN ('billing', 'customers', 'products') 
OR slug IN ('inventory.view', 'reports.sales');

-- Billing Staff: POS, View/Create Invoices, Print, View Customers, Quick Add Customer, View Products
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 4, id FROM `permissions` WHERE slug IN (
  'billing.pos', 'billing.view', 'billing.create', 'billing.print',
  'customers.view', 'customers.create',
  'products.view'
);

-- Accounts Manager: Accounts, Expenses, Payments, Invoices View, Purchases View, Financial Reports, Customers View, Suppliers View
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 5, id FROM `permissions` WHERE module IN ('accounts', 'reports')
OR slug IN ('billing.view', 'purchases.view', 'customers.view', 'suppliers.view');

-- Accountant: View Accounts, Manage Payments, View/Create Expenses, Financial Reports
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 6, id FROM `permissions` WHERE slug IN (
  'accounts.view', 'accounts.payments', 'expenses.view', 'expenses.create', 'reports.financial', 'billing.view'
);

-- Inventory Manager: Products, Categories, Inventory adjustments, Stock In, Purchases, Suppliers
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 7, id FROM `permissions` WHERE module IN ('products', 'catalog', 'inventory', 'suppliers', 'purchases')
OR slug IN ('reports.inventory');

-- Sales Staff: Products View, Customers View, POS Terminal
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 8, id FROM `permissions` WHERE slug IN ('products.view', 'customers.view', 'billing.pos');

-- Viewer: Products View, Categories View, Inventory View
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 9, id FROM `permissions` WHERE slug IN ('products.view', 'categories.view', 'inventory.view');

-- 5. SEED USERS (Password for all seeded accounts is: admin123 -> $2y$10$eO0lQp0G300H2j/w1iYkU.0Yj1BfQ9hWqPqf3U6E4k8x5n2V0pA9C or standard hash)
-- Generated using password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `mobile`, `password`, `role_id`, `department_id`, `status`) VALUES
(1, 'Shree Mahadev (System Master)', 'superadmin', 'admin@godstatueerp.com', '+91 9876543210', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 1, 1, 'active'),
(2, 'Rajesh Sharma (Store Admin)', 'rajesh', 'rajesh@godstatueerp.com', '+91 9840112233', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 2, 1, 'active'),
(3, 'Anand Kumar (Billing Head)', 'anand', 'anand@godstatueerp.com', '+91 9840223344', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 3, 2, 'active'),
(4, 'Priya Sundaram (POS Cashier)', 'priya', 'priya@godstatueerp.com', '+91 9840334455', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 4, 2, 'active'),
(5, 'Venkatesh Iyer (Chief Accountant)', 'venkatesh', 'venkat@godstatueerp.com', '+91 9840445566', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 5, 4, 'active'),
(6, 'Muruganathan (Warehouse Lead)', 'murugan', 'murugan@godstatueerp.com', '+91 9840556677', '$2y$10$w09u7iK3jT7YgM0uA6OQxe4Yd4M2Fq9Nn6GZ3L7R8V1b2C3D4E5Fa', 7, 3, 'active');

-- 6. SEED CATEGORIES
INSERT INTO `categories` (`id`, `name`, `code`, `description`, `status`) VALUES
(1, 'Hindu God Statues', 'CAT-HINDU', 'Sacred hand-carved Hindu deities and divine idols', 'active'),
(2, 'Buddha & Spiritual Statues', 'CAT-BUDDHA', 'Meditative Buddha sculptures, Bodhisattvas, and Zen decor', 'active'),
(3, 'Pooja Accessories & Vessels', 'CAT-POOJA', 'Authentic brass diyas, temple bells, aarti lamps, and pooja thalis', 'active'),
(4, 'Temple Decor & Architecture', 'CAT-TEMPLE', 'Temple pillars, sanctum doors, prabhavalis, and sacred canopies', 'active'),
(5, 'Spiritual Gifts & Artifacts', 'CAT-GIFTS', 'Sacred framed yantras, miniature pocket shrines, and spiritual mementos', 'active');

-- 7. SEED SUBCATEGORIES
INSERT INTO `subcategories` (`id`, `category_id`, `name`, `code`, `description`, `status`) VALUES
(1, 1, 'Lord Ganesha (Vinayagar)', 'SUB-GANESHA', 'Vighnaharta Ganesha in seated, dancing, and reclining postures', 'active'),
(2, 1, 'Lord Murugan (Kartikeya)', 'SUB-MURUGAN', 'Swaminatha, Dhandayuthapani, and Vel Murugan idols', 'active'),
(3, 1, 'Lord Shiva (Nataraja & Lingam)', 'SUB-SHIVA', 'Nataraja cosmos dance, Shivling, and meditating Mahadev', 'active'),
(4, 1, 'Lord Krishna (Radha Krishna)', 'SUB-KRISHNA', 'Flute playing Krishna, Butter Krishna, and Radha Krishna pair', 'active'),
(5, 1, 'Goddess Lakshmi & Saraswati', 'SUB-DEVI', 'Goddess of Wealth Lakshmi, Wisdom Saraswati, and Durga Devi', 'active'),
(6, 1, 'Lord Vishnu & Balaji', 'SUB-VISHNU', 'Tirupati Balaji, Anantha Padmanabha, and Dashavatara', 'active'),
(7, 1, 'Lord Hanuman', 'SUB-HANUMAN', 'Veera Hanuman, Panchamukhi Hanuman, and Sanjeevi Hanuman', 'active'),
(8, 2, 'Meditating Buddha (Dhyana)', 'SUB-BUDDHA-DHYAN', 'Peaceful seated Buddha in deep Dhyana mudra', 'active'),
(9, 2, 'Laughing Buddha (Kubera)', 'SUB-LAUGH-BUDDHA', 'Prosperity and joy laughing Buddha with ingots and sack', 'active'),
(10, 3, 'Brass Deepams & Diyas', 'SUB-DEEPAM', 'Traditional Kuthu Vilakku, Annam vilakku, and hanging lamps', 'active'),
(11, 3, 'Aarti Plates & Kalash', 'SUB-AARTI', 'Panchapatra, Arghyam sets, Puja Thalis, and Copper Kalash', 'active');

-- 8. SEED PRODUCTS (Rich God Statues & Religious Artifacts)
INSERT INTO `products` (`id`, `name`, `code`, `sku`, `barcode`, `category_id`, `subcategory_id`, `brand`, `description`, `god_name`, `material`, `color`, `height`, `width`, `length`, `weight`, `size`, `finish_type`, `purchase_price`, `selling_price`, `wholesale_price`, `discount_percent`, `gst_percent`, `hsn_code`, `current_stock`, `min_stock`, `max_stock`, `stock_location`, `image`, `status`, `created_by`) VALUES
(1, 'Antique Brass Royal Ganesha 18 Inch', 'PRD-GAN-001', 'SKU-BRS-GAN-18', '8901234500018', 1, 1, 'Swamimalai Bronzes', 'Magnificent handcrafted antique finished solid brass Lord Ganesha in sitting posture with ornate prabhavali arch.', 'Lord Ganesha', 'Brass', 'Antique Brown Gold', 18.00, 12.00, 8.00, 14.50, 'Medium', 'Antique', 12500.00, 18900.00, 15500.00, 5.00, 12.00, '9701', 8, 2, 20, 'Section A - Rack 1', 'assets/images/statues/ganesha_brass.png', 'active', 1),

(2, 'Traditional Swamimalai Bronze Dancing Nataraja 24 Inch', 'PRD-SHV-002', 'SKU-BRZ-NAT-24', '8901234500024', 1, 3, 'Swamimalai Bronzes', 'Authentic Panchaloha lost-wax cast Lord Nataraja performing the cosmic Anandatandava dance on demon Apasmara.', 'Lord Shiva (Nataraja)', 'Panchaloha', 'Dark Antique Bronze', 24.00, 20.00, 8.00, 18.20, 'Large', 'Antique', 28000.00, 42500.00, 36000.00, 0.00, 12.00, '9701', 5, 2, 15, 'Sanctum Display 1', 'assets/images/statues/nataraja_bronze.png', 'active', 1),

(3, 'Tirupati Sri Venkateswara Balaji 15 Inch Gold Plated', 'PRD-BAL-003', 'SKU-GLD-BAL-15', '8901234500015', 1, 6, 'Divya Murti', 'Exquisite 24K gold micron plated Tirupati Lord Balaji with detailed Namam, Shankha, Chakra and ornate crown.', 'Lord Balaji (Venkateswara)', 'Brass', '24K Gold Plated', 15.00, 9.00, 6.00, 8.75, 'Medium', 'Gold Plated', 9500.00, 14800.00, 12200.00, 10.00, 12.00, '9701', 12, 3, 30, 'Section A - Rack 2', 'assets/images/statues/balaji_gold.png', 'active', 1),

(4, 'Pure White Makrana Marble Goddess Lakshmi 12 Inch', 'PRD-LAK-004', 'SKU-MRB-LAK-12', '8901234500012', 1, 5, 'Jaipur Marble Crafts', 'Pristine hand-carved white Makrana marble Goddess Lakshmi seated on blooming lotus with intricate gold leaf painting.', 'Goddess Lakshmi', 'White Marble', 'White with Gold Work', 12.00, 8.00, 5.00, 7.20, 'Small', 'Polished', 6200.00, 9800.00, 8000.00, 0.00, 12.00, '9701', 6, 2, 25, 'Marble Gallery Rack 3', 'assets/images/statues/lakshmi_marble.png', 'active', 1),

(5, 'Palani Dhandayuthapani Murugan Brass Idol 16 Inch', 'PRD-MUR-005', 'SKU-BRS-MUR-16', '8901234500016', 1, 2, 'Mayavaram Sculptors', 'Sacred Lord Murugan in ascetic posture holding divine Vel spear and peacock vahana at the base.', 'Lord Murugan', 'Brass', 'Glossy Golden Brass', 16.00, 7.50, 5.00, 9.10, 'Medium', 'Glossy', 8200.00, 12900.00, 10500.00, 5.00, 12.00, '9701', 10, 2, 25, 'Section B - Rack 1', 'assets/images/statues/murugan_brass.png', 'active', 1),

(6, 'Radha Krishna Flute Leela Panchaloha Murti 20 Inch', 'PRD-RK-006', 'SKU-PCH-RK-20', '8901234500020', 1, 4, 'Mathura Heritage', 'Divine divine dual idol of Lord Krishna playing flute accompanied by loving Sri Radha under Kadamba tree.', 'Radha Krishna', 'Panchaloha', 'Multi-tone Antique', 20.00, 14.00, 8.00, 16.80, 'Large', 'Antique', 22000.00, 34500.00, 29000.00, 8.00, 12.00, '9701', 4, 1, 10, 'Section B - Rack 3', 'assets/images/statues/radha_krishna.png', 'active', 1),

(7, 'Veera Panchamukhi Hanuman Idol 12 Inch Solid Brass', 'PRD-HAN-007', 'SKU-BRS-HAN-12', '8901234500007', 1, 7, 'Swamimalai Bronzes', 'Powerful five-faced Panchamukhi Hanuman holding celestial weapons for protection and vastu positivity.', 'Lord Hanuman', 'Brass', 'Antique Matte Finish', 12.00, 9.00, 5.00, 6.40, 'Small', 'Matte', 4800.00, 7500.00, 6100.00, 0.00, 12.00, '9701', 15, 3, 40, 'Section C - Rack 1', 'assets/images/statues/hanuman_brass.png', 'active', 1),

(8, 'Serene Zen Meditating Buddha White Marble 18 Inch', 'PRD-BUD-008', 'SKU-MRB-BUD-18', '8901234500019', 2, 8, 'Jaipur Marble Crafts', 'Peaceful Gautama Buddha in Padmasana Dhyana meditation posture carved from pristine white marble block.', 'Lord Buddha', 'White Marble', 'Pure White', 18.00, 13.00, 7.50, 15.00, 'Medium', 'Polished', 11000.00, 17500.00, 14200.00, 5.00, 12.00, '9701', 7, 2, 20, 'Buddha Sanctuary 1', 'assets/images/statues/buddha_marble.png', 'active', 1),

(9, 'Traditional Annam Peacock Kuthu Vilakku (Pair 3.5 Feet)', 'PRD-VLK-009', 'SKU-BRS-VLK-42', '8901234500042', 3, 10, 'Nachiyar Kovil Brass', 'Authentic Nachiyar Kovil handcrafted pair of five-wick Annam Vilakku traditional standing oil lamps.', 'Pooja Deepam', 'Brass', 'Mirror Polish Brass', 42.00, 12.00, 12.00, 22.00, 'Large', 'Glossy', 14000.00, 21900.00, 18000.00, 0.00, 12.00, '9701', 9, 2, 20, 'Lamps Floor Section', 'assets/images/statues/kuthu_vilakku.png', 'active', 1),

(10, 'Royal Brass Pooja Thali Set (9 Items Included)', 'PRD-THL-010', 'SKU-BRS-THL-09', '8901234500009', 3, 11, 'Nachiyar Kovil Brass', 'Complete royal puja ensemble with engraved floral plate, bell, panchapatra, udharani, camphor aarti, and agarbatti stand.', 'Pooja Set', 'Brass', 'Bright Gold Finish', 3.00, 14.00, 14.00, 2.80, 'Small', 'Polished', 1850.00, 3200.00, 2500.00, 10.00, 12.00, '9701', 25, 5, 80, 'Pooja Accessories Rack', 'assets/images/statues/pooja_thali.png', 'active', 1),

(11, 'Black Granite Carved Shiva Lingam with Nandi 10 Inch', 'PRD-SHV-011', 'SKU-GRN-SHV-10', '8901234500010', 1, 3, 'Mahabalipuram Sculptors', 'Sacred black softstone hand-sculpted Shivling with detailed Jaladhari water outlet and miniature Nandi bull.', 'Lord Shiva', 'Black Stone', 'Natural Matte Stone', 10.00, 12.00, 8.00, 11.50, 'Small', 'Natural', 3800.00, 6200.00, 5000.00, 0.00, 12.00, '9701', 11, 3, 30, 'Stone Section 2', 'assets/images/statues/shivalinga_stone.png', 'active', 1),

(12, 'Dancing Baby Krishna with Butter Pot 10 Inch Brass', 'PRD-KRS-012', 'SKU-BRS-KRS-10', '8901234500011', 1, 4, 'Swamimalai Bronzes', 'Charming depiction of Little Krishna (Navaneetha Krishna) with butter ball in right hand and joy in posture.', 'Lord Krishna', 'Brass', 'Antique Polish', 10.00, 6.50, 4.50, 4.20, 'Small', 'Antique', 3200.00, 4999.00, 4100.00, 0.00, 12.00, '9701', 18, 4, 50, 'Section A - Rack 3', 'assets/images/statues/krishna_baby.png', 'active', 1);

-- 9. SEED CUSTOMERS
INSERT INTO `customers` (`id`, `customer_code`, `name`, `mobile`, `email`, `address`, `city`, `state`, `pincode`, `gst_number`, `credit_limit`, `outstanding_balance`, `customer_type`, `status`) VALUES
(1, 'CUST-0001', 'Walk-in Retail Customer', '9999999999', 'walkin@store.local', 'Showroom Counter', 'Chennai', 'Tamil Nadu', '600001', NULL, 0.00, 0.00, 'retail', 'active'),
(2, 'CUST-0002', 'Sri Kapaleeshwarar Temple Trust', '9841022334', 'trust@kapaleeshwarar.org', '12 Sannidhi Street, Mylapore', 'Chennai', 'Tamil Nadu', '600004', '33AAACT0123A1Z5', 150000.00, 24500.00, 'temple_trust', 'active'),
(3, 'CUST-0003', 'Annamalai Handicrafts & Exports', '9842133445', 'orders@annamalaihandicrafts.com', '45 Grand Bazaar Road', 'Madurai', 'Tamil Nadu', '625001', '33AABCA5678B1Z2', 200000.00, 48000.00, 'wholesale', 'active'),
(4, 'CUST-0004', 'Suresh Sundaram', '9884055667', 'suresh.sundar@gmail.com', 'Plot 88, Anna Nagar West', 'Chennai', 'Tamil Nadu', '600040', NULL, 25000.00, 0.00, 'retail', 'active'),
(5, 'CUST-0005', 'Divya Spiritual Centre', '9444077889', 'info@divyaspiritual.in', '78 Temple Road, Malleshwaram', 'Bengaluru', 'Karnataka', '560003', '29AABBD8899C1Z4', 100000.00, 12000.00, 'wholesale', 'active');

-- 10. SEED SUPPLIERS (Artisans & Foundries)
INSERT INTO `suppliers` (`id`, `supplier_code`, `name`, `company_name`, `mobile`, `email`, `address`, `city`, `state`, `gst_number`, `bank_name`, `bank_account_no`, `bank_ifsc`, `outstanding_balance`, `status`) VALUES
(1, 'SUP-0001', 'Master Sthapathi Balasubramanian', 'Swamimalai Heritage Bronze Foundry', '9443211223', 'balu@swamimalaiheritage.com', '14 Agraharam Street', 'Swamimalai', 'Tamil Nadu', '33AAAFS4567C1Z8', 'State Bank of India', '30291827364', 'SBIN0001234', 45000.00, 'active'),
(2, 'SUP-0002', 'Pandit Radheshyam Sharma', 'Jaipur Royal Marble Murti Art', '9829011223', 'sharma@jaipurmarblestatues.in', '22 Sculptor Colony, Sanganer', 'Jaipur', 'Rajasthan', '08AABCR1234D1Z9', 'HDFC Bank', '50200019283746', 'HDFC0000123', 68000.00, 'active'),
(3, 'SUP-0003', 'Kandasamy Bell Metal Guild', 'Nachiyar Kovil Brass Artisans Society', '9442088990', 'info@nachiyarkovilbrass.org', '78 Main Road', 'Nachiyar Kovil', 'Tamil Nadu', '33AAANB9876E1Z1', 'Indian Overseas Bank', '14230100001234', 'IOBA0001423', 22000.00, 'active'),
(4, 'SUP-0004', 'Dharmalingam Master Sculptor', 'Mahabalipuram Stone Art Heritage', '9840177665', 'dharmalingam@mahabsstone.com', '5 Beach Road', 'Mahabalipuram', 'Tamil Nadu', '33AABPD3344F1Z3', 'Canara Bank', '109827364512', 'CNRB0001098', 0.00, 'active');

-- 11. SEED ACCOUNTS (Chart of Accounts / Cash & Bank)
INSERT INTO `accounts` (`id`, `account_code`, `name`, `type`, `bank_name`, `account_number`, `ifsc_code`, `opening_balance`, `current_balance`, `status`) VALUES
(1, 'ACC-CASH-01', 'Showroom Main Cash Drawer', 'cash', NULL, NULL, NULL, 50000.00, 95400.00, 'active'),
(2, 'ACC-BANK-01', 'HDFC Current Account (Store Primary)', 'bank', 'HDFC Bank', '50200098765432', 'HDFC0000456', 250000.00, 482600.00, 'active'),
(3, 'ACC-BANK-02', 'SBI Merchant Current Account (UPI/Card)', 'bank', 'State Bank of India', '38927162534', 'SBIN0004567', 100000.00, 245800.00, 'active'),
(4, 'ACC-INC-01', 'Sales Revenue - God Statues', 'income', NULL, NULL, NULL, 0.00, 0.00, 'active'),
(5, 'ACC-INC-02', 'Sales Revenue - Pooja Items & Accessories', 'income', NULL, NULL, NULL, 0.00, 0.00, 'active'),
(6, 'ACC-EXP-01', 'General Store Operating Expenses', 'expense', NULL, NULL, NULL, 0.00, 0.00, 'active');

-- 12. SEED EXPENSE CATEGORIES
INSERT INTO `expense_categories` (`id`, `name`, `code`, `description`, `status`) VALUES
(1, 'Showroom Rent & Maintenance', 'EXP-RENT', 'Monthly building rent, electricity, air conditioning & maintenance', 'active'),
(2, 'Artisan Freight & Transport', 'EXP-FREIGHT', 'Safe logistics, wooden crates, and transit insurance for heavy idols', 'active'),
(3, 'Staff Salaries & Incentives', 'EXP-SALARY', 'Monthly staff wages, sales incentives, and festive bonuses', 'active'),
(4, 'Packing & Sacred Velvet Boxes', 'EXP-PACKING', 'Custom wooden boxes, bubble cushioning, and silk velvet lining', 'active'),
(5, 'Temple Pooja & Daily Aarti', 'EXP-POOJA', 'Daily flowers, camphor, sandal paste, and showroom consecrated rituals', 'active'),
(6, 'Marketing & Divine Catalog', 'EXP-MARKETING', 'Digital marketing, print catalogs, and religious exhibition stalls', 'active'),
(7, 'Miscellaneous Showroom Expenses', 'EXP-MISC', 'Office stationery, tea, snacks, and minor repairs', 'active');

-- 13. SEED SETTINGS
INSERT INTO `settings` (`id`, `setting_group`, `key_name`, `value`, `description`) VALUES
(1, 'company', 'company_name', 'Divya Murti & God Statue Heritage', 'Registered Enterprise Trade Name'),
(2, 'company', 'company_tagline', 'Sacred Idols, Panchaloha Bronzes & Temple Artifacts', 'Sub-heading on invoices and receipts'),
(3, 'company', 'company_address', '108 Sannidhi Square, Near Kapaleeshwarar Temple, Mylapore, Chennai - 600004', 'Physical showroom address'),
(4, 'company', 'company_phone', '+91 44 2464 1008 / +91 98401 12233', 'Store customer support lines'),
(5, 'company', 'company_email', 'contact@godstatueerp.com', 'Official correspondence email'),
(6, 'company', 'company_gstin', '33AABCG1234H1Z0', 'Registered Goods & Services Tax Identification Number'),
(7, 'billing', 'invoice_prefix', 'DIVYA-', 'Prefix for generated tax invoices'),
(8, 'billing', 'starting_invoice_no', '1001', 'Starting sequence number for sales invoices'),
(9, 'billing', 'default_gst_percent', '12', 'Default GST tax rate percentage'),
(10, 'billing', 'currency_symbol', '₹', 'Currency Symbol for display and receipts'),
(11, 'billing', 'currency_code', 'INR', 'Currency Code ISO 4217'),
(12, 'billing', 'enable_roundoff', '1', 'Automatically round-off invoice grand total'),
(13, 'print', 'invoice_paper_size', 'A4', 'Default invoice layout (A4 / Thermal-80mm / Thermal-58mm)'),
(14, 'print', 'thermal_paper_width', '80mm', 'POS thermal receipt width'),
(15, 'print', 'invoice_footer_note', 'All idols are handcrafted and casted in accordance with Shilpa Shastra. Consecrated with holy mantras.', 'Invoice footer blessing'),
(16, 'print', 'terms_conditions', '1. Goods once sold can only be returned in unbroken condition within 7 days.\n2. 100% replacement guarantee for manufacturing casting defects.\n3. Subject to Chennai Jurisdiction only.', 'Standard terms printed on invoices'),
(17, 'system', 'timezone', 'Asia/Kolkata', 'System Default Timezone'),
(18, 'system', 'date_format', 'd-m-Y', 'Visual Date Display Format'),
(19, 'system', 'items_per_page', '15', 'Default server-side pagination rows');

-- 14. SEED SAMPLE INVOICE & INVENTORY TRANSACTIONS
-- Initial stock intake logs
INSERT INTO `inventory_transactions` (`product_id`, `transaction_type`, `reference_type`, `reference_no`, `previous_stock`, `quantity`, `new_stock`, `notes`, `user_id`) VALUES
(1, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 8, 8, 'Opening stock count verified', 1),
(2, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 5, 5, 'Opening stock count verified', 1),
(3, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 12, 12, 'Opening stock count verified', 1),
(4, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 6, 6, 'Opening stock count verified', 1),
(5, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 10, 10, 'Opening stock count verified', 1),
(6, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 4, 4, 'Opening stock count verified', 1),
(7, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 15, 15, 'Opening stock count verified', 1),
(8, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 7, 7, 'Opening stock count verified', 1),
(9, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 9, 9, 'Opening stock count verified', 1),
(10, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 25, 25, 'Opening stock count verified', 1),
(11, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 11, 11, 'Opening stock count verified', 1),
(12, 'stock_in', 'opening_stock', 'INIT-2026-001', 0, 18, 18, 'Opening stock count verified', 1);

-- Sample Invoice 1
INSERT INTO `invoices` (`id`, `invoice_no`, `customer_id`, `user_id`, `invoice_date`, `invoice_time`, `subtotal`, `item_discount_total`, `overall_discount_percent`, `overall_discount_amount`, `cgst_amount`, `sgst_amount`, `igst_amount`, `tax_amount`, `round_off`, `grand_total`, `paid_amount`, `due_amount`, `payment_method`, `status`, `payment_status`, `notes`) VALUES
(1, 'DIVYA-1001', 4, 4, CURDATE(), '11:30:00', 22100.00, 0.00, 5.00, 1105.00, 1259.70, 1259.70, 0.00, 2519.40, -0.40, 23514.00, 23514.00, 0.00, 'upi', 'completed', 'paid', 'Housewarming purchase - packing in sacred red velvet box');

INSERT INTO `invoice_items` (`invoice_id`, `product_id`, `product_name`, `product_code`, `god_name`, `material`, `hsn_code`, `quantity`, `unit_price`, `discount_percent`, `discount_amount`, `tax_percent`, `tax_amount`, `total_amount`) VALUES
(1, 1, 'Antique Brass Royal Ganesha 18 Inch', 'PRD-GAN-001', 'Lord Ganesha', 'Brass', '9701', 1, 18900.00, 5.00, 945.00, 12.00, 2154.60, 20109.60),
(1, 10, 'Royal Brass Pooja Thali Set (9 Items Included)', 'PRD-THL-010', 'Pooja Set', 'Brass', '9701', 1, 3200.00, 0.00, 0.00, 12.00, 384.00, 3584.00);

-- Payment entry for Invoice 1
INSERT INTO `payments` (`payment_no`, `payment_type`, `account_id`, `customer_id`, `invoice_id`, `amount`, `payment_method`, `transaction_reference`, `payment_date`, `notes`, `user_id`) VALUES
('PAY-2026-001', 'customer_payment', 3, 4, 1, 23514.00, 'upi', 'UPI/20260829/987162534', CURDATE(), 'POS Billing DIVYA-1001', 4);

-- Audit log seed
INSERT INTO `activity_logs` (`user_id`, `action`, `module`, `reference_code`, `description`, `ip_address`, `user_agent`) VALUES
(1, 'system_init', 'auth', 'SYSTEM', 'System database initialized with god statue catalog and role matrices', '127.0.0.1', 'CLI Installer');

SET FOREIGN_KEY_CHECKS = 1;
