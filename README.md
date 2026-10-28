# Divya Murti - Enterprise God Statue ERP & POS System

An enterprise-grade, high-performance web application designed for God Statue, Idol, and Religious Products Wholesale & Retail Enterprises.

---

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, FontAwesome 6, Chart.js
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Database**: MongoDB Atlas (`billing`) with Local MongoDB fallback
- **Endpoints**: Frontend `http://localhost:5173`, Backend API `http://localhost:5000`

---

## Key Features

1. **Sacred POS Billing Terminal**:
   - Ultra-fast sub-300ms product and deity searches
   - Barcode scanner integration (press Enter or barcode auto-read)
   - Multi-mode payment support: Cash, UPI, Card, Bank Transfer, and Ledger Credit
   - Suspend & Resume bills (Multiple held carts in local storage)
   - Instant A4 GST Tax Invoices and 80mm/58mm thermal receipts
   - Dynamic item and overall discounts with automatic CGST + SGST / IGST tax calculation and round-off

2. **God Statue & Idol Catalog**:
   - Specifications: Metal composition (Brass, Panchaloha, Marble, Black Stone, Bronze, Teak Wood), Height, Width, Depth, Net Weight, Finish Type (Antique, 24K Gold Plated, Glossy, Matte, Natural)
   - Low-stock threshold alerts
   - Barcode & SKU tracking
   - CSV / Excel catalog export

3. **Customer Invoices Register & Pagination**:
   - Full server-side pagination (10, 20, 50, 100 per page)
   - Numeric page controls, jumping, and smart pagination ellipsis
   - Comprehensive filters (Sales mode, payment status, payment method, date range)
   - Real-time KPI aggregation metrics (Total Sales, Total Paid, Outstanding Due Balance)

4. **Inventory & Stock Audit Control**:
   - Strict transaction ledger (`inventory_transactions`)
   - Stock in, stock adjustments, damage write-offs, and movement histories
   - No direct stock mutations without an audit trail

5. **Accounts & Financials**:
   - Cash Book & Bank Book registers (HDFC, SBI merchant accounts)
   - Customer collection receipts & ledger accounts
   - Artisan foundry disbursement vouchers
   - Expense vouchers with approval workflows
   - Real-time P&L Statement and Gross/Net margins

6. **Customer & Artisan CRM**:
   - Retail walk-in, wholesale distributors, and temple devasthanams
   - Credit limit validation and outstanding balances
   - Sourcing purchase orders with automatic stocking upon approval

7. **Security & Role Permissions**:
   - Granular permissions (view, create, edit, delete, export, print, approve, cancel)
   - Dynamic sidebar menus and strict backend middleware protection
   - Complete forensic audit trail (`activity_logs`)

---

## Default Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `admin123` |
| **Store Admin** | `rajesh` | `admin123` |
| **Billing Head** | `anand` | `admin123` |
| **POS Cashier** | `priya` | `admin123` |
| **Chief Accountant** | `venkatesh` | `admin123` |
| **Warehouse Lead** | `murugan` | `admin123` |

---

## Getting Started

1. **Start both Server & Client**:
   ```bash
   npm run dev
   ```
2. **Start Backend Server only**:
   ```bash
   npm run dev:server
   ```
3. **Start React Client only**:
   ```bash
   npm run dev:client
   ```
4. **Build Production Client**:
   ```bash
   npm run build
   ```
