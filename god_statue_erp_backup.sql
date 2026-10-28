-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: god_statue_erp
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_transactions`
--

DROP TABLE IF EXISTS `account_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_transactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(10) unsigned NOT NULL,
  `transaction_type` enum('debit','credit') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `balance_after` decimal(12,2) NOT NULL,
  `reference_type` varchar(50) NOT NULL COMMENT 'invoice, purchase, payment, expense, sales_return, adjustment',
  `reference_id` int(10) unsigned DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `transaction_date` date NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_acc_tx_date` (`transaction_date`),
  CONSTRAINT `account_transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `account_transactions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_transactions`
--

LOCK TABLES `account_transactions` WRITE;
/*!40000 ALTER TABLE `account_transactions` DISABLE KEYS */;
INSERT INTO `account_transactions` VALUES (1,1,'debit',27054.00,122454.00,'invoice',2,'DIVYA-1002','Sales receipt DIVYA-1002','2026-08-30',1,'2026-08-30 07:50:10'),(2,2,'debit',60329.00,542929.00,'invoice',3,'DIVYA-1003','Sales receipt DIVYA-1003','2026-09-11',1,'2026-09-11 04:48:48'),(3,1,'debit',5599.00,128053.00,'invoice',4,'DIVYA-1004','Sales receipt DIVYA-1004','2026-09-25',1,'2026-09-25 07:56:49'),(4,1,'debit',6944.00,134997.00,'invoice',5,'DIVYA-1005','Sales receipt DIVYA-1005','2026-09-25',1,'2026-09-25 08:00:53'),(5,1,'debit',5599.00,140596.00,'invoice',6,'DIVYA-1006','Sales receipt DIVYA-1006','2026-09-25',1,'2026-09-25 08:04:53'),(6,1,'debit',5599.00,146195.00,'invoice',7,'DIVYA-1007','Sales receipt DIVYA-1007','2026-09-25',1,'2026-09-25 08:10:51'),(7,1,'debit',5599.00,151794.00,'invoice',8,'DIVYA-1008','Sales receipt DIVYA-1008','2026-09-25',4,'2026-09-25 08:16:06'),(8,1,'debit',5599.00,157393.00,'invoice',9,'DIVYA-1009','Sales receipt DIVYA-1009','2026-09-25',4,'2026-09-25 08:20:25'),(9,1,'debit',6944.00,164337.00,'invoice',10,'DIVYA-1010','Sales receipt DIVYA-1010','2026-09-25',4,'2026-09-25 08:25:12'),(10,1,'debit',5599.00,169936.00,'invoice',11,'DIVYA-1011','Sales receipt DIVYA-1011','2026-09-25',4,'2026-09-25 08:36:41'),(11,1,'debit',5599.00,175535.00,'invoice',12,'DIVYA-1012','Sales receipt DIVYA-1012','2026-09-25',4,'2026-09-25 08:49:39'),(12,1,'debit',5599.00,181134.00,'invoice',13,'DIVYA-1013','Sales receipt DIVYA-1013','2026-09-25',4,'2026-09-25 08:50:03'),(13,1,'debit',5599.00,186733.00,'invoice',14,'DIVYA-1014','Sales receipt DIVYA-1014','2026-09-25',4,'2026-09-25 08:57:21'),(14,1,'debit',5599.00,192332.00,'invoice',15,'DIVYA-1015','Sales receipt DIVYA-1015','2026-09-25',4,'2026-09-25 09:12:46'),(15,1,'debit',5599.00,197931.00,'invoice',16,'DIVYA-1016','Sales receipt DIVYA-1016','2026-09-25',4,'2026-09-25 09:16:53'),(16,1,'debit',5599.00,203530.00,'invoice',17,'DIVYA-1017','Sales receipt DIVYA-1017','2026-09-25',4,'2026-09-25 09:22:14'),(17,1,'debit',10976.00,214506.00,'invoice',18,'DIVYA-1018','Sales receipt DIVYA-1018','2026-10-06',1,'2026-10-06 13:49:06'),(18,1,'debit',5599.00,220105.00,'invoice',19,'DIVYA-1019','Sales receipt DIVYA-1019','2026-10-06',1,'2026-10-06 13:49:48'),(19,1,'debit',5599.00,225704.00,'invoice',20,'DIVYA-1020','Sales receipt DIVYA-1020','2026-10-06',1,'2026-10-06 13:50:03'),(20,1,'debit',5599.00,231303.00,'invoice',21,'DIVYA-1021','Sales receipt DIVYA-1021','2026-10-06',1,'2026-10-06 13:53:17'),(21,1,'debit',100.00,231403.00,'invoice',32,'INV-2026-0011','Sales receipt INV-2026-0011','2026-10-12',1,'2026-10-12 08:58:20'),(22,1,'debit',100.00,231503.00,'invoice',33,'INV-2026-0012','Sales receipt INV-2026-0012','2026-10-12',1,'2026-10-12 08:58:46'),(23,1,'debit',550.00,232053.00,'invoice',34,'INV-2026-0012','Sales receipt INV-2026-0012','2026-10-12',1,'2026-10-12 09:53:15'),(24,1,'debit',200.00,232253.00,'invoice',35,'INV-2026-0012','Sales receipt INV-2026-0012','2026-10-12',1,'2026-10-12 09:54:24'),(25,1,'debit',8960.00,241213.00,'invoice',37,'INV-2026-0012','Sales receipt INV-2026-0012','2026-10-12',1,'2026-10-12 09:56:09'),(26,1,'debit',3264.00,244477.00,'invoice',38,'INV-2026-0013','Sales receipt INV-2026-0013','2026-10-12',1,'2026-10-12 11:48:22'),(27,1,'debit',3584.00,248061.00,'invoice',39,'INV-2026-0014','Sales receipt INV-2026-0014','2026-10-12',1,'2026-10-12 11:49:17'),(28,1,'debit',3320.00,251381.00,'invoice',40,'INV-2026-0015','Sales receipt INV-2026-0015','2026-10-12',1,'2026-10-12 11:57:52'),(29,1,'debit',3584.00,254965.00,'invoice',41,'INV-2026-0015','Sales receipt INV-2026-0015','2026-10-12',1,'2026-10-12 11:59:41'),(30,1,'debit',8960.00,263925.00,'invoice',42,'INV-2026-0016','Sales receipt INV-2026-0016','2026-10-12',1,'2026-10-12 12:28:02'),(31,1,'debit',3584.00,267509.00,'invoice',43,'INV-2026-0017','Sales receipt INV-2026-0017','2026-10-12',1,'2026-10-12 12:34:54'),(32,1,'debit',3584.00,271093.00,'invoice',44,'INV-2026-0018','Sales receipt INV-2026-0018','2026-10-12',1,'2026-10-12 12:39:22'),(33,1,'debit',3584.00,274677.00,'invoice',45,'INV-2026-0019','Sales receipt INV-2026-0019','2026-10-12',1,'2026-10-12 12:40:22'),(34,1,'debit',2950.00,277627.00,'invoice',46,'INV-2026-0020','Sales receipt INV-2026-0020','2026-10-12',1,'2026-10-12 12:42:48'),(35,1,'debit',2950.00,280577.00,'invoice',47,'INV-2026-0021','Sales receipt INV-2026-0021','2026-10-12',1,'2026-10-12 12:47:54'),(36,1,'debit',2950.00,283527.00,'invoice',48,'INV-2026-0022','Sales receipt INV-2026-0022','2026-10-12',1,'2026-10-12 12:48:46'),(37,1,'debit',1920.00,285447.00,'invoice',49,'INV-2026-0023','Sales receipt INV-2026-0023','2026-10-12',1,'2026-10-12 17:02:09'),(38,1,'debit',2560.00,288007.00,'invoice',50,'INV-2026-0024','Sales receipt INV-2026-0024','2026-10-12',1,'2026-10-12 17:49:03'),(39,1,'debit',1920.00,289927.00,'invoice',51,'INV-2026-0025','Sales receipt INV-2026-0025','2026-10-12',1,'2026-10-12 17:52:39'),(40,1,'debit',1920.00,291847.00,'invoice',52,'INV-2026-0026','Sales receipt INV-2026-0026','2026-10-12',1,'2026-10-12 17:54:34'),(41,1,'debit',72800.00,364647.00,'invoice',53,'INV-2026-0027','Sales receipt INV-2026-0027','2026-10-12',1,'2026-10-12 17:55:07'),(42,1,'debit',72800.00,437447.00,'invoice',54,'INV-2026-0028','Sales receipt INV-2026-0028','2026-10-12',1,'2026-10-12 17:55:25'),(43,1,'debit',72800.00,510247.00,'invoice',55,'INV-2026-0029','Sales receipt INV-2026-0029','2026-10-12',1,'2026-10-12 17:58:33'),(44,1,'debit',72800.00,583047.00,'invoice',56,'INV-2026-0030','Sales receipt INV-2026-0030','2026-10-12',1,'2026-10-12 17:59:28'),(45,1,'debit',8960.00,592007.00,'invoice',57,'INV-2026-0031','Sales receipt INV-2026-0031','2026-10-12',1,'2026-10-12 18:13:37');
/*!40000 ALTER TABLE `account_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `account_code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('cash','bank','income','expense','asset','liability','equity') NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `opening_balance` decimal(12,2) DEFAULT 0.00,
  `current_balance` decimal(12,2) DEFAULT 0.00,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_code` (`account_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'ACC-CASH-01','Showroom Main Cash Drawer','cash',NULL,NULL,NULL,50000.00,592007.00,'active','2026-08-29 16:51:09','2026-10-12 18:13:37'),(2,'ACC-BANK-01','HDFC Current Account (Store Primary)','bank','HDFC Bank','50200098765432','HDFC0000456',250000.00,542929.00,'active','2026-08-29 16:51:09','2026-09-11 04:48:48'),(3,'ACC-BANK-02','SBI Merchant Current Account (UPI/Card)','bank','State Bank of India','38927162534','SBIN0004567',100000.00,245800.00,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(4,'ACC-INC-01','Sales Revenue - God Statues','income',NULL,NULL,NULL,0.00,0.00,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(5,'ACC-INC-02','Sales Revenue - Pooja Items & Accessories','income',NULL,NULL,NULL,0.00,0.00,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(6,'ACC-EXP-01','General Store Operating Expenses','expense',NULL,NULL,NULL,0.00,0.00,'active','2026-08-29 16:51:09','2026-08-29 16:51:09');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `action` varchar(100) NOT NULL COMMENT 'login, logout, create, update, delete, approve, cancel, print',
  `module` varchar(100) NOT NULL COMMENT 'auth, users, products, billing, inventory, accounts, purchases',
  `reference_id` int(10) unsigned DEFAULT NULL,
  `reference_code` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_act_module` (`module`),
  KEY `idx_act_user` (`user_id`),
  KEY `idx_act_date` (`created_at`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'system_init','auth',NULL,'SYSTEM','System database initialized with god statue catalog and role matrices','127.0.0.1','CLI Installer','2026-08-29 16:51:09'),(2,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','2026-08-30 07:33:33'),(3,1,'create','billing',2,'DIVYA-1002','Generated invoice DIVYA-1002 for ₹27,054.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','2026-08-30 07:50:10'),(4,1,'adjust','inventory',11,NULL,'Adjusted stock for product #11 by -5 units (damage)','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','2026-08-30 07:56:26'),(5,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','2026-09-11 04:45:48'),(6,1,'create','billing',3,'DIVYA-1003','Generated invoice DIVYA-1003 for ₹60,329.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','2026-09-11 04:48:48'),(7,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0','2026-09-24 07:39:08'),(8,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 07:40:50'),(9,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 08:08:21'),(10,NULL,'login','auth',7,'cashier','User Store Cashier logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 08:13:09'),(11,NULL,'logout','auth',7,'cashier','User Store Cashier logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 09:16:50'),(12,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 09:16:53'),(13,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 09:20:11'),(14,NULL,'login','auth',7,'cashier','User Store Cashier logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 09:20:23'),(15,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 13:46:10'),(16,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 13:51:34'),(17,NULL,'login','auth',8,'warehousemanager','User Warehouse Manager logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 13:55:20'),(18,NULL,'logout','auth',8,'warehousemanager','User Warehouse Manager logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:06:47'),(19,NULL,'login','auth',10,'accountant','User Accountant logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:06:58'),(20,NULL,'logout','auth',10,'accountant','User Accountant logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:29:36'),(21,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:29:38'),(22,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:44:54'),(23,5,'login','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:45:01'),(24,5,'logout','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:49:34'),(25,3,'login','auth',3,'anand','User Anand Kumar (Billing Head) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:49:40'),(26,3,'logout','auth',3,'anand','User Anand Kumar (Billing Head) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:50:08'),(27,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:50:13'),(28,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:56:14'),(29,6,'login','auth',6,'murugan','User Muruganathan (Warehouse Lead) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:56:21'),(30,6,'logout','auth',6,'murugan','User Muruganathan (Warehouse Lead) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:58:30'),(31,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 14:58:33'),(32,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:15:33'),(33,5,'login','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:15:57'),(34,5,'logout','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:16:41'),(35,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:16:45'),(36,1,'update','users',5,'venkatesh','Updated custom permissions for user Venkatesh Iyer (Chief Accountant)','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:17:18'),(37,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:17:24'),(38,5,'login','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:17:28'),(39,5,'logout','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:18:05'),(40,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:18:13'),(41,1,'update','users',5,'venkatesh','Updated custom permissions for user Venkatesh Iyer (Chief Accountant)','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:18:35'),(42,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:18:42'),(43,5,'login','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-24 15:18:46'),(44,5,'login','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 06:44:49'),(45,5,'logout','auth',5,'venkatesh','User Venkatesh Iyer (Chief Accountant) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 07:56:26'),(46,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 07:56:29'),(47,1,'create','billing',4,'DIVYA-1004','Generated invoice DIVYA-1004 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 07:56:49'),(48,1,'create','billing',5,'DIVYA-1005','Generated invoice DIVYA-1005 for ₹6,944.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:00:53'),(49,1,'create','billing',6,'DIVYA-1006','Generated invoice DIVYA-1006 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:04:53'),(50,1,'create','billing',7,'DIVYA-1007','Generated invoice DIVYA-1007 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:10:52'),(51,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:15:13'),(52,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:15:20'),(53,4,'create','billing',8,'DIVYA-1008','Generated invoice DIVYA-1008 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:16:06'),(54,4,'create','billing',9,'DIVYA-1009','Generated invoice DIVYA-1009 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:20:25'),(55,4,'create','billing',10,'DIVYA-1010','Generated invoice DIVYA-1010 for ₹6,944.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:25:12'),(56,4,'create','billing',11,'DIVYA-1011','Generated invoice DIVYA-1011 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:36:41'),(57,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:39:49'),(58,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:39:53'),(59,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:48:39'),(60,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:48:44'),(61,4,'create','billing',12,'DIVYA-1012','Generated invoice DIVYA-1012 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:49:39'),(62,4,'create','billing',13,'DIVYA-1013','Generated invoice DIVYA-1013 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:50:03'),(63,4,'create','billing',14,'DIVYA-1014','Generated invoice DIVYA-1014 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 08:57:21'),(64,4,'create','billing',15,'DIVYA-1015','Generated invoice DIVYA-1015 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 09:12:46'),(65,4,'create','billing',16,'DIVYA-1016','Generated invoice DIVYA-1016 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 09:16:53'),(66,4,'create','billing',17,'DIVYA-1017','Generated invoice DIVYA-1017 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 09:22:14'),(67,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-25 09:22:35'),(68,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','2026-09-29 06:40:54'),(69,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-09-30 17:55:33'),(70,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-02 05:50:23'),(71,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-05 11:45:05'),(72,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:04:57'),(73,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:05:15'),(74,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:05:18'),(75,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:06:05'),(76,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:06:47'),(77,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:13:03'),(78,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:13:10'),(79,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:18:33'),(80,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 12:18:40'),(81,4,'login','auth',4,'priya','User Priya Sundaram (POS Cashier) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:46:51'),(82,4,'logout','auth',4,'priya','User Priya Sundaram (POS Cashier) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:47:14'),(83,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:47:17'),(84,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:48:16'),(85,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:48:25'),(86,1,'create','billing',18,'DIVYA-1018','Generated invoice DIVYA-1018 for ₹10,976.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:49:06'),(87,1,'create','billing',19,'DIVYA-1019','Generated invoice DIVYA-1019 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:49:48'),(88,1,'create','billing',20,'DIVYA-1020','Generated invoice DIVYA-1020 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:50:03'),(89,1,'create','billing',21,'DIVYA-1021','Generated invoice DIVYA-1021 for ₹5,599.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 13:53:17'),(90,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 14:10:57'),(91,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 14:11:11'),(92,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-06 14:14:56'),(93,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-07 06:04:37'),(94,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-07 15:50:21'),(95,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-07 17:47:22'),(96,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 10:18:45'),(97,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 10:20:16'),(98,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 11:09:03'),(99,1,'logout','auth',1,'superadmin','User Shree Mahadev (System Master) logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 11:11:29'),(100,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 11:17:42'),(101,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 22:15:56'),(102,1,'create','catalog',1,'CAT-STA-5049','Created category statue','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 22:16:51'),(103,1,'create','catalog',1,'SUB-SHI-7569','Created subcategory shiva','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-10 22:17:22'),(104,1,'create','catalog',2,'CAT-PIE-8551','Created category piece','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 08:20:06'),(105,1,'create','catalog',2,'SUB-CHE-6357','Created subcategory chemical','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 08:20:30'),(106,1,'create','catalog',3,'CAT-HIN-8039','Created category hindu god','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 08:38:29'),(107,1,'create','catalog',3,'SUB-HIN-5856','Created subcategory hindu','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 08:38:43'),(108,1,'delete','catalog',3,'CAT-HIN-8039','Deleted category hindu god','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 08:45:31'),(109,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 15:55:59'),(110,1,'create','catalog',1,'CAT-HIN-3838','Created category hindu','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 15:57:07'),(111,1,'create','catalog',1,'SUB-LOR-1672','Created subcategory lord ganesh','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 15:57:22'),(112,1,'create','products',2,'SKU-21011','Added 1 product(s) under supplier Artisan Sthapathi 709','127.0.0.1','Unknown','2026-10-11 16:43:45'),(113,1,'create','products',3,'SKU-19581','Added 1 product(s) under supplier Artisan Test 3','127.0.0.1','Unknown','2026-10-11 16:44:59'),(114,1,'create','products',4,'SKU-94843','Added 2 product(s) under supplier Artisan Test 4','127.0.0.1','Unknown','2026-10-11 16:44:59'),(115,1,'create','suppliers',5,'SUP-0005','Added supplier/artisan Swamimalai Bronze Foundry with 1 products','127.0.0.1','Unknown','2026-10-11 16:44:59'),(116,1,'create','products',7,'SKU-43423','Added 1 product(s) under supplier Existing Supplier Test 6','127.0.0.1','Unknown','2026-10-11 16:44:59'),(117,1,'create','suppliers',7,'SUP-0007','Added supplier/artisan Joel with 1 products','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 16:48:22'),(118,1,'create','suppliers',8,'SUP-0008','Added supplier/artisan Test Artisan Supplier with 1 products','127.0.0.1','Unknown','2026-10-11 17:43:06'),(119,1,'create','suppliers',9,'SUP-0009','Added supplier/artisan Kumbakonam Wood Crafts with 1 products','127.0.0.1','Unknown','2026-10-11 17:53:32'),(120,1,'create','products',11,'SKU-38619','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:54:28'),(121,1,'create','products',12,'SKU-31090','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:55:15'),(122,1,'create','suppliers',10,'SUP-0010','Added supplier/artisan Kumbakonam Wood Crafts with 1 products','127.0.0.1','Unknown','2026-10-11 17:58:19'),(123,1,'create','suppliers',11,'SUP-0011','Added supplier/artisan Kumbakonam Wood Crafts with 1 products','127.0.0.1','Unknown','2026-10-11 17:59:03'),(124,1,'create','products',15,'SKU-23347','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:59:03'),(125,1,'create','products',16,'SKU-60927','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:59:03'),(126,1,'create','suppliers',12,'SUP-0012','Added supplier/artisan Kumbakonam Wood Crafts with 1 products','127.0.0.1','Unknown','2026-10-11 17:59:37'),(127,1,'create','products',18,'SKU-45754','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:59:38'),(128,1,'create','products',19,'SKU-60493','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 17:59:38'),(129,1,'create','suppliers',13,'SUP-0013','Added supplier/artisan ajay with 1 products','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 18:02:35'),(130,1,'create','suppliers',14,'SUP-0014','Added supplier/artisan Kumbakonam Wood Crafts with 1 products','127.0.0.1','Unknown','2026-10-11 18:12:21'),(131,1,'create','products',22,'SKU-36579','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 18:12:21'),(132,1,'create','products',23,'SKU-43562','Added 1 product(s) under supplier Kumbakonam Wood Crafts','127.0.0.1','Unknown','2026-10-11 18:12:21'),(133,1,'create','suppliers',15,'SUP-0015','Added supplier/artisan godson with 1 products','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 18:14:41'),(134,1,'create','catalog',14,'CAT-UNI-7775','Created category Unique AAH','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 18:16:28'),(135,1,'create','catalog',14,'SUB-LOY-7587','Created subcategory loyola','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 18:16:37'),(136,1,'create','suppliers',16,'SUP-0016','Added supplier/artisan amal with 1 products','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 18:17:06'),(137,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-11 19:21:49'),(138,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 05:38:21'),(139,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Unknown','2026-10-12 06:24:56'),(140,1,'update','suppliers',1,'SUP-0001','Updated payment for Darvin: Status Paid, Paid ₹0','::1','Unknown','2026-10-12 06:24:57'),(141,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Unknown','2026-10-12 06:26:22'),(142,1,'update','suppliers',1,'SUP-0001','Updated payment for Darvin: Status Paid, Paid ₹0','::1','Unknown','2026-10-12 06:26:22'),(143,1,'update','suppliers',16,'SUP-0016','Updated payment for amal: Status Paid, Paid ₹250000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:29:29'),(144,1,'update','suppliers',15,'SUP-0015','Updated payment for godson: Status Paid, Paid ₹200000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:29:44'),(145,1,'update','suppliers',14,'SUP-0014','Updated payment for Kumbakonam Wood Crafts: Status Paid, Paid ₹85000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:29:58'),(146,1,'update','suppliers',13,'SUP-0013','Updated payment for ajay: Status Paid, Paid ₹45000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:30:11'),(147,1,'update','suppliers',12,'SUP-0012','Updated payment for Kumbakonam Wood Crafts: Status Paid, Paid ₹85000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:30:25'),(148,1,'update','suppliers',11,'SUP-0011','Updated payment for Kumbakonam Wood Crafts: Status Paid, Paid ₹85000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:30:35'),(149,1,'update','suppliers',10,'SUP-0010','Updated payment for Kumbakonam Wood Crafts: Status Paid, Paid ₹45000','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 06:30:45'),(150,1,'create','suppliers',31,'SUP-0019','Added supplier/artisan Endpoint Test Supplier with 1 products. Status: Partially Paid','127.0.0.1','Unknown','2026-10-12 08:01:16'),(151,1,'create','suppliers',32,'SUP-0020','Added supplier/artisan Complete Action Test Supplier with 1 products. Status: Partially Paid','127.0.0.1','Unknown','2026-10-12 08:06:07'),(152,1,'update','suppliers',32,'SUP-0020','Updated supplier/artisan Complete Action Test Supplier UPDATED with 1 products. Status: Paid','127.0.0.1','Unknown','2026-10-12 08:06:07'),(153,1,'delete','suppliers',32,'SUP-0020','Deleted supplier Complete Action Test Supplier UPDATED','127.0.0.1','Unknown','2026-10-12 08:06:08'),(154,1,'create','suppliers',33,'SUP-0017','Added supplier/artisan jeami with 1 products. Status: Paid','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 08:08:59'),(155,1,'create','suppliers',35,'SUP-0018','Added supplier/artisan Full E2E Supplier 1791793848 with 3 products. Status: Paid','127.0.0.1','Unknown','2026-10-12 08:30:48'),(156,1,'create','billing',33,'INV-2026-0012','Generated invoice INV-2026-0012 for ₹550.00','127.0.0.1','Unknown','2026-10-12 08:58:46'),(157,1,'create','suppliers',36,'SUP-0018','Added supplier/artisan MultiPay Artisan 1791797179 with 2 products. Status: Paid','127.0.0.1','Unknown','2026-10-12 09:26:20'),(158,1,'create','billing',34,'INV-2026-0012','Generated invoice INV-2026-0012 for ₹550.00','127.0.0.1','Unknown','2026-10-12 09:53:15'),(159,1,'create','billing',35,'INV-2026-0012','Generated invoice INV-2026-0012 for ₹550.00','127.0.0.1','Unknown','2026-10-12 09:54:24'),(160,1,'create','billing',36,'INV-2026-0012','Generated invoice INV-2026-0012 for ₹550.00','127.0.0.1','Unknown','2026-10-12 09:54:48'),(161,1,'create','billing',37,'INV-2026-0012','Generated invoice INV-2026-0012 for ₹8,960.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 09:56:09'),(162,1,'create','billing',38,'INV-2026-0013','Generated invoice INV-2026-0013 for ₹3,264.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 11:48:22'),(163,1,'create','billing',39,'INV-2026-0014','Generated invoice INV-2026-0014 for ₹3,584.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 11:49:17'),(164,1,'create','billing',40,'INV-2026-0015','Generated invoice INV-2026-0015 for ₹3,320.00','127.0.0.1','Unknown','2026-10-12 11:57:52'),(165,1,'create','billing',41,'INV-2026-0015','Generated invoice INV-2026-0015 for ₹3,584.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 11:59:41'),(166,1,'create','billing',42,'INV-2026-0016','Generated invoice INV-2026-0016 for ₹8,960.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:28:02'),(167,1,'create','billing',43,'INV-2026-0017','Generated invoice INV-2026-0017 for ₹3,584.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:34:54'),(168,1,'create','billing',44,'INV-2026-0018','Generated invoice INV-2026-0018 for ₹3,584.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:39:22'),(169,1,'create','billing',45,'INV-2026-0019','Generated invoice INV-2026-0019 for ₹3,584.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:40:22'),(170,1,'create','billing',46,'INV-2026-0020','Generated invoice INV-2026-0020 for ₹2,950.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:42:48'),(171,1,'create','billing',47,'INV-2026-0021','Generated invoice INV-2026-0021 for ₹2,950.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:47:54'),(172,1,'create','billing',48,'INV-2026-0022','Generated invoice INV-2026-0022 for ₹2,950.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 12:48:46'),(173,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:01:26'),(174,1,'create','billing',49,'INV-2026-0023','Generated invoice INV-2026-0023 for ₹1,920.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:02:09'),(175,1,'create','billing',50,'INV-2026-0024','Generated invoice INV-2026-0024 for ₹2,560.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:49:03'),(176,1,'create','billing',51,'INV-2026-0025','Generated invoice INV-2026-0025 for ₹1,920.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:52:39'),(177,1,'login','auth',1,'superadmin','User Shree Mahadev (System Master) logged in successfully','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:54:26'),(178,1,'create','billing',52,'INV-2026-0026','Generated invoice INV-2026-0026 for ₹1,920.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:54:34'),(179,1,'create','billing',53,'INV-2026-0027','Generated invoice INV-2026-0027 for ₹72,800.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:55:07'),(180,1,'create','billing',54,'INV-2026-0028','Generated invoice INV-2026-0028 for ₹72,800.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:55:25'),(181,1,'create','billing',55,'INV-2026-0029','Generated invoice INV-2026-0029 for ₹72,800.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:58:33'),(182,1,'create','billing',56,'INV-2026-0030','Generated invoice INV-2026-0030 for ₹72,800.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 17:59:28'),(183,1,'create','billing',57,'INV-2026-0031','Generated invoice INV-2026-0031 for ₹8,960.00','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','2026-10-12 18:13:37');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'hindu','CAT-HIN-3838','',NULL,'active','2026-10-11 15:57:07','2026-10-11 15:57:07'),(2,'Test Deities 9395','CAT-TES-2087','',NULL,'active','2026-10-11 16:43:45','2026-10-11 16:43:45'),(3,'Brass Statues 130','CAT-BRA-8397','',NULL,'active','2026-10-11 16:44:58','2026-10-11 16:44:58'),(4,'Temple Idols 788','CAT-TEM-4562','',NULL,'active','2026-10-11 16:44:58','2026-10-11 16:44:58'),(5,'Statues','CAT-STA-9969','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(6,'Accessories','CAT-ACC-1146','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(7,'Bronze Masterpieces','CAT-BRO-5087','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(8,'General','CAT-GEN-6732','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(9,'Unique Cat A 569','CAT-UNI-8658','',NULL,'active','2026-10-11 16:45:00','2026-10-11 16:45:00'),(10,'Unique Cat B 795','CAT-UNI-3378','',NULL,'active','2026-10-11 16:45:00','2026-10-11 16:45:00'),(11,'Fixed Category Name 342','CAT-FIX-5454','',NULL,'active','2026-10-11 16:45:00','2026-10-11 16:45:00'),(12,'Temple Furnishings','CAT-TEM-6003','',NULL,'active','2026-10-11 17:53:32','2026-10-11 17:53:32'),(13,'Sacred Bells','CAT-SAC-6229','',NULL,'active','2026-10-11 17:54:28','2026-10-11 17:54:28'),(14,'Unique AAH','CAT-UNI-7775','',NULL,'active','2026-10-11 18:16:28','2026-10-11 18:16:28'),(15,'sik','CAT-SIK-3805','',NULL,'active','2026-10-12 08:08:59','2026-10-12 08:08:59');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customer_code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT 'Tamil Nadu',
  `state_code` varchar(10) DEFAULT '33',
  `pincode` varchar(20) DEFAULT NULL,
  `gst_number` varchar(30) DEFAULT NULL,
  `credit_limit` decimal(12,2) DEFAULT 0.00,
  `outstanding_balance` decimal(12,2) DEFAULT 0.00,
  `customer_type` enum('retail','wholesale','temple_trust') DEFAULT 'retail',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_code` (`customer_code`),
  KEY `idx_cust_mobile` (`mobile`),
  KEY `idx_cust_code` (`customer_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'CUST-0001','Walk-in Retail Customer','9999999999','walkin@store.local','Showroom Counter',NULL,'Chennai','Tamil Nadu','33','600001',NULL,0.00,1800.00,'retail','active','2026-08-29 16:51:09','2026-10-12 09:54:48'),(2,'CUST-0002','Sri Kapaleeshwarar Temple Trust','9841022334','trust@kapaleeshwarar.org','12 Sannidhi Street, Mylapore',NULL,'Chennai','Tamil Nadu','33','600004','33AAACT0123A1Z5',150000.00,24500.00,'temple_trust','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(3,'CUST-0003','Annamalai Handicrafts & Exports','9842133445','orders@annamalaihandicrafts.com','45 Grand Bazaar Road',NULL,'Madurai','Tamil Nadu','33','625001','33AABCA5678B1Z2',200000.00,48000.00,'wholesale','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(4,'CUST-0004','Suresh Sundaram','9884055667','suresh.sundar@gmail.com','Plot 88, Anna Nagar West',NULL,'Chennai','Tamil Nadu','33','600040',NULL,25000.00,0.00,'retail','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(5,'CUST-0005','Divya Spiritual Centre','9444077889','info@divyaspiritual.in','78 Temple Road, Malleshwaram',NULL,'Bengaluru','Karnataka','33','560003','29AABBD8899C1Z4',100000.00,12000.00,'wholesale','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(6,'CUST-0006','Lord Krishna Devotee Test','9876543210','devotee@example.com','108 Temple Street, Madurai','108 Temple Street, Madurai','Madurai','Tamil Nadu','33',NULL,NULL,0.00,0.00,'retail','active','2026-10-11 18:49:20','2026-10-11 18:49:20');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Executive & Administration','DEPT-EXEC','Overall business management and system governance','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(2,'Sales & Retail Showroom','DEPT-SALES','Showroom POS billing, walk-in customers and sales inquiries','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(3,'Inventory & Warehouse','DEPT-WH','Stock management, idol safe-keeping, quality checks and packaging','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(4,'Accounts & Finance','DEPT-ACC','Ledgers, bookkeeping, supplier payments and expense audits','active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(5,'Procurement & Sculpting','DEPT-PROC','Artisan relations, raw brass/marble sourcing and procurement','active','2026-08-29 16:51:09','2026-08-29 16:51:09');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_categories`
--

DROP TABLE IF EXISTS `expense_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expense_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_categories`
--

LOCK TABLES `expense_categories` WRITE;
/*!40000 ALTER TABLE `expense_categories` DISABLE KEYS */;
INSERT INTO `expense_categories` VALUES (1,'Showroom Rent & Maintenance','EXP-RENT','Monthly building rent, electricity, air conditioning & maintenance','active','2026-08-29 16:51:09'),(2,'Artisan Freight & Transport','EXP-FREIGHT','Safe logistics, wooden crates, and transit insurance for heavy idols','active','2026-08-29 16:51:09'),(3,'Staff Salaries & Incentives','EXP-SALARY','Monthly staff wages, sales incentives, and festive bonuses','active','2026-08-29 16:51:09'),(4,'Packing & Sacred Velvet Boxes','EXP-PACKING','Custom wooden boxes, bubble cushioning, and silk velvet lining','active','2026-08-29 16:51:09'),(5,'Temple Pooja & Daily Aarti','EXP-POOJA','Daily flowers, camphor, sandal paste, and showroom consecrated rituals','active','2026-08-29 16:51:09'),(6,'Marketing & Divine Catalog','EXP-MARKETING','Digital marketing, print catalogs, and religious exhibition stalls','active','2026-08-29 16:51:09'),(7,'Miscellaneous Showroom Expenses','EXP-MISC','Office stationery, tea, snacks, and minor repairs','active','2026-08-29 16:51:09');
/*!40000 ALTER TABLE `expense_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `expense_no` varchar(50) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `account_id` int(10) unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','card','upi','bank_transfer','cheque') DEFAULT 'cash',
  `expense_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `approved_by` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_no` (`expense_no`),
  KEY `category_id` (`category_id`),
  KEY `account_id` (`account_id`),
  KEY `approved_by` (`approved_by`),
  KEY `user_id` (`user_id`),
  KEY `idx_exp_date` (`expense_date`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`),
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `expenses_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory_transactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `transaction_type` enum('stock_in','stock_out','sale','purchase','sales_return','adjustment','damage','transfer') NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL COMMENT 'invoice, purchase, manual_adjustment, sales_return',
  `reference_id` int(10) unsigned DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `previous_stock` int(11) NOT NULL,
  `quantity` int(11) NOT NULL COMMENT 'Positive for additions, Negative for deductions',
  `new_stock` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_inv_tx_prod` (`product_id`),
  KEY `idx_inv_tx_type` (`transaction_type`),
  KEY `idx_inv_tx_date` (`created_at`),
  CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` VALUES (1,1,'stock_in','opening_stock',NULL,'INIT-2026-001',0,8,8,'Opening stock count verified',1,'2026-08-29 16:51:09'),(2,2,'stock_in','opening_stock',NULL,'INIT-2026-001',0,5,5,'Opening stock count verified',1,'2026-08-29 16:51:09'),(3,3,'stock_in','opening_stock',NULL,'INIT-2026-001',0,12,12,'Opening stock count verified',1,'2026-08-29 16:51:09'),(4,4,'stock_in','opening_stock',NULL,'INIT-2026-001',0,6,6,'Opening stock count verified',1,'2026-08-29 16:51:09'),(5,5,'stock_in','opening_stock',NULL,'INIT-2026-001',0,10,10,'Opening stock count verified',1,'2026-08-29 16:51:09'),(6,6,'stock_in','opening_stock',NULL,'INIT-2026-001',0,4,4,'Opening stock count verified',1,'2026-08-29 16:51:09'),(7,7,'stock_in','opening_stock',NULL,'INIT-2026-001',0,15,15,'Opening stock count verified',1,'2026-08-29 16:51:09'),(8,8,'stock_in','opening_stock',NULL,'INIT-2026-001',0,7,7,'Opening stock count verified',1,'2026-08-29 16:51:09'),(9,9,'stock_in','opening_stock',NULL,'INIT-2026-001',0,9,9,'Opening stock count verified',1,'2026-08-29 16:51:09'),(10,10,'stock_in','opening_stock',NULL,'INIT-2026-001',0,25,25,'Opening stock count verified',1,'2026-08-29 16:51:09'),(11,11,'stock_in','opening_stock',NULL,'INIT-2026-001',0,11,11,'Opening stock count verified',1,'2026-08-29 16:51:09'),(12,12,'stock_in','opening_stock',NULL,'INIT-2026-001',0,18,18,'Opening stock count verified',1,'2026-08-29 16:51:09'),(13,1,'sale','invoice',2,'DIVYA-1002',8,-1,7,'Sold in Invoice #DIVYA-1002',1,'2026-08-30 07:50:10'),(14,11,'sale','invoice',2,'DIVYA-1002',11,-1,10,'Sold in Invoice #DIVYA-1002',1,'2026-08-30 07:50:10'),(15,11,'damage','manual_adjustment',NULL,'ADJ-1788076586',10,-5,5,'ghg',1,'2026-08-30 07:56:26'),(16,1,'sale','invoice',3,'DIVYA-1003',7,-3,4,'Sold in Invoice #DIVYA-1003',1,'2026-09-11 04:48:48'),(17,12,'sale','invoice',4,'DIVYA-1004',18,-1,17,'Sold in Invoice #DIVYA-1004',1,'2026-09-25 07:56:49'),(18,11,'sale','invoice',5,'DIVYA-1005',5,-1,4,'Sold in Invoice #DIVYA-1005',1,'2026-09-25 08:00:53'),(19,12,'sale','invoice',6,'DIVYA-1006',17,-1,16,'Sold in Invoice #DIVYA-1006',1,'2026-09-25 08:04:53'),(20,12,'sale','invoice',7,'DIVYA-1007',16,-1,15,'Sold in Invoice #DIVYA-1007',1,'2026-09-25 08:10:51'),(21,12,'sale','invoice',8,'DIVYA-1008',15,-1,14,'Sold in Invoice #DIVYA-1008',4,'2026-09-25 08:16:06'),(22,12,'sale','invoice',9,'DIVYA-1009',14,-1,13,'Sold in Invoice #DIVYA-1009',4,'2026-09-25 08:20:25'),(23,11,'sale','invoice',10,'DIVYA-1010',4,-1,3,'Sold in Invoice #DIVYA-1010',4,'2026-09-25 08:25:12'),(24,12,'sale','invoice',11,'DIVYA-1011',13,-1,12,'Sold in Invoice #DIVYA-1011',4,'2026-09-25 08:36:41'),(25,12,'sale','invoice',12,'DIVYA-1012',12,-1,11,'Sold in Invoice #DIVYA-1012',4,'2026-09-25 08:49:39'),(26,12,'sale','invoice',13,'DIVYA-1013',11,-1,10,'Sold in Invoice #DIVYA-1013',4,'2026-09-25 08:50:03'),(27,12,'sale','invoice',14,'DIVYA-1014',10,-1,9,'Sold in Invoice #DIVYA-1014',4,'2026-09-25 08:57:21'),(28,12,'sale','invoice',15,'DIVYA-1015',9,-1,8,'Sold in Invoice #DIVYA-1015',4,'2026-09-25 09:12:46'),(29,12,'sale','invoice',16,'DIVYA-1016',8,-1,7,'Sold in Invoice #DIVYA-1016',4,'2026-09-25 09:16:53'),(30,12,'sale','invoice',17,'DIVYA-1017',7,-1,6,'Sold in Invoice #DIVYA-1017',4,'2026-09-25 09:22:14'),(31,4,'sale','invoice',18,'DIVYA-1018',6,-1,5,'Sold in Invoice #DIVYA-1018',1,'2026-10-06 13:49:06'),(32,12,'sale','invoice',19,'DIVYA-1019',6,-1,5,'Sold in Invoice #DIVYA-1019',1,'2026-10-06 13:49:48'),(33,12,'sale','invoice',20,'DIVYA-1020',5,-1,4,'Sold in Invoice #DIVYA-1020',1,'2026-10-06 13:50:03'),(34,12,'sale','invoice',21,'DIVYA-1021',4,-1,3,'Sold in Invoice #DIVYA-1021',1,'2026-10-06 13:53:17'),(35,2,'stock_in','opening_stock',NULL,'INIT-SKU-21011',0,5,5,'Product Details entry opening stock',1,'2026-10-11 16:43:45'),(36,3,'stock_in','opening_stock',NULL,'INIT-SKU-19581',0,4,4,'Product Details entry opening stock',1,'2026-10-11 16:44:59'),(37,4,'stock_in','opening_stock',NULL,'INIT-SKU-94843',0,3,3,'Product Details entry opening stock',1,'2026-10-11 16:44:59'),(38,5,'stock_in','opening_stock',NULL,'INIT-SKU-90983',0,6,6,'Product Details entry opening stock',1,'2026-10-11 16:44:59'),(39,7,'stock_in','opening_stock',NULL,'INIT-SKU-43423',0,2,2,'Product Details entry opening stock',1,'2026-10-11 16:44:59'),(40,11,'stock_in','opening_stock',NULL,'INIT-SKU-38619',0,4,4,'Product Details entry opening stock',1,'2026-10-11 17:54:28'),(41,12,'stock_in','opening_stock',NULL,'INIT-SKU-31090',0,2,2,'Product Details entry opening stock',1,'2026-10-11 17:55:15'),(42,15,'stock_in','opening_stock',NULL,'INIT-SKU-23347',0,4,4,'Product Details entry opening stock',1,'2026-10-11 17:59:03'),(43,16,'stock_in','opening_stock',NULL,'INIT-SKU-60927',0,2,2,'Product Details entry opening stock',1,'2026-10-11 17:59:03'),(44,18,'stock_in','opening_stock',NULL,'INIT-SKU-45754',0,4,4,'Product Details entry opening stock',1,'2026-10-11 17:59:38'),(45,19,'stock_in','opening_stock',NULL,'INIT-SKU-60493',0,2,2,'Product Details entry opening stock',1,'2026-10-11 17:59:38'),(46,22,'stock_in','opening_stock',NULL,'INIT-SKU-36579',0,4,4,'Product Details entry opening stock',1,'2026-10-11 18:12:21'),(47,23,'stock_in','opening_stock',NULL,'INIT-SKU-43562',0,2,2,'Product Details entry opening stock',1,'2026-10-11 18:12:21'),(48,1,'sale','invoice',22,'INV-2026-0001',50,-2,48,'Sold in Invoice #INV-2026-0001',1,'2026-10-11 18:54:27'),(49,1,'sale','invoice',24,'INV-2026-0003',48,-2,46,'Sold in Invoice #INV-2026-0003',1,'2026-10-11 18:55:26'),(50,1,'stock_in','invoice_cancellation',24,'INV-2026-0003',46,2,48,'Customer cancelled test transaction',1,'2026-10-11 18:55:26'),(51,1,'sale','invoice',26,'INV-2026-0005',48,-2,46,'Sold in Invoice #INV-2026-0005',1,'2026-10-11 18:55:34'),(52,1,'stock_in','invoice_cancellation',26,'INV-2026-0005',46,2,48,'Customer cancelled test transaction',1,'2026-10-11 18:55:34'),(53,1,'sale','invoice',28,'INV-2026-0007',48,-2,46,'Sold in Invoice #INV-2026-0007',1,'2026-10-11 18:57:11'),(54,1,'stock_in','invoice_cancellation',28,'INV-2026-0007',46,2,48,'Customer cancelled test transaction',1,'2026-10-11 18:57:11'),(55,1,'sale','invoice',30,'INV-2026-0009',48,-2,46,'Sold in Invoice #INV-2026-0009',1,'2026-10-11 19:01:11'),(56,1,'stock_in','invoice_cancellation',30,'INV-2026-0009',46,2,48,'Customer cancelled test transaction',1,'2026-10-11 19:01:11'),(57,1,'sale','invoice',32,'INV-2026-0011',48,-1,47,'Sold in Invoice #INV-2026-0011',1,'2026-10-12 08:58:20'),(62,9,'sale','invoice',37,'INV-2026-0012',5,-1,4,'Sold in Invoice #INV-2026-0012',1,'2026-10-12 09:56:09'),(63,5,'sale','invoice',38,'INV-2026-0013',6,-1,5,'Sold in Invoice #INV-2026-0013',1,'2026-10-12 11:48:22'),(64,5,'sale','invoice',39,'INV-2026-0014',5,-1,4,'Sold in Invoice #INV-2026-0014',1,'2026-10-12 11:49:17'),(66,5,'sale','invoice',41,'INV-2026-0015',4,-1,3,'Sold in Invoice #INV-2026-0015',1,'2026-10-12 11:59:41'),(67,9,'sale','invoice',42,'INV-2026-0016',4,-1,3,'Sold in Invoice #INV-2026-0016',1,'2026-10-12 12:28:02'),(68,5,'sale','invoice',43,'INV-2026-0017',3,-1,2,'Sold in Invoice #INV-2026-0017',1,'2026-10-12 12:34:54'),(69,5,'sale','invoice',44,'INV-2026-0018',2,-1,1,'Sold in Invoice #INV-2026-0018',1,'2026-10-12 12:39:22'),(70,5,'sale','invoice',45,'INV-2026-0019',1,-1,0,'Sold in Invoice #INV-2026-0019',1,'2026-10-12 12:40:22'),(71,4,'sale','invoice',46,'INV-2026-0020',3,-1,2,'Sold in Invoice #INV-2026-0020',1,'2026-10-12 12:42:48'),(72,4,'sale','invoice',47,'INV-2026-0021',2,-1,1,'Sold in Invoice #INV-2026-0021',1,'2026-10-12 12:47:54'),(73,4,'sale','invoice',48,'INV-2026-0022',1,-1,0,'Sold in Invoice #INV-2026-0022',1,'2026-10-12 12:48:46'),(74,53,'sale','invoice',49,'INV-2026-0023',5,-1,4,'Sold in Invoice #INV-2026-0023',1,'2026-10-12 17:02:09'),(75,53,'sale','invoice',50,'INV-2026-0024',4,-1,3,'Sold in Invoice #INV-2026-0024',1,'2026-10-12 17:49:03'),(76,53,'sale','invoice',51,'INV-2026-0025',3,-1,2,'Sold in Invoice #INV-2026-0025',1,'2026-10-12 17:52:39'),(77,53,'sale','invoice',52,'INV-2026-0026',2,-1,1,'Sold in Invoice #INV-2026-0026',1,'2026-10-12 17:54:34'),(78,13,'sale','invoice',53,'INV-2026-0027',3,-1,2,'Sold in Invoice #INV-2026-0027',1,'2026-10-12 17:55:07'),(79,13,'sale','invoice',54,'INV-2026-0028',2,-1,1,'Sold in Invoice #INV-2026-0028',1,'2026-10-12 17:55:25'),(80,13,'sale','invoice',55,'INV-2026-0029',1,-1,0,'Sold in Invoice #INV-2026-0029',1,'2026-10-12 17:58:33'),(81,14,'sale','invoice',56,'INV-2026-0030',3,-1,2,'Sold in Invoice #INV-2026-0030',1,'2026-10-12 17:59:28'),(82,9,'sale','invoice',57,'INV-2026-0031',3,-1,2,'Sold in Invoice #INV-2026-0031',1,'2026-10-12 18:13:37');
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `god_name` varchar(100) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT '9701',
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `discount_percent` decimal(5,2) DEFAULT 0.00,
  `discount_amount` decimal(12,2) DEFAULT 0.00,
  `tax_percent` decimal(5,2) DEFAULT 12.00,
  `tax_amount` decimal(12,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invoice_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
INSERT INTO `invoice_items` VALUES (1,1,1,'Antique Brass Royal Ganesha 18 Inch','PRD-GAN-001','Lord Ganesha','Brass','9701',1,18900.00,5.00,945.00,12.00,2154.60,20109.60),(2,1,10,'Royal Brass Pooja Thali Set (9 Items Included)','PRD-THL-010','Pooja Set','Brass','9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(3,2,1,'Antique Brass Royal Ganesha 18 Inch','PRD-GAN-001','Lord Ganesha','Brass','9701',1,18900.00,5.00,945.00,12.00,2154.60,20109.60),(4,2,11,'Black Granite Carved Shiva Lingam with Nandi 10 Inch','PRD-SHV-011','Lord Shiva','Black Stone','9701',1,6200.00,0.00,0.00,12.00,744.00,6944.00),(5,3,1,'Antique Brass Royal Ganesha 18 Inch','PRD-GAN-001','Lord Ganesha','Brass','9701',3,18900.00,5.00,2835.00,12.00,6463.80,60328.80),(6,4,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(7,5,11,'Black Granite Carved Shiva Lingam with Nandi 10 Inch','PRD-SHV-011','Lord Shiva','Black Stone','9701',1,6200.00,0.00,0.00,12.00,744.00,6944.00),(8,6,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(9,7,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(10,8,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(11,9,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(12,10,11,'Black Granite Carved Shiva Lingam with Nandi 10 Inch','PRD-SHV-011','Lord Shiva','Black Stone','9701',1,6200.00,0.00,0.00,12.00,744.00,6944.00),(13,11,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(14,12,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(15,13,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(16,14,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(17,15,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(18,16,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(19,17,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(20,18,4,'Pure White Makrana Marble Goddess Lakshmi 12 Inch','PRD-LAK-004','Goddess Lakshmi','White Marble','9701',1,9800.00,0.00,0.00,12.00,1176.00,10976.00),(21,19,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(22,20,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(23,21,12,'Dancing Baby Krishna with Butter Pot 10 Inch Brass','PRD-KRS-012','Lord Krishna','Brass','9701',1,4999.00,0.00,0.00,12.00,599.88,5598.88),(24,22,1,'Vishnu','SKU-65632','General','Brass','9701',2,1000.00,5.00,100.00,18.00,342.00,2242.00),(25,24,1,'Vishnu','SKU-65632','General','Brass','9701',2,1000.00,5.00,100.00,18.00,342.00,2242.00),(26,26,1,'Vishnu','SKU-65632','General','Brass','9701',2,1000.00,5.00,100.00,18.00,342.00,2242.00),(27,28,1,'Vishnu','SKU-65632','General','Brass','9701',2,1000.00,5.00,100.00,18.00,342.00,2242.00),(28,30,1,'Vishnu','SKU-65632','General','Brass','9701',2,1000.00,5.00,100.00,18.00,342.00,2242.00),(29,32,1,'Vishnu','SKU-65632',NULL,NULL,'9701',1,500.00,0.00,0.00,10.00,50.00,550.00),(34,37,9,'Brass Ganesha Idol','SKU-81438',NULL,NULL,'9701',1,8000.00,0.00,0.00,12.00,960.00,8960.00),(35,38,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(36,39,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(38,41,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(39,42,9,'Brass Ganesha Idol','SKU-81438',NULL,NULL,'9701',1,8000.00,0.00,0.00,12.00,960.00,8960.00),(40,43,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(41,44,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(42,45,5,'Brass Lamp 2ft','SKU-90983',NULL,NULL,'9701',1,3200.00,0.00,0.00,12.00,384.00,3584.00),(43,46,4,'Bronze Murugan 6in','SKU-94843',NULL,NULL,'9701',1,2500.00,0.00,0.00,18.00,450.00,2950.00),(44,47,4,'Bronze Murugan 6in','SKU-94843',NULL,NULL,'9701',1,2500.00,0.00,0.00,18.00,450.00,2950.00),(45,48,4,'Bronze Murugan 6in','SKU-94843',NULL,NULL,'9701',1,2500.00,0.00,0.00,18.00,450.00,2950.00),(46,49,53,'fik','SKU-90616',NULL,NULL,'9701',1,1600.00,0.00,0.00,20.00,320.00,1920.00),(47,50,53,'fik','SKU-90616',NULL,NULL,'9701',1,1600.00,0.00,0.00,60.00,960.00,2560.00),(48,51,53,'fik','SKU-90616',NULL,NULL,'9701',1,1600.00,0.00,0.00,20.00,320.00,1920.00),(49,52,53,'fik','SKU-90616',NULL,NULL,'9701',1,1600.00,0.00,0.00,20.00,320.00,1920.00),(50,53,13,'Handcrafted Teak Altar 4ft','SKU-58965',NULL,NULL,'9701',1,65000.00,0.00,0.00,12.00,7800.00,72800.00),(51,54,13,'Handcrafted Teak Altar 4ft','SKU-58965',NULL,NULL,'9701',1,65000.00,0.00,0.00,12.00,7800.00,72800.00),(52,55,13,'Handcrafted Teak Altar 4ft','SKU-58965',NULL,NULL,'9701',1,65000.00,0.00,0.00,12.00,7800.00,72800.00),(53,56,14,'Handcrafted Teak Altar 4ft','SKU-84805',NULL,NULL,'9701',1,65000.00,0.00,0.00,12.00,7800.00,72800.00),(54,57,9,'Brass Ganesha Idol','SKU-81438',NULL,NULL,'9701',1,8000.00,0.00,0.00,12.00,960.00,8960.00);
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(50) NOT NULL,
  `invoice_type` enum('tax_invoice','proforma_invoice') NOT NULL DEFAULT 'tax_invoice',
  `reference_no` varchar(100) DEFAULT NULL,
  `customer_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL COMMENT 'Salesperson / Billing operator',
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `invoice_time` time NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `item_discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `overall_discount_percent` decimal(5,2) DEFAULT 0.00,
  `overall_discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `additional_charges` decimal(12,2) NOT NULL DEFAULT 0.00,
  `round_off` decimal(6,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` enum('cash','card','upi','bank_transfer','credit','split') DEFAULT 'cash',
  `payment_terms` varchar(100) DEFAULT NULL,
  `status` enum('completed','draft','held','cancelled','returned') DEFAULT 'completed',
  `payment_status` enum('paid','partial','unpaid') DEFAULT 'paid',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_no` (`invoice_no`),
  KEY `customer_id` (`customer_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_inv_no` (`invoice_no`),
  KEY `idx_inv_date` (`invoice_date`),
  KEY `idx_inv_status` (`status`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,'DIVYA-1001','tax_invoice',NULL,4,4,'2026-08-29',NULL,'11:30:00',22100.00,0.00,5.00,1105.00,1259.70,1259.70,0.00,2519.40,0.00,-0.40,23514.00,23514.00,0.00,'upi',NULL,'completed','paid','Housewarming purchase - packing in sacred red velvet box','2026-08-29 16:51:09','2026-08-29 16:51:09'),(2,'DIVYA-1002','tax_invoice',NULL,1,1,'2026-08-30',NULL,'13:20:10',25100.00,945.00,0.00,0.00,1449.30,1449.30,0.00,2898.60,0.00,0.40,27054.00,27054.00,0.00,'upi',NULL,'completed','paid','','2026-08-30 07:50:10','2026-08-30 07:50:10'),(3,'DIVYA-1003','tax_invoice',NULL,1,1,'2026-09-11',NULL,'10:18:48',56700.00,2835.00,0.00,0.00,3231.90,3231.90,0.00,6463.80,0.00,0.20,60329.00,60329.00,0.00,'upi',NULL,'completed','paid','','2026-09-11 04:48:48','2026-09-11 04:48:48'),(4,'DIVYA-1004','tax_invoice',NULL,1,1,'2026-09-25',NULL,'13:26:49',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 07:56:49','2026-09-25 07:56:49'),(5,'DIVYA-1005','tax_invoice',NULL,1,1,'2026-09-25',NULL,'13:30:53',6200.00,0.00,0.00,0.00,372.00,372.00,0.00,744.00,0.00,0.00,6944.00,6944.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:00:53','2026-09-25 08:00:53'),(6,'DIVYA-1006','tax_invoice',NULL,1,1,'2026-09-25',NULL,'13:34:53',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:04:53','2026-09-25 08:04:53'),(7,'DIVYA-1007','tax_invoice',NULL,1,1,'2026-09-25',NULL,'13:40:51',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:10:51','2026-09-25 08:10:51'),(8,'DIVYA-1008','tax_invoice',NULL,1,4,'2026-09-25',NULL,'13:46:06',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:16:06','2026-09-25 08:16:06'),(9,'DIVYA-1009','tax_invoice',NULL,1,4,'2026-09-25',NULL,'13:50:25',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:20:25','2026-09-25 08:20:25'),(10,'DIVYA-1010','tax_invoice',NULL,1,4,'2026-09-25',NULL,'13:55:12',6200.00,0.00,0.00,0.00,372.00,372.00,0.00,744.00,0.00,0.00,6944.00,6944.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:25:12','2026-09-25 08:25:12'),(11,'DIVYA-1011','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:06:41',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:36:41','2026-09-25 08:36:41'),(12,'DIVYA-1012','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:19:39',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:49:39','2026-09-25 08:49:39'),(13,'DIVYA-1013','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:20:03',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:50:03','2026-09-25 08:50:03'),(14,'DIVYA-1014','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:27:21',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 08:57:21','2026-09-25 08:57:21'),(15,'DIVYA-1015','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:42:46',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 09:12:46','2026-09-25 09:12:46'),(16,'DIVYA-1016','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:46:53',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 09:16:53','2026-09-25 09:16:53'),(17,'DIVYA-1017','tax_invoice',NULL,1,4,'2026-09-25',NULL,'14:52:14',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'upi',NULL,'completed','paid','','2026-09-25 09:22:14','2026-09-25 09:22:14'),(18,'DIVYA-1018','tax_invoice',NULL,1,1,'2026-10-06',NULL,'19:19:06',9800.00,0.00,0.00,0.00,588.00,588.00,0.00,1176.00,0.00,0.00,10976.00,10976.00,0.00,'cash',NULL,'completed','paid','','2026-10-06 13:49:06','2026-10-06 13:49:06'),(19,'DIVYA-1019','tax_invoice',NULL,1,1,'2026-10-06',NULL,'19:19:48',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'cash',NULL,'completed','paid','','2026-10-06 13:49:48','2026-10-06 13:49:48'),(20,'DIVYA-1020','tax_invoice',NULL,1,1,'2026-10-06',NULL,'19:20:03',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'cash',NULL,'completed','paid','','2026-10-06 13:50:03','2026-10-06 13:50:03'),(21,'DIVYA-1021','tax_invoice',NULL,1,1,'2026-10-06',NULL,'19:23:17',4999.00,0.00,0.00,0.00,299.94,299.94,0.00,599.88,0.00,0.12,5599.00,5599.00,0.00,'card',NULL,'completed','paid','','2026-10-06 13:53:17','2026-10-06 13:53:17'),(22,'INV-2026-0001','tax_invoice',NULL,6,1,'2026-10-12','2026-10-27','00:24:27',2000.00,100.00,0.00,0.00,171.00,171.00,0.00,342.00,0.00,0.00,2242.00,2242.00,0.00,'cash','Net 15 Days','completed','paid','Test invoice creation verification','2026-10-11 18:54:27','2026-10-11 18:54:27'),(23,'INV-2026-0002','tax_invoice',NULL,6,1,'2026-10-12',NULL,'00:24:27',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,500.00,0.00,500.00,'cash',NULL,'draft','unpaid',NULL,'2026-10-11 18:54:27','2026-10-11 18:54:27'),(24,'INV-2026-0003','tax_invoice',NULL,6,1,'2026-10-12','2026-10-27','00:25:26',2000.00,100.00,0.00,0.00,171.00,171.00,0.00,342.00,0.00,0.00,2242.00,2242.00,0.00,'cash','Net 15 Days','cancelled','paid','Test invoice creation verification','2026-10-11 18:55:26','2026-10-11 18:55:26'),(25,'INV-2026-0004','tax_invoice',NULL,6,1,'2026-10-12',NULL,'00:25:26',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,500.00,0.00,500.00,'cash',NULL,'draft','unpaid',NULL,'2026-10-11 18:55:26','2026-10-11 18:55:26'),(26,'INV-2026-0005','tax_invoice',NULL,6,1,'2026-10-12','2026-10-27','00:25:34',2000.00,100.00,0.00,0.00,171.00,171.00,0.00,342.00,0.00,0.00,2242.00,2242.00,0.00,'cash','Net 15 Days','cancelled','paid','Test invoice creation verification','2026-10-11 18:55:34','2026-10-11 18:55:34'),(27,'INV-2026-0006','tax_invoice',NULL,6,1,'2026-10-12',NULL,'00:25:34',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,500.00,0.00,500.00,'cash',NULL,'draft','unpaid',NULL,'2026-10-11 18:55:34','2026-10-11 18:55:34'),(28,'INV-2026-0007','tax_invoice',NULL,6,1,'2026-10-12','2026-10-27','00:27:11',2000.00,100.00,0.00,0.00,171.00,171.00,0.00,342.00,0.00,0.00,2242.00,2242.00,0.00,'cash','Net 15 Days','cancelled','paid','Test invoice creation verification','2026-10-11 18:57:11','2026-10-11 18:57:11'),(29,'INV-2026-0008','tax_invoice',NULL,6,1,'2026-10-12',NULL,'00:27:11',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,500.00,0.00,500.00,'cash',NULL,'draft','unpaid',NULL,'2026-10-11 18:57:11','2026-10-11 18:57:11'),(30,'INV-2026-0009','tax_invoice',NULL,6,1,'2026-10-12','2026-10-27','00:31:11',2000.00,100.00,0.00,0.00,171.00,171.00,0.00,342.00,0.00,0.00,2242.00,2242.00,0.00,'cash','Net 15 Days','cancelled','paid','Test invoice creation verification','2026-10-11 19:01:11','2026-10-11 19:01:11'),(31,'INV-2026-0010','tax_invoice',NULL,6,1,'2026-10-12',NULL,'00:31:11',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,500.00,0.00,500.00,'cash',NULL,'draft','unpaid',NULL,'2026-10-11 19:01:11','2026-10-11 19:01:11'),(32,'INV-2026-0011','tax_invoice',NULL,1,1,'2026-10-12',NULL,'10:58:20',500.00,0.00,0.00,0.00,25.00,25.00,0.00,50.00,0.00,0.00,550.00,100.00,450.00,'split',NULL,'completed','partial','Test Multi Payment Split','2026-10-12 08:58:20','2026-10-12 08:58:20'),(37,'INV-2026-0012','tax_invoice',NULL,1,1,'2026-10-12',NULL,'15:26:09',8000.00,0.00,0.00,0.00,480.00,480.00,0.00,960.00,0.00,0.00,8960.00,8960.00,0.00,'split',NULL,'completed','paid','','2026-10-12 09:56:09','2026-10-12 09:56:09'),(38,'INV-2026-0013','tax_invoice',NULL,1,1,'2026-10-12',NULL,'17:18:22',3200.00,0.00,10.00,320.00,192.00,192.00,0.00,384.00,0.00,0.00,3264.00,3264.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,264.00]','2026-10-12 11:48:22','2026-10-12 11:48:22'),(39,'INV-2026-0014','tax_invoice',NULL,1,1,'2026-10-12',NULL,'17:19:17',3200.00,0.00,0.00,0.00,192.00,192.00,0.00,384.00,0.00,0.00,3584.00,3584.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,584.00]','2026-10-12 11:49:17','2026-10-12 11:49:17'),(41,'INV-2026-0015','tax_invoice',NULL,1,1,'2026-10-12',NULL,'17:29:41',3200.00,0.00,0.00,0.00,192.00,192.00,0.00,384.00,0.00,0.00,3584.00,3584.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,584.00]','2026-10-12 11:59:41','2026-10-12 11:59:41'),(42,'INV-2026-0016','tax_invoice',NULL,1,1,'2026-10-12',NULL,'17:58:02',8000.00,0.00,0.00,0.00,480.00,480.00,0.00,960.00,0.00,0.00,8960.00,8960.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹8,960.00]','2026-10-12 12:28:02','2026-10-12 12:28:02'),(43,'INV-2026-0017','tax_invoice',NULL,1,1,'2026-10-12',NULL,'18:04:54',3200.00,0.00,0.00,0.00,192.00,192.00,0.00,384.00,0.00,0.00,3584.00,3584.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,584.00]','2026-10-12 12:34:54','2026-10-12 12:34:54'),(44,'INV-2026-0018','tax_invoice',NULL,1,1,'2026-10-12',NULL,'18:09:22',3200.00,0.00,0.00,0.00,192.00,192.00,0.00,384.00,0.00,0.00,3584.00,3584.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,584.00]','2026-10-12 12:39:22','2026-10-12 12:39:22'),(45,'INV-2026-0019','tax_invoice',NULL,1,1,'2026-10-12',NULL,'18:10:22',3200.00,0.00,0.00,0.00,192.00,192.00,0.00,384.00,0.00,0.00,3584.00,3584.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹3,584.00]','2026-10-12 12:40:22','2026-10-12 12:40:22'),(46,'INV-2026-0020','tax_invoice',NULL,1,1,'2026-10-12',NULL,'18:12:48',2500.00,0.00,0.00,0.00,225.00,225.00,0.00,450.00,0.00,0.00,2950.00,2950.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹2,950.00]','2026-10-12 12:42:48','2026-10-12 12:42:48'),(47,'INV-2026-0021','tax_invoice',NULL,1,1,'2026-10-12',NULL,'18:17:54',2500.00,0.00,0.00,0.00,225.00,225.00,0.00,450.00,0.00,0.00,2950.00,2950.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹2,950.00]','2026-10-12 12:47:54','2026-10-12 12:47:54'),(48,'INV-2026-0022','tax_invoice',NULL,3,1,'2026-10-12',NULL,'18:18:45',2500.00,0.00,0.00,0.00,225.00,225.00,0.00,450.00,0.00,0.00,2950.00,2950.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹2,950.00]','2026-10-12 12:48:45','2026-10-12 12:48:45'),(49,'INV-2026-0023','tax_invoice',NULL,1,1,'2026-10-12',NULL,'22:32:09',1600.00,0.00,0.00,0.00,160.00,160.00,0.00,320.00,0.00,0.00,1920.00,1920.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹1,920.00]','2026-10-12 17:02:09','2026-10-12 17:02:09'),(50,'INV-2026-0024','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:19:03',1600.00,0.00,0.00,0.00,480.00,480.00,0.00,960.00,0.00,0.00,2560.00,2560.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹2,560.00]','2026-10-12 17:49:03','2026-10-12 17:49:03'),(51,'INV-2026-0025','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:22:39',1600.00,0.00,0.00,0.00,160.00,160.00,0.00,320.00,0.00,0.00,1920.00,1920.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹1,920.00]','2026-10-12 17:52:39','2026-10-12 17:52:39'),(52,'INV-2026-0026','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:24:34',1600.00,0.00,0.00,0.00,160.00,160.00,0.00,320.00,0.00,0.00,1920.00,1920.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹1,920.00]','2026-10-12 17:54:34','2026-10-12 17:54:34'),(53,'INV-2026-0027','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:25:07',65000.00,0.00,0.00,0.00,3900.00,3900.00,0.00,7800.00,0.00,0.00,72800.00,72800.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹72,800.00]','2026-10-12 17:55:07','2026-10-12 17:55:07'),(54,'INV-2026-0028','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:25:25',65000.00,0.00,0.00,0.00,3900.00,3900.00,0.00,7800.00,0.00,0.00,72800.00,72800.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹72,800.00]','2026-10-12 17:55:25','2026-10-12 17:55:25'),(55,'INV-2026-0029','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:28:33',65000.00,0.00,0.00,0.00,3900.00,3900.00,0.00,7800.00,0.00,0.00,72800.00,72800.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹72,800.00]','2026-10-12 17:58:33','2026-10-12 17:58:33'),(56,'INV-2026-0030','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:29:28',65000.00,0.00,0.00,0.00,3900.00,3900.00,0.00,7800.00,0.00,0.00,72800.00,72800.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹72,800.00]','2026-10-12 17:59:28','2026-10-12 17:59:28'),(57,'INV-2026-0031','tax_invoice',NULL,1,1,'2026-10-12',NULL,'23:43:37',8000.00,0.00,0.00,0.00,480.00,480.00,0.00,960.00,0.00,0.00,8960.00,8960.00,0.00,'cash',NULL,'completed','paid','Payment: [Cash: ₹8,960.00]','2026-10-12 18:13:37','2026-10-12 18:13:37');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  KEY `idx_pr_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `payment_no` varchar(50) NOT NULL,
  `payment_type` enum('customer_payment','supplier_payment','expense_payment','income_receipt','refund') NOT NULL,
  `account_id` int(10) unsigned NOT NULL COMMENT 'Cash or Bank Account',
  `customer_id` int(10) unsigned DEFAULT NULL,
  `supplier_id` int(10) unsigned DEFAULT NULL,
  `invoice_id` int(10) unsigned DEFAULT NULL,
  `purchase_id` int(10) unsigned DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','card','upi','bank_transfer','cheque') NOT NULL DEFAULT 'cash',
  `transaction_reference` varchar(100) DEFAULT NULL COMMENT 'UPI ref / Cheque No / Bank UTR',
  `payment_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_no` (`payment_no`),
  KEY `account_id` (`account_id`),
  KEY `customer_id` (`customer_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `purchase_id` (`purchase_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_pay_date` (`payment_date`),
  KEY `idx_pay_no` (`payment_no`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_ibfk_4` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_ibfk_5` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'PAY-2026-001','customer_payment',3,4,NULL,1,NULL,23514.00,'upi','UPI/20260829/987162534','2026-08-29','POS Billing DIVYA-1001',4,'2026-08-29 16:51:09'),(2,'PAY-202608-0001','customer_payment',1,1,NULL,2,NULL,27054.00,'upi','Bill DIVYA-1002','2026-08-30','POS Sales receipt for DIVYA-1002',1,'2026-08-30 07:50:10'),(3,'PAY-202609-0001','customer_payment',2,1,NULL,3,NULL,60329.00,'upi','Bill DIVYA-1003','2026-09-11','POS Sales receipt for DIVYA-1003',1,'2026-09-11 04:48:48'),(4,'PAY-202609-0002','customer_payment',1,1,NULL,4,NULL,5599.00,'upi','Bill DIVYA-1004','2026-09-25','POS Sales receipt for DIVYA-1004',1,'2026-09-25 07:56:49'),(5,'PAY-202609-0003','customer_payment',1,1,NULL,5,NULL,6944.00,'upi','Bill DIVYA-1005','2026-09-25','POS Sales receipt for DIVYA-1005',1,'2026-09-25 08:00:53'),(6,'PAY-202609-0004','customer_payment',1,1,NULL,6,NULL,5599.00,'upi','Bill DIVYA-1006','2026-09-25','POS Sales receipt for DIVYA-1006',1,'2026-09-25 08:04:53'),(7,'PAY-202609-0005','customer_payment',1,1,NULL,7,NULL,5599.00,'upi','Bill DIVYA-1007','2026-09-25','POS Sales receipt for DIVYA-1007',1,'2026-09-25 08:10:51'),(8,'PAY-202609-0006','customer_payment',1,1,NULL,8,NULL,5599.00,'upi','Bill DIVYA-1008','2026-09-25','POS Sales receipt for DIVYA-1008',4,'2026-09-25 08:16:06'),(9,'PAY-202609-0007','customer_payment',1,1,NULL,9,NULL,5599.00,'upi','Bill DIVYA-1009','2026-09-25','POS Sales receipt for DIVYA-1009',4,'2026-09-25 08:20:25'),(10,'PAY-202609-0008','customer_payment',1,1,NULL,10,NULL,6944.00,'upi','Bill DIVYA-1010','2026-09-25','POS Sales receipt for DIVYA-1010',4,'2026-09-25 08:25:12'),(11,'PAY-202609-0009','customer_payment',1,1,NULL,11,NULL,5599.00,'upi','Bill DIVYA-1011','2026-09-25','POS Sales receipt for DIVYA-1011',4,'2026-09-25 08:36:41'),(12,'PAY-202609-0010','customer_payment',1,1,NULL,12,NULL,5599.00,'upi','Bill DIVYA-1012','2026-09-25','POS Sales receipt for DIVYA-1012',4,'2026-09-25 08:49:39'),(13,'PAY-202609-0011','customer_payment',1,1,NULL,13,NULL,5599.00,'upi','Bill DIVYA-1013','2026-09-25','POS Sales receipt for DIVYA-1013',4,'2026-09-25 08:50:03'),(14,'PAY-202609-0012','customer_payment',1,1,NULL,14,NULL,5599.00,'upi','Bill DIVYA-1014','2026-09-25','POS Sales receipt for DIVYA-1014',4,'2026-09-25 08:57:21'),(15,'PAY-202609-0013','customer_payment',1,1,NULL,15,NULL,5599.00,'upi','Bill DIVYA-1015','2026-09-25','POS Sales receipt for DIVYA-1015',4,'2026-09-25 09:12:46'),(16,'PAY-202609-0014','customer_payment',1,1,NULL,16,NULL,5599.00,'upi','Bill DIVYA-1016','2026-09-25','POS Sales receipt for DIVYA-1016',4,'2026-09-25 09:16:53'),(17,'PAY-202609-0015','customer_payment',1,1,NULL,17,NULL,5599.00,'upi','Bill DIVYA-1017','2026-09-25','POS Sales receipt for DIVYA-1017',4,'2026-09-25 09:22:14'),(18,'PAY-202610-0001','customer_payment',1,1,NULL,18,NULL,10976.00,'cash','Bill DIVYA-1018','2026-10-06','POS Sales receipt for DIVYA-1018',1,'2026-10-06 13:49:06'),(19,'PAY-202610-0002','customer_payment',1,1,NULL,19,NULL,5599.00,'cash','Bill DIVYA-1019','2026-10-06','POS Sales receipt for DIVYA-1019',1,'2026-10-06 13:49:48'),(20,'PAY-202610-0003','customer_payment',1,1,NULL,20,NULL,5599.00,'cash','Bill DIVYA-1020','2026-10-06','POS Sales receipt for DIVYA-1020',1,'2026-10-06 13:50:03'),(21,'PAY-202610-0004','customer_payment',1,1,NULL,21,NULL,5599.00,'card','Bill DIVYA-1021','2026-10-06','POS Sales receipt for DIVYA-1021',1,'2026-10-06 13:53:17'),(22,'PAY-202610-0005','customer_payment',1,6,NULL,22,NULL,1000.00,'upi','UPI-TEST-12345','2026-10-12','Advance payment at billing',1,'2026-10-11 18:54:27'),(23,'PAY-202610-0006','customer_payment',1,6,NULL,22,NULL,1242.00,'cash','CASH-REC-01','2026-10-12','Settled remaining balance',1,'2026-10-11 18:54:27'),(24,'PAY-202610-0007','customer_payment',1,6,NULL,24,NULL,1000.00,'upi','UPI-TEST-12345','2026-10-12','Advance payment at billing',1,'2026-10-11 18:55:26'),(25,'PAY-202610-0008','customer_payment',1,6,NULL,24,NULL,1242.00,'cash','CASH-REC-01','2026-10-12','Settled remaining balance',1,'2026-10-11 18:55:26'),(26,'PAY-202610-0009','customer_payment',1,6,NULL,26,NULL,1000.00,'upi','UPI-TEST-12345','2026-10-12','Advance payment at billing',1,'2026-10-11 18:55:34'),(27,'PAY-202610-0010','customer_payment',1,6,NULL,26,NULL,1242.00,'cash','CASH-REC-01','2026-10-12','Settled remaining balance',1,'2026-10-11 18:55:34'),(28,'PAY-202610-0011','customer_payment',1,6,NULL,28,NULL,1000.00,'upi','UPI-TEST-12345','2026-10-12','Advance payment at billing',1,'2026-10-11 18:57:11'),(29,'PAY-202610-0012','customer_payment',1,6,NULL,28,NULL,1242.00,'cash','CASH-REC-01','2026-10-12','Settled remaining balance',1,'2026-10-11 18:57:11'),(30,'PAY-202610-0013','customer_payment',1,6,NULL,30,NULL,1000.00,'upi','UPI-TEST-12345','2026-10-12','Advance payment at billing',1,'2026-10-11 19:01:11'),(31,'PAY-202610-0014','customer_payment',1,6,NULL,30,NULL,1242.00,'cash','CASH-REC-01','2026-10-12','Settled remaining balance',1,'2026-10-11 19:01:11'),(32,'PAY-202610-0015','customer_payment',1,1,NULL,32,NULL,100.00,'upi','Bill INV-2026-0011','2026-10-12','POS Sales receipt for INV-2026-0011 (Cash, Upi)',1,'2026-10-12 08:58:20'),(36,'PAY-202610-0016','customer_payment',1,1,NULL,37,NULL,8960.00,'upi','Bill INV-2026-0012','2026-10-12','POS Sales receipt for INV-2026-0012 (Cash: ₹5,000.00, UPI: ₹3,960.00)',1,'2026-10-12 09:56:09'),(37,'PAY-202610-0017','customer_payment',1,1,NULL,38,NULL,3264.00,'cash','Bill INV-2026-0013','2026-10-12','POS Sales receipt for INV-2026-0013 (Cash: ₹3,264.00)',1,'2026-10-12 11:48:22'),(38,'PAY-202610-0018','customer_payment',1,1,NULL,39,NULL,3584.00,'cash','Bill INV-2026-0014','2026-10-12','POS Sales receipt for INV-2026-0014 (Cash: ₹3,584.00)',1,'2026-10-12 11:49:17'),(40,'PAY-202610-0019','customer_payment',1,1,NULL,41,NULL,3584.00,'cash','Bill INV-2026-0015','2026-10-12','POS Sales receipt for INV-2026-0015 (Cash: ₹3,584.00)',1,'2026-10-12 11:59:41'),(41,'PAY-202610-0020','customer_payment',1,1,NULL,42,NULL,8960.00,'cash','Bill INV-2026-0016','2026-10-12','POS Sales receipt for INV-2026-0016 (Cash: ₹8,960.00)',1,'2026-10-12 12:28:02'),(42,'PAY-202610-0021','customer_payment',1,1,NULL,43,NULL,3584.00,'cash','Bill INV-2026-0017','2026-10-12','POS Sales receipt for INV-2026-0017 (Cash: ₹3,584.00)',1,'2026-10-12 12:34:54'),(43,'PAY-202610-0022','customer_payment',1,1,NULL,44,NULL,3584.00,'cash','Bill INV-2026-0018','2026-10-12','POS Sales receipt for INV-2026-0018 (Cash: ₹3,584.00)',1,'2026-10-12 12:39:22'),(44,'PAY-202610-0023','customer_payment',1,1,NULL,45,NULL,3584.00,'cash','Bill INV-2026-0019','2026-10-12','POS Sales receipt for INV-2026-0019 (Cash: ₹3,584.00)',1,'2026-10-12 12:40:22'),(45,'PAY-202610-0024','customer_payment',1,1,NULL,46,NULL,2950.00,'cash','Bill INV-2026-0020','2026-10-12','POS Sales receipt for INV-2026-0020 (Cash: ₹2,950.00)',1,'2026-10-12 12:42:48'),(46,'PAY-202610-0025','customer_payment',1,1,NULL,47,NULL,2950.00,'cash','Bill INV-2026-0021','2026-10-12','POS Sales receipt for INV-2026-0021 (Cash: ₹2,950.00)',1,'2026-10-12 12:47:54'),(47,'PAY-202610-0026','customer_payment',1,3,NULL,48,NULL,2950.00,'cash','Bill INV-2026-0022','2026-10-12','POS Sales receipt for INV-2026-0022 (Cash: ₹2,950.00)',1,'2026-10-12 12:48:46'),(48,'PAY-202610-0027','customer_payment',1,1,NULL,49,NULL,1920.00,'cash','Bill INV-2026-0023','2026-10-12','POS Sales receipt for INV-2026-0023 (Cash: ₹1,920.00)',1,'2026-10-12 17:02:09'),(49,'PAY-202610-0028','customer_payment',1,1,NULL,50,NULL,2560.00,'cash','Bill INV-2026-0024','2026-10-12','POS Sales receipt for INV-2026-0024 (Cash: ₹2,560.00)',1,'2026-10-12 17:49:03'),(50,'PAY-202610-0029','customer_payment',1,1,NULL,51,NULL,1920.00,'cash','Bill INV-2026-0025','2026-10-12','POS Sales receipt for INV-2026-0025 (Cash: ₹1,920.00)',1,'2026-10-12 17:52:39'),(51,'PAY-202610-0030','customer_payment',1,1,NULL,52,NULL,1920.00,'cash','Bill INV-2026-0026','2026-10-12','POS Sales receipt for INV-2026-0026 (Cash: ₹1,920.00)',1,'2026-10-12 17:54:34'),(52,'PAY-202610-0031','customer_payment',1,1,NULL,53,NULL,72800.00,'cash','Bill INV-2026-0027','2026-10-12','POS Sales receipt for INV-2026-0027 (Cash: ₹72,800.00)',1,'2026-10-12 17:55:07'),(53,'PAY-202610-0032','customer_payment',1,1,NULL,54,NULL,72800.00,'cash','Bill INV-2026-0028','2026-10-12','POS Sales receipt for INV-2026-0028 (Cash: ₹72,800.00)',1,'2026-10-12 17:55:25'),(54,'PAY-202610-0033','customer_payment',1,1,NULL,55,NULL,72800.00,'cash','Bill INV-2026-0029','2026-10-12','POS Sales receipt for INV-2026-0029 (Cash: ₹72,800.00)',1,'2026-10-12 17:58:33'),(55,'PAY-202610-0034','customer_payment',1,1,NULL,56,NULL,72800.00,'cash','Bill INV-2026-0030','2026-10-12','POS Sales receipt for INV-2026-0030 (Cash: ₹72,800.00)',1,'2026-10-12 17:59:28'),(56,'PAY-202610-0035','customer_payment',1,1,NULL,57,NULL,8960.00,'cash','Bill INV-2026-0031','2026-10-12','POS Sales receipt for INV-2026-0031 (Cash: ₹8,960.00)',1,'2026-10-12 18:13:37');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'users','View Users','users.view','View users listing and profiles','2026-08-29 16:51:09'),(2,'users','Create Users','users.create','Create new staff user accounts','2026-08-29 16:51:09'),(3,'users','Edit Users','users.edit','Edit user information and status','2026-08-29 16:51:09'),(4,'users','Delete Users','users.delete','Delete user accounts','2026-08-29 16:51:09'),(5,'roles','View Roles','roles.view','View roles and permission matrices','2026-08-29 16:51:09'),(6,'roles','Manage Roles','roles.manage','Create, edit roles and assign permissions','2026-08-29 16:51:09'),(7,'departments','View Departments','departments.view','View departments list','2026-08-29 16:51:09'),(8,'departments','Manage Departments','departments.manage','Create and modify departments','2026-08-29 16:51:09'),(9,'catalog','View Categories','categories.view','View categories and subcategories','2026-08-29 16:51:09'),(10,'catalog','Manage Categories','categories.manage','Create, update, delete categories & subcategories','2026-08-29 16:51:09'),(11,'products','View Products','products.view','View products list and details','2026-08-29 16:51:09'),(12,'products','Create Products','products.create','Add new statues and religious products','2026-08-29 16:51:09'),(13,'products','Edit Products','products.edit','Modify product specs, pricing, and images','2026-08-29 16:51:09'),(14,'products','Delete Products','products.delete','Delete products from catalog','2026-08-29 16:51:09'),(15,'products','Export Products','products.export','Export product list to Excel/CSV','2026-08-29 16:51:09'),(16,'inventory','View Inventory','inventory.view','View current stock levels and history','2026-08-29 16:51:09'),(17,'inventory','Stock Adjustment','inventory.adjust','Perform stock adjustments and damage write-offs','2026-08-29 16:51:09'),(18,'inventory','Stock In','inventory.stock_in','Perform manual stock additions','2026-08-29 16:51:09'),(19,'customers','View Customers','customers.view','View customer directory and balances','2026-08-29 16:51:09'),(20,'customers','Create Customers','customers.create','Add new customers','2026-08-29 16:51:09'),(21,'customers','Edit Customers','customers.edit','Edit customer details and credit limits','2026-08-29 16:51:09'),(22,'customers','Delete Customers','customers.delete','Delete customers','2026-08-29 16:51:09'),(23,'suppliers','View Suppliers','suppliers.view','View artisans and suppliers directory','2026-08-29 16:51:09'),(24,'suppliers','Manage Suppliers','suppliers.manage','Add and edit supplier records','2026-08-29 16:51:09'),(25,'purchases','View Purchases','purchases.view','View purchase orders','2026-08-29 16:51:09'),(26,'purchases','Create Purchases','purchases.create','Create statue procurement orders','2026-08-29 16:51:09'),(27,'purchases','Approve Purchases','purchases.approve','Approve purchases and auto-increment stock','2026-08-29 16:51:09'),(28,'purchases','Cancel Purchases','purchases.cancel','Cancel purchase orders','2026-08-29 16:51:09'),(29,'billing','POS Terminal','billing.pos','Access point-of-sale billing terminal','2026-08-29 16:51:09'),(30,'billing','View Invoices','billing.view','View sales invoices list and history','2026-08-29 16:51:09'),(31,'billing','Create Invoice','billing.create','Generate and complete sales invoices','2026-08-29 16:51:09'),(32,'billing','Cancel Invoice','billing.cancel','Cancel sales invoices with audit note','2026-08-29 16:51:09'),(33,'billing','Print Invoice','billing.print','Print A4 and thermal receipts','2026-08-29 16:51:09'),(34,'billing','Sales Returns','billing.returns','Process statue returns and issue refunds','2026-08-29 16:51:09'),(35,'accounts','View Accounts','accounts.view','View cash book, bank book, and balances','2026-08-29 16:51:09'),(36,'accounts','Manage Payments','accounts.payments','Record customer receipts and supplier disbursements','2026-08-29 16:51:09'),(37,'accounts','View Expenses','expenses.view','View expense list and vouchers','2026-08-29 16:51:09'),(38,'accounts','Create Expenses','expenses.create','Submit new expense vouchers','2026-08-29 16:51:09'),(39,'accounts','Approve Expenses','expenses.approve','Approve expense payments','2026-08-29 16:51:09'),(40,'reports','Sales Reports','reports.sales','Access sales analytics and date filters','2026-08-29 16:51:09'),(41,'reports','Inventory Reports','reports.inventory','Access stock valuation and movement reports','2026-08-29 16:51:09'),(42,'reports','Financial Reports','reports.financial','Access P&L, collections, and expense reports','2026-08-29 16:51:09'),(43,'settings','Manage Settings','settings.manage','Configure company profile, taxes, and printers','2026-08-29 16:51:09'),(44,'audit','View Audit Logs','audit.view','Inspect full system audit trails','2026-08-29 16:51:09');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `supplier_id` int(10) unsigned DEFAULT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `subcategory_id` int(10) unsigned DEFAULT NULL,
  `brand` varchar(100) DEFAULT 'Divine Heritage',
  `description` text DEFAULT NULL,
  `god_name` varchar(100) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL COMMENT 'Brass, Marble, Panchaloha, Teak Wood, Black Stone, Clay, Copper, Bronze, Resin',
  `color` varchar(50) DEFAULT NULL,
  `height` decimal(8,2) DEFAULT NULL COMMENT 'in inches or cm',
  `width` decimal(8,2) DEFAULT NULL,
  `length` decimal(8,2) DEFAULT NULL,
  `weight` decimal(8,2) DEFAULT NULL COMMENT 'in kg',
  `size` varchar(50) DEFAULT NULL COMMENT 'Small, Medium, Large, Temple Size',
  `finish_type` varchar(50) DEFAULT NULL COMMENT 'Antique, Gold Plated, Glossy, Matte, Natural, Polished',
  `purchase_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `piece_rate` decimal(12,2) DEFAULT 0.00,
  `margin_percentage` decimal(8,2) DEFAULT 60.00,
  `selling_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `wholesale_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_percent` decimal(5,2) DEFAULT 0.00,
  `gst_percent` decimal(5,2) DEFAULT 12.00 COMMENT 'Standard GST % for idols & handicrafts',
  `hsn_code` varchar(20) DEFAULT '9701',
  `current_stock` int(11) NOT NULL DEFAULT 0,
  `min_stock` int(11) NOT NULL DEFAULT 2,
  `max_stock` int(11) NOT NULL DEFAULT 100,
  `stock_location` varchar(100) DEFAULT 'Main Showroom',
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','out_of_stock') DEFAULT 'active',
  `created_by` int(10) unsigned DEFAULT NULL,
  `updated_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `idx_prod_sku` (`sku`),
  KEY `idx_prod_barcode` (`barcode`),
  KEY `idx_prod_god` (`god_name`),
  KEY `idx_prod_material` (`material`),
  KEY `idx_prod_supplier` (`supplier_id`),
  CONSTRAINT `fk_products_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Vishnu','SKU-65632','SKU-65632','BAR-5716801659',NULL,NULL,NULL,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50000.00,0.00,60.00,1600.00,0.00,0.00,10.00,'9701',45,2,100,'Main Showroom',NULL,'active',NULL,NULL,'2026-10-10 22:18:07','2026-10-12 11:57:52'),(2,'Lord Nataraja Bronze 12 inch','SKU-21011','SKU-21011','BAR-TEST-NATARAJA',2,2,2,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,12500.00,2500.00,60.00,4000.00,0.00,0.00,12.00,'9701',5,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 16:43:45','2026-10-11 16:43:45'),(3,'Lord Shiva Idol 15in','SKU-19581','SKU-19581','BAR-TEST-SHIVA',3,5,4,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,12000.00,3000.00,60.00,5000.00,0.00,0.00,12.00,'9701',4,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 16:44:59','2026-10-11 16:44:59'),(4,'Bronze Murugan 6in','SKU-94843','SKU-94843','BAR-6288672354',4,5,5,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4500.00,1500.00,60.00,2500.00,0.00,0.00,18.00,'9701',0,2,100,'Main Showroom',NULL,'out_of_stock',1,NULL,'2026-10-11 16:44:59','2026-10-12 12:48:46'),(5,'Brass Lamp 2ft','SKU-90983','SKU-90983','BAR-2357617505',4,6,6,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,12000.00,2000.00,60.00,3200.00,0.00,0.00,12.00,'9701',0,2,100,'Main Showroom',NULL,'out_of_stock',1,NULL,'2026-10-11 16:44:59','2026-10-12 12:40:22'),(6,'Swamimalai Nataraja Masterpiece','SKU-17372','SKU-17372','BAR-SWAMI-001',5,7,7,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50000.00,50000.00,60.00,85000.00,0.00,0.00,12.00,'9701',1,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 16:44:59','2026-10-11 16:44:59'),(7,'Initial Product A','SKU-43423','SKU-43423','BAR-TEST-PROD-A',6,8,8,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2000.00,1000.00,60.00,1600.00,0.00,0.00,12.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 16:44:59','2026-10-11 16:44:59'),(8,'ragu','SKU-32044','SKU-32044','BAR-3727896577',7,6,6,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10000.00,1000.00,60.00,1600.00,0.00,0.00,10.00,'9701',10,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 16:48:22','2026-10-11 16:48:22'),(9,'Brass Ganesha Idol','SKU-81438','SKU-81438','BAR-5017731603',8,5,11,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5000.00,1000.00,60.00,8000.00,0.00,0.00,12.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:43:06','2026-10-12 18:13:37'),(10,'Handcrafted Teak Altar 4ft','SKU-57814','SKU-57814','BAR-4507495932',9,12,12,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,15000.00,60.00,65000.00,0.00,0.00,12.00,'9701',3,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:53:32','2026-10-11 17:53:32'),(11,'Heavy Bronze Gopuram Bell 10kg','SKU-38619','SKU-38619','BAR-4101210969',9,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,32000.00,8000.00,60.00,48000.00,0.00,0.00,18.00,'9701',4,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:54:28','2026-10-11 17:54:28'),(12,'Another Sacred Bell Model 2','SKU-31090','SKU-31090','BAR-8010001422',9,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,18000.00,9000.00,60.00,25000.00,0.00,0.00,18.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:55:15','2026-10-11 17:55:15'),(13,'Handcrafted Teak Altar 4ft','SKU-58965','SKU-58965','BAR-3211072816',10,12,12,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,15000.00,60.00,65000.00,0.00,0.00,12.00,'9701',0,2,100,'Main Showroom',NULL,'out_of_stock',1,NULL,'2026-10-11 17:58:19','2026-10-12 17:58:33'),(14,'Handcrafted Teak Altar 4ft','SKU-84805','SKU-84805','BAR-5217448447',11,12,12,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,15000.00,60.00,65000.00,0.00,0.00,12.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:03','2026-10-12 17:59:28'),(15,'Heavy Bronze Gopuram Bell 10kg','SKU-23347','SKU-23347','BAR-2847207074',11,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,32000.00,8000.00,60.00,48000.00,0.00,0.00,18.00,'9701',4,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:03','2026-10-11 17:59:03'),(16,'Temple Puja Hanging Bell 5kg','SKU-60927','SKU-60927','BAR-2392173842',11,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8000.00,4000.00,60.00,12000.00,0.00,0.00,18.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:03','2026-10-11 17:59:03'),(17,'Handcrafted Teak Altar 4ft','SKU-78242','SKU-78242','BAR-7297887165',12,12,12,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,15000.00,60.00,65000.00,0.00,0.00,12.00,'9701',3,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:37','2026-10-11 17:59:37'),(18,'Heavy Bronze Gopuram Bell 10kg','SKU-45754','SKU-45754','BAR-3849332170',12,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,32000.00,8000.00,60.00,48000.00,0.00,0.00,18.00,'9701',4,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:38','2026-10-11 17:59:38'),(19,'Temple Puja Hanging Bell 5kg','SKU-60493','SKU-60493','BAR-3938863480',12,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8000.00,4000.00,60.00,12000.00,0.00,0.00,18.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 17:59:38','2026-10-11 17:59:38'),(20,'gorsss','SKU-84443','SKU-84443','BAR-9039276304',13,10,10,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,3000.00,60.00,4800.00,0.00,0.00,20.00,'9701',15,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:02:35','2026-10-11 18:02:35'),(21,'Handcrafted Teak Altar 4ft','SKU-13688','SKU-13688','BAR-6307910333',14,12,12,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,45000.00,15000.00,60.00,65000.00,0.00,0.00,12.00,'9701',3,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:12:21','2026-10-11 18:12:21'),(22,'Heavy Bronze Gopuram Bell 10kg','SKU-36579','SKU-36579','BAR-2919521641',14,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,32000.00,8000.00,60.00,48000.00,0.00,0.00,18.00,'9701',4,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:12:21','2026-10-11 18:12:21'),(23,'Temple Puja Hanging Bell 5kg','SKU-43562','SKU-43562','BAR-8445027187',14,13,13,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8000.00,4000.00,60.00,12000.00,0.00,0.00,18.00,'9701',2,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:12:21','2026-10-11 18:12:21'),(24,'Vishnu','SKU-47311','SKU-47311','BAR-2621240640',15,8,8,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,200000.00,1000.00,60.00,1600.00,0.00,0.00,40.00,'9701',200,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:14:41','2026-10-11 18:14:41'),(25,'Siva','SKU-98275','SKU-98275','BAR-3581666269',16,14,14,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,250000.00,5000.00,60.00,8000.00,0.00,0.00,20.00,'9701',50,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-11 18:17:06','2026-10-11 18:17:06'),(53,'fik','SKU-90616','SKU-90616','BAR-6717201705',33,15,16,'Divine Heritage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5000.00,1000.00,60.00,1600.00,0.00,0.00,20.00,'9701',1,2,100,'Main Showroom',NULL,'active',1,NULL,'2026-10-12 08:08:59','2026-10-12 17:54:34');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `purchase_price` decimal(12,2) NOT NULL,
  `discount_percent` decimal(5,2) DEFAULT 0.00,
  `tax_percent` decimal(5,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_id` (`purchase_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchases` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `purchase_no` varchar(50) NOT NULL,
  `supplier_id` int(10) unsigned NOT NULL,
  `purchase_date` date NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','pending','approved','received','cancelled') DEFAULT 'pending',
  `payment_status` enum('unpaid','partial','paid') DEFAULT 'unpaid',
  `notes` text DEFAULT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `approved_by` int(10) unsigned DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_no` (`purchase_no`),
  KEY `supplier_id` (`supplier_id`),
  KEY `created_by` (`created_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_purch_no` (`purchase_no`),
  KEY `idx_purch_date` (`purchase_date`),
  CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchases_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `role_id` int(10) unsigned NOT NULL,
  `permission_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(2,1),(2,2),(2,3),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),(2,22),(2,23),(2,24),(2,25),(2,26),(2,27),(2,28),(2,29),(2,30),(2,31),(2,32),(2,33),(2,34),(2,35),(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,44),(3,11),(3,12),(3,13),(3,14),(3,15),(3,16),(3,19),(3,20),(3,21),(3,22),(3,29),(3,30),(3,31),(3,32),(3,33),(3,34),(3,40),(4,29),(4,31),(4,33),(5,19),(5,23),(5,25),(5,30),(5,35),(5,36),(5,37),(5,38),(5,39),(5,40),(5,41),(5,42),(6,30),(6,35),(6,36),(6,37),(6,38),(6,42),(7,9),(7,10),(7,11),(7,12),(7,13),(7,14),(7,15),(7,16),(7,17),(7,18),(7,23),(7,24),(7,25),(7,26),(7,27),(7,28),(7,41),(8,11),(8,19),(8,29),(9,9),(9,11),(9,16),(10,7),(10,8),(10,9),(10,10),(10,11),(10,12),(10,13),(10,14),(10,15),(10,16),(10,17),(10,18),(10,19),(10,20),(10,21),(10,22),(10,23),(10,24),(10,25),(10,26),(10,27),(10,28),(10,29),(10,30),(10,31),(10,32),(10,33),(10,34),(11,7),(11,8),(11,16),(11,17),(11,18),(11,23),(11,24),(11,25),(11,26),(11,27),(11,28),(11,29),(11,30),(11,31),(11,32),(11,33),(11,34),(11,35),(11,36),(11,37),(11,38),(11,39),(11,40),(11,41),(11,42),(12,29),(12,31),(12,33);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','super-admin','Complete unrestricted system access',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(2,'Admin','admin','Administrative management and high-level operations',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(3,'Billing Manager','billing-manager','Supervises POS billing, sales returns, and discounts',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(4,'Billing Staff','billing-staff','Performs POS sales, customer searches, and receipt printing',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(5,'Accounts Manager','accounts-manager','Supervises finances, approving expenses and reconciliations',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(6,'Accountant','accountant','Manages daily cash book, bank entries, and supplier payouts',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(7,'Inventory Manager','inventory-manager','Controls stock transactions, adjustments, and warehouse transfers',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(8,'Sales Staff','sales-staff','Assists customers, manages quotes and catalogs',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(9,'Viewer','viewer','Read-only access to catalogs and non-sensitive reports',1,'active','2026-08-29 16:51:09','2026-08-29 16:51:09'),(10,'Custom Warehouse Manager','custom-warehouse-manager','Custom role for warehouse manager with specific navigations removed',0,'active','2026-09-24 13:58:32','2026-09-24 13:58:32'),(11,'Custom Accountant','custom-accountant','Custom role for accountant with specific navigations removed',0,'active','2026-09-24 14:21:49','2026-09-24 14:21:49'),(12,'Custom Cashier','custom-cashier','Cashier role without product catalog access',0,'active','2026-09-24 14:48:42','2026-09-24 14:48:42');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_return_items`
--

DROP TABLE IF EXISTS `sales_return_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_return_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sales_return_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_return_id` (`sales_return_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_return_items_ibfk_1` FOREIGN KEY (`sales_return_id`) REFERENCES `sales_returns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_return_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_return_items`
--

LOCK TABLES `sales_return_items` WRITE;
/*!40000 ALTER TABLE `sales_return_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_return_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_returns`
--

DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_returns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `return_no` varchar(50) NOT NULL,
  `invoice_id` int(10) unsigned NOT NULL,
  `customer_id` int(10) unsigned NOT NULL,
  `return_date` date NOT NULL,
  `total_refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `refund_method` enum('cash','upi','bank_transfer','credit_note') DEFAULT 'cash',
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_by` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `return_no` (`return_no`),
  KEY `invoice_id` (`invoice_id`),
  KEY `customer_id` (`customer_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `sales_returns_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `sales_returns_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `sales_returns_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_returns`
--

LOCK TABLES `sales_returns` WRITE;
/*!40000 ALTER TABLE `sales_returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `setting_group` varchar(50) NOT NULL DEFAULT 'general',
  `key_name` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'company','company_name','Sastha Sasti','Registered Enterprise Trade Name','2026-08-29 16:51:09','2026-09-25 06:53:26'),(2,'company','company_tagline','Sacred Idols, Panchaloha Bronzes & Temple Artifacts','Sub-heading on invoices and receipts','2026-08-29 16:51:09','2026-08-29 16:51:09'),(3,'company','company_address','No.41/13, Narayanappan Naiken Main St, NN Garden, Washermanpet, Chennai, Tamil Nadu 600021','Physical showroom address','2026-08-29 16:51:09','2026-10-12 12:46:21'),(4,'company','company_phone','9840796300','Store customer support lines','2026-08-29 16:51:09','2026-10-12 12:46:21'),(5,'company','company_email','contact@godstatueerp.com','Official correspondence email','2026-08-29 16:51:09','2026-08-29 16:51:09'),(6,'company','company_gstin','33AABCG1234H1Z0','Registered Goods & Services Tax Identification Number','2026-08-29 16:51:09','2026-08-29 16:51:09'),(7,'billing','invoice_prefix','DIVYA-','Prefix for generated tax invoices','2026-08-29 16:51:09','2026-08-29 16:51:09'),(8,'billing','starting_invoice_no','1001','Starting sequence number for sales invoices','2026-08-29 16:51:09','2026-08-29 16:51:09'),(9,'billing','default_gst_percent','12','Default GST tax rate percentage','2026-08-29 16:51:09','2026-08-29 16:51:09'),(10,'billing','currency_symbol','Ôé╣','Currency Symbol for display and receipts','2026-08-29 16:51:09','2026-08-29 16:51:09'),(11,'billing','currency_code','INR','Currency Code ISO 4217','2026-08-29 16:51:09','2026-08-29 16:51:09'),(12,'billing','enable_roundoff','1','Automatically round-off invoice grand total','2026-08-29 16:51:09','2026-08-29 16:51:09'),(13,'print','invoice_paper_size','A4','Default invoice layout (A4 / Thermal-80mm / Thermal-58mm)','2026-08-29 16:51:09','2026-08-29 16:51:09'),(14,'print','thermal_paper_width','80mm','POS thermal receipt width','2026-08-29 16:51:09','2026-08-29 16:51:09'),(15,'print','invoice_footer_note','All idols are handcrafted and casted in accordance with Shilpa Shastra. Consecrated with holy mantras.','Invoice footer blessing','2026-08-29 16:51:09','2026-08-29 16:51:09'),(16,'print','terms_conditions','1. Goods once sold can only be returned in unbroken condition within 7 days.\n2. 100% replacement guarantee for manufacturing casting defects.\n3. Subject to Chennai Jurisdiction only.','Standard terms printed on invoices','2026-08-29 16:51:09','2026-08-29 16:51:09'),(17,'system','timezone','Asia/Kolkata','System Default Timezone','2026-08-29 16:51:09','2026-08-29 16:51:09'),(18,'system','date_format','d-m-Y','Visual Date Display Format','2026-08-29 16:51:09','2026-08-29 16:51:09'),(19,'system','items_per_page','15','Default server-side pagination rows','2026-08-29 16:51:09','2026-08-29 16:51:09'),(20,'company','company_upi_id','sasthasasti@sbi','Shop Owner UPI ID for dynamic QR generation','2026-09-25 07:27:10','2026-09-25 07:27:10');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,1,'lord ganesh','SUB-LOR-1672','',NULL,'active','2026-10-11 15:57:22','2026-10-11 15:57:22'),(2,2,'Dancing Pose 6935','SUB-DAN-2272','',NULL,'active','2026-10-11 16:43:45','2026-10-11 16:43:45'),(3,4,'Chola Dynasty 922','SUB-CHO-3097','',NULL,'active','2026-10-11 16:44:58','2026-10-11 16:44:58'),(4,5,'Standing Pose','SUB-STA-5334','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(5,5,'Murugan Pose','SUB-MUR-7546','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(6,6,'Deepam','SUB-DEE-4541','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(7,7,'Chola Style','SUB-CHO-4018','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(8,8,'Standard','SUB-STA-2528','',NULL,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(9,9,'Sub Under A 387','SUB-SUB-2206','',NULL,'active','2026-10-11 16:45:00','2026-10-11 16:45:00'),(10,10,'Sub Under B 354','SUB-SUB-9883','',NULL,'active','2026-10-11 16:45:00','2026-10-11 16:45:00'),(11,5,'Brass Idols','SUB-BRA-2865','',NULL,'active','2026-10-11 17:43:06','2026-10-11 17:43:06'),(12,12,'Teakwood Altars','SUB-TEA-9493','',NULL,'active','2026-10-11 17:53:32','2026-10-11 17:53:32'),(13,13,'Gopuram Bells','SUB-GOP-8794','',NULL,'active','2026-10-11 17:54:28','2026-10-11 17:54:28'),(14,14,'loyola','SUB-LOY-7587','',NULL,'active','2026-10-11 18:16:37','2026-10-11 18:16:37'),(15,5,'Bronze','SUB-BRO-1109','',NULL,'active','2026-10-12 08:01:16','2026-10-12 08:01:16'),(16,15,'big','SUB-BIG-6381','',NULL,'active','2026-10-12 08:08:59','2026-10-12 08:08:59');
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_payment_history`
--

DROP TABLE IF EXISTS `supplier_payment_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_payment_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` int(10) unsigned NOT NULL,
  `amount_paid` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `balance_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('Paid','Unpaid','Partially Paid') NOT NULL DEFAULT 'Unpaid',
  `payment_method` varchar(50) NOT NULL DEFAULT 'Cash',
  `payment_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_supp_hist_supp` (`supplier_id`),
  CONSTRAINT `fk_supp_hist_supp` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_payment_history`
--

LOCK TABLES `supplier_payment_history` WRITE;
/*!40000 ALTER TABLE `supplier_payment_history` DISABLE KEYS */;
INSERT INTO `supplier_payment_history` VALUES (1,14,25000.00,85000.00,60000.00,'Partially Paid','UPI','2026-10-12','Test advance payment',1,'2026-10-12 06:05:56'),(2,14,85000.00,85000.00,0.00,'Paid','Bank Transfer','2026-10-12','Full settlement',1,'2026-10-12 06:05:56'),(3,14,0.00,85000.00,85000.00,'Unpaid','Cash','2026-10-12','Reset to unpaid',1,'2026-10-12 06:05:56'),(8,1,0.00,0.00,0.00,'Paid','Cash','2026-10-12','HTTP test',1,'2026-10-12 06:24:57'),(9,1,0.00,0.00,0.00,'Paid','Cash','2026-10-12','HTTP test',1,'2026-10-12 06:26:22'),(10,16,250000.00,250000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:29:29'),(11,15,200000.00,200000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:29:44'),(12,14,85000.00,85000.00,0.00,'Paid','Cash','2026-10-12','Reset to unpaid',1,'2026-10-12 06:29:58'),(13,13,45000.00,45000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:30:11'),(14,12,85000.00,85000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:30:25'),(15,11,85000.00,85000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:30:35'),(16,10,45000.00,45000.00,0.00,'Paid','Cash','2026-10-12','',1,'2026-10-12 06:30:45'),(30,33,5000.00,5000.00,0.00,'Paid','Cash','2026-10-12','Supplier registration payment',1,'2026-10-12 08:08:59');
/*!40000 ALTER TABLE `supplier_payment_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_payments`
--

DROP TABLE IF EXISTS `supplier_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier_id` int(10) unsigned NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('Paid','Unpaid','Partially Paid') NOT NULL DEFAULT 'Unpaid',
  `payment_method` varchar(50) NOT NULL DEFAULT 'Cash',
  `payment_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `fk_supp_pay_supp` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_payments`
--

LOCK TABLES `supplier_payments` WRITE;
/*!40000 ALTER TABLE `supplier_payments` DISABLE KEYS */;
INSERT INTO `supplier_payments` VALUES (1,14,85000.00,'Paid','Cash','2026-10-12','Reset to unpaid','2026-10-12 06:05:56','2026-10-12 06:29:58'),(8,1,0.00,'Paid','Cash','2026-10-12','HTTP test','2026-10-12 06:24:57','2026-10-12 06:26:22'),(10,16,250000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:29:29','2026-10-12 06:29:29'),(11,15,200000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:29:44','2026-10-12 06:29:44'),(13,13,45000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:30:11','2026-10-12 06:30:11'),(14,12,85000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:30:25','2026-10-12 06:30:25'),(15,11,85000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:30:35','2026-10-12 06:30:35'),(16,10,45000.00,'Paid','Cash','2026-10-12','','2026-10-12 06:30:45','2026-10-12 06:30:45'),(30,33,5000.00,'Paid','Cash','2026-10-12','Supplier creation / product sync','2026-10-12 08:08:59','2026-10-12 08:08:59');
/*!40000 ALTER TABLE `supplier_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suppliers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier_code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `gst_number` varchar(30) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `bank_ifsc` varchar(20) DEFAULT NULL,
  `outstanding_balance` decimal(12,2) DEFAULT 0.00,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_code` (`supplier_code`),
  KEY `idx_supp_code` (`supplier_code`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'SUP-0001','Darvin',NULL,'9342745599','','Loyola','Chennai','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-10 22:18:07','2026-10-10 22:18:07'),(2,'SUP-TEST-1942','Artisan Sthapathi 709',NULL,'9876543210',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 16:43:45','2026-10-11 16:43:45'),(3,'SUP-9922','Artisan Test 3',NULL,'9876543211',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 16:44:58','2026-10-11 16:44:58'),(4,'SUP-5371','Artisan Test 4',NULL,'9876543212',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(5,'SUP-0005','Swamimalai Bronze Foundry',NULL,'9944556677','swami@foundry.com','Car Street','Swamimalai','Tamil Nadu','33ABCDE9999F1Z0',NULL,NULL,NULL,0.00,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(6,'SUP-9687','Existing Supplier Test 6',NULL,'9888877777',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 16:44:59','2026-10-11 16:44:59'),(7,'SUP-0007','Joel',NULL,'9342745599',NULL,'Loyola','Chennai','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-11 16:48:22','2026-10-11 16:48:22'),(8,'SUP-0008','Test Artisan Supplier',NULL,'9876543210',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 17:43:06','2026-10-11 17:43:06'),(9,'SUP-0009','Kumbakonam Wood Crafts',NULL,'9443311223',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 17:53:32','2026-10-11 17:53:32'),(10,'SUP-0010','Kumbakonam Wood Crafts',NULL,'9443311223',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 17:58:19','2026-10-11 17:58:19'),(11,'SUP-0011','Kumbakonam Wood Crafts',NULL,'9443311223',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 17:59:03','2026-10-11 17:59:03'),(12,'SUP-0012','Kumbakonam Wood Crafts',NULL,'9443311223',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 17:59:37','2026-10-11 17:59:37'),(13,'SUP-0013','ajay',NULL,'9342745599',NULL,'Loyola','Chennai','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-11 18:02:35','2026-10-11 18:02:35'),(14,'SUP-0014','Kumbakonam Wood Crafts',NULL,'9443311223',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,'active','2026-10-11 18:12:21','2026-10-12 06:29:58'),(15,'SUP-0015','godson',NULL,'9342745599',NULL,'Loyola','Tiruchirappalli','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-11 18:14:41','2026-10-11 18:14:41'),(16,'SUP-0016','amal',NULL,'9342745599',NULL,'licet','Tiruchirappalli','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-11 18:17:06','2026-10-11 18:17:06'),(33,'SUP-0017','jeami',NULL,'9342745599',NULL,'Loyola','Chennai','Tamil Nadu','33ABCDE1234F1Z5',NULL,NULL,NULL,0.00,'active','2026-10-12 08:08:59','2026-10-12 08:08:59');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permissions` (
  `user_id` int(10) unsigned NOT NULL,
  `permission_id` int(10) unsigned NOT NULL,
  `is_granted` tinyint(1) DEFAULT 1 COMMENT '1=Granted, 0=Revoked explicitly',
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (5,31,0),(5,32,0);
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  `department_id` int(10) unsigned DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Shree Mahadev (System Master)','superadmin','admin@godstatueerp.com','+91 9876543210','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',1,1,NULL,'active','f923c52e7b387ad71d9b26301f8b3539f04d828b469911591668d39af2685f71','2026-10-12 23:24:26','::1','2026-08-29 16:51:09','2026-10-12 17:54:26'),(2,'Rajesh Sharma (Store Admin)','rajesh','rajesh@godstatueerp.com','+91 9840112233','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',2,1,NULL,'active',NULL,NULL,NULL,'2026-08-29 16:51:09','2026-08-30 07:32:14'),(3,'Anand Kumar (Billing Head)','anand','anand@godstatueerp.com','+91 9840223344','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',12,2,NULL,'active','c852c354d3944d9171955f7b63a947f4a69585b20c4f9aad140a3ca4b2ae2900','2026-09-24 20:19:40','::1','2026-08-29 16:51:09','2026-09-24 14:49:40'),(4,'Priya Sundaram (POS Cashier)','priya','priya@godstatueerp.com','+91 9840334455','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',12,2,NULL,'active','0eb9c3f28f4220576de7988b52904126d7ce60266abf44d2682246db62cb7867','2026-10-06 19:16:51','::1','2026-08-29 16:51:09','2026-10-06 13:46:51'),(5,'Venkatesh Iyer (Chief Accountant)','venkatesh','venkat@godstatueerp.com','+91 9840445566','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',11,4,NULL,'active','8e1853e2bc0dae543c82af6d3237551a66914a367ec6e78d8dff26a3d7e1e90c','2026-09-25 12:14:49','::1','2026-08-29 16:51:09','2026-09-25 06:44:49'),(6,'Muruganathan (Warehouse Lead)','murugan','murugan@godstatueerp.com','+91 9840556677','$2y$10$j17r5KbQ8BXM5z8t0P1Nq.VB52XMsRWnjIEy/1Vb.hDxiVkEqPNVO',10,3,NULL,'active','9fe5b48891eed2e73ddd9f9582086680b6c727775219cb67916a734b3ce7b0e9','2026-09-24 20:26:21','::1','2026-08-29 16:51:09','2026-09-24 14:56:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 11:36:12
