-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: unithrift
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,250.00),(2,2,2,2,550.00),(3,2,3,13,385.00),(4,3,1,1,250.00),(5,3,2,1,550.00),(6,3,3,1,385.00),(7,4,2,1,550.00),(8,4,3,1,385.00),(9,4,4,1,450.00),(10,5,1,1,250.00),(11,5,2,1,550.00),(12,5,3,1,385.00),(13,6,14,1,799.99);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('in_progress','pending','completed','canceled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,17,250.00,'pending','2026-02-25 10:51:11','paid'),(2,17,6105.00,'pending','2026-02-25 12:13:52','paid'),(3,17,1185.00,'pending','2026-02-25 12:32:22','paid'),(4,17,1385.00,'pending','2026-02-25 12:35:43','paid'),(5,17,1185.00,'pending','2026-02-25 12:39:12','pending'),(6,18,799.99,'pending','2026-02-27 08:22:26','paid');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('card','paypal','cash') NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,250.00,'paypal','completed','UT-1772016685149-567','2026-02-25 10:51:25','2026-02-25 10:51:25'),(2,2,6105.00,'card','completed','UT-1772021648627-623','2026-02-25 12:14:08','2026-02-25 12:14:08'),(3,3,1185.00,'card','completed','UT-1772022762296-512','2026-02-25 12:32:42','2026-02-25 12:32:42'),(4,4,1385.00,'paypal','completed','UT-1772022949682-128','2026-02-25 12:35:49','2026-02-25 12:35:49'),(5,4,1385.00,'card','completed','UT-1772022981914-334','2026-02-25 12:36:21','2026-02-25 12:36:21'),(6,6,799.99,'cash','completed','UT-1772180549373-342','2026-02-27 08:22:29','2026-02-27 08:22:29');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `quantity` int DEFAULT '1',
  `category` varchar(50) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','sold','removed') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,5,'Bootleg Jeans','High quality denim bootleg jeans',250.00,10,'Pants','30','bootlegged-jeans.png','available','2026-02-16 08:57:45'),(2,6,'Nike Air Force 1','Classic white Nike sneakers with cushioned sole',550.00,15,'Sneakers','42','nike-af1.png','available','2026-02-16 09:00:36'),(3,7,'Converse Sneakers','Classic canvas Converse sneakers',385.00,20,'Sneakers','41','converse.png','available','2026-02-16 09:00:36'),(4,8,'Oversized Hoodie','Comfortable oversized cotton hoodie',450.00,25,'Hoodies','M','oversized-hoodie.png','available','2026-02-16 09:00:36'),(5,9,'Varsity Jacket','Stylish varsity jacket with leather sleeves',300.00,8,'Jackets','L','varsity-jacket.png','available','2026-02-16 09:00:36'),(6,10,'Leather Jacket','Premium black leather jacket',450.00,5,'Jackets','L','leather-jacket.png','available','2026-02-16 09:00:36'),(7,11,'Graphic Tee','Trendy printed cotton graphic t-shirt',60.00,30,'T-Shirts','M','graphic-tee.png','available','2026-02-16 09:00:36'),(8,12,'Casio','Custom strapped, brown Casio watch',380.00,1,'Accessories','Adjustable','casio.png','available','2026-02-16 10:55:54'),(9,13,'Assorted Keychain','Multiple assorted keychains',25.00,1,'Accessories','None','keychain.png','available','2026-02-16 11:11:51'),(10,9,'Grunge Bracelets','A pack of grunge style bracelets',110.00,1,'Accessories','None','grungebracelet.png','available','2026-02-26 06:50:32'),(11,8,'Y2K Shirt','MMA elite y2k style shirt',94.50,0,'T-Shirts','M','y2k-shirt.png','sold','2026-02-25 07:40:20'),(12,10,'iPod Mirror','Full body iPod style mirror',300.00,1,'Decoration','142x71cm','ipodmirror.png','available','2026-02-11 18:01:32'),(13,6,'Retro Hat','Retro style Marlboro racing hat',45.99,1,'Accessories','None','racingcap.png','available','2026-02-24 09:55:46'),(14,7,'Dr Martens','Dr. Martens 939 Ben boots',799.99,0,'Shoes','10','drmartens.png','sold','2026-02-26 06:50:32'),(15,6,'Baggy Jeans','Airbrushed baggy jeans, grungy/streetwear/y2k look',199.00,0,'Pants','28','baggyjeans.png','sold','2026-02-21 12:11:53');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`product_id`,`reviewer_id`),
  KEY `reviewer_id` (`reviewer_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `phone_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Thina Maliwa','ThinaMadmin@gmail.com','Teemoney1','admin',NULL,'2026-02-20 07:22:38'),(2,'Yaqoob Samsodien','YaqoobSadmin@gmail.com','Yaqoob2','admin',NULL,'2026-02-20 07:22:38'),(3,'Tentsoalo','TKadmin@gmmail.com','TK3','admin',NULL,'2026-02-20 07:22:38'),(4,'Emihle Dumo','EmihleDadmin@gmail.com','Emza4','admin',NULL,'2026-02-20 07:22:38'),(5,'Michael Jackson','MichaelJ@yahoo.com','Mike5','user',NULL,'2026-02-20 07:22:38'),(6,'Jordan Carter','JordanC@yahoo.com','Jordy6','user',NULL,'2026-02-20 07:22:38'),(7,'Ed Hardy','EdH@yahoo.com','Ed7','user',NULL,'2026-02-20 07:22:38'),(8,'Austin Babbit','Austinb@yahoo.com','Aussie8','user',NULL,'2026-02-20 07:22:38'),(9,'Richard Stark','RichardS@yahoo.com','Rich9','user',NULL,'2026-02-20 07:22:38'),(10,'Johnny Dang','JohnnyD@yahoo.com','Johnny10','user',NULL,'2026-02-20 07:22:38'),(11,'Emihle','EmihleDu@gmail.com','$2b$10$lD9/rwBtjsZnj.y0JmnFpuFKdnpJ3gj/qCs96MS0pPc76UpTCFq.y','user',NULL,'2026-02-20 07:22:38'),(12,'siza','siza@gmail.com','$2b$10$uz7UA9W651rs1.M5Y5SL6e7YKBYzjkDLj9gmIs8xEdQe0jHckrx1.','user',NULL,'2026-02-20 07:22:38'),(13,'sam','sam@gmail.com','$2b$10$cwkyXUEpoXATvcOj8J5wd.5Ar47VtdbKK7nYAHRBXDh7H2nbXOoJS','user',NULL,'2026-02-20 07:22:38'),(14,'TK','TK@gmail.com','$2b$10$3zJ0pW6.Dt2Y01b7s8UAJeqPPGUd1ayoTQwOLlcVdrv/3K2NzhmK2','user',NULL,'2026-02-20 07:22:38'),(15,'Emihle','emihleadmin@gmail.com','$2b$10$fGJHsie5laWVRIGC8veptODJm2aPLosb8gOG.NJ4h6HaWj28DEsyC','admin',NULL,'2026-02-20 07:22:38'),(16,'sisipho','sisipho@email.com','$2b$10$nDbR426z79i0ERALLGr7zOa2hD5rhiEXuoAw9.diY6AIUm6SWxMSa','user',NULL,'2026-02-20 07:22:38'),(17,'Abdul Jaleel','AJ@gmail.com','$2b$10$i1qROXjgdw8s7XZ6vlXdMevcNIWGHlqgo07NsfJSe4/UZeWGK0VYG','user','0674345632','2026-02-24 09:42:07'),(18,'Thina','thina@gmail.com','$2b$10$xHxceljCCQ2EKgH6//WSl.74nRwum6ZwmBhUSxN.QNNRgnBJKM7zu','user','0815928431','2026-02-27 07:52:53');
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

-- Dump completed on 2026-02-27 10:25:49
