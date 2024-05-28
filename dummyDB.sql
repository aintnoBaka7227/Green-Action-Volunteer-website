-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: greenAction
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `greenAction`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `greenAction` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `greenAction`;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (1,4);
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branch`
--

DROP TABLE IF EXISTS `Branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `street_address` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,'South Australia','123-123-1234','1 Rundle Mall St','Adelaide','SA','5000'),(2,'Victoria','456-456-4567','1 Bourke Street','Melbourne','VIC','3000'),(3,'New South Wales','789-789-6789','1 Bondi St','Sydney','NSW','2000');
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_type` varchar(30) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `content` text,
  `is_public` tinyint(1) DEFAULT NULL,
  `street_address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `Event_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES (1,'Charity Event','12:00:00','2024-06-01','Annual charity event for fundraising.',1,'123 King William St','Adelaide','SA','5000',1),(2,'Community Meeting','13:00:00','2024-07-01','Monthly community meeting.',0,'123 Grote St','Adelaide','SA','5000',1),(3,'Charity Event','12:00:00','2024-06-01','Annual charity event for fundraising.',1,'123 Queen St','Melbourne','VIC','3000',2),(4,'Community Meeting','13:00:00','2024-07-01','Monthly community meeting.',0,'456 Queen St','Melbourne','VIC','3000',2),(5,'Charity Event','12:00:00','2024-06-01','Annual charity event for fundraising.',1,'123 Bondi St','Sydney','NSW','2000',3),(6,'Community Meeting','13:00:00','2024-07-01','Monthly community meeting.',0,'456 Bondi St','Sydney','NSW','2000',3);
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventNotification`
--

DROP TABLE IF EXISTS `EventNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventNotification` (
  `event_notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`event_notification_id`),
  KEY `notification_id` (`notification_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventNotification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`notification_id`),
  CONSTRAINT `EventNotification_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventNotification`
--

LOCK TABLES `EventNotification` WRITE;
/*!40000 ALTER TABLE `EventNotification` DISABLE KEYS */;
INSERT INTO `EventNotification` VALUES (1,1,1),(2,2,2),(3,3,3),(4,4,4),(5,5,5),(6,6,6);
/*!40000 ALTER TABLE `EventNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventRSVP`
--

DROP TABLE IF EXISTS `EventRSVP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventRSVP` (
  `rsvp_id` int NOT NULL AUTO_INCREMENT,
  `volunteer_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`rsvp_id`),
  KEY `volunteer_id` (`volunteer_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventRSVP_ibfk_1` FOREIGN KEY (`volunteer_id`) REFERENCES `Volunteer` (`volunteer_id`),
  CONSTRAINT `EventRSVP_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventRSVP`
--

LOCK TABLES `EventRSVP` WRITE;
/*!40000 ALTER TABLE `EventRSVP` DISABLE KEYS */;
INSERT INTO `EventRSVP` VALUES (11,4,1),(12,4,2),(13,5,3),(14,5,4),(15,6,5),(16,6,6),(17,7,5),(18,7,6);
/*!40000 ALTER TABLE `EventRSVP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventUpdate`
--

DROP TABLE IF EXISTS `EventUpdate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventUpdate` (
  `update_id` int NOT NULL AUTO_INCREMENT,
  `update_title` varchar(100) DEFAULT NULL,
  `content` text,
  `is_public` tinyint(1) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`update_id`),
  KEY `branch_id` (`branch_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventUpdate_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`),
  CONSTRAINT `EventUpdate_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventUpdate`
--

LOCK TABLES `EventUpdate` WRITE;
/*!40000 ALTER TABLE `EventUpdate` DISABLE KEYS */;
INSERT INTO `EventUpdate` VALUES (1,'Charity Event Reminder','Don\'t forget to attend the charity event!',1,1,1),(2,'Meeting Agenda','Discussing community issues.',0,1,2),(3,'Charity Event Reminder','Don\'t forget to attend the charity event!',1,2,3),(4,'Meeting Agenda','Discussing community issues.',0,2,4),(5,'Charity Event Reminder','Don\'t forget to attend the charity event!',1,3,5),(6,'Meeting Agenda','Discussing community issues.',0,3,6),(7,'Charity Event Reminder','Bring some cash to the charity event!',0,1,1),(8,'Charity Event Reminder','Bring some cash to the charity event!',0,2,3),(9,'Charity Event Reminder','Bring some cash to the charity event!',0,3,5);
/*!40000 ALTER TABLE `EventUpdate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Manager`
--

DROP TABLE IF EXISTS `Manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Manager` (
  `manager_id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  KEY `branch_id` (`branch_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Manager_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`),
  CONSTRAINT `Manager_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Manager`
--

LOCK TABLES `Manager` WRITE;
/*!40000 ALTER TABLE `Manager` DISABLE KEYS */;
INSERT INTO `Manager` VALUES (1,1,1),(2,2,3),(3,3,2);
/*!40000 ALTER TABLE `Manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `status` varchar(30) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES (1,'New Event: Charity Event','Sent',1),(2,'New Event: Meeting Agenda','Sent',1),(3,'New Event: Charity Event','Sent',2),(4,'New Event: Meeting Agenda','Sent',2),(5,'New Event: Charity Event','Sent',3),(6,'New Event: Meeting Agenda','Sent',3),(7,'New Update: Charity Event Reminder','Pending',1),(8,'New Update: Meeting Agenda purpose','Sent',1),(9,'New Update: Charity Event Reminder','Sent',2),(10,'New Update: Meeting Agenda purpose','Pending',2),(11,'New Update: Charity Event Reminder','Pending',3),(12,'New Update: Meeting Agenda purpose','Pending',3),(13,'New Update: Prepare for charity event','Pending',1),(14,'New Update: Prepare for charity event','Sent',2),(15,'New Update: Prepare for charity event','Pending',3);
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotificationSubscription`
--

DROP TABLE IF EXISTS `NotificationSubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationSubscription` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `subscribed_event` tinyint(1) DEFAULT NULL,
  `subscribed_update` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NotificationSubscription`
--

LOCK TABLES `NotificationSubscription` WRITE;
/*!40000 ALTER TABLE `NotificationSubscription` DISABLE KEYS */;
INSERT INTO `NotificationSubscription` VALUES (1,1,1),(2,1,0),(3,0,0),(4,0,1);
/*!40000 ALTER TABLE `NotificationSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UpdateNotification`
--

DROP TABLE IF EXISTS `UpdateNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UpdateNotification` (
  `update_notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int DEFAULT NULL,
  `update_id` int DEFAULT NULL,
  PRIMARY KEY (`update_notification_id`),
  KEY `notification_id` (`notification_id`),
  KEY `update_id` (`update_id`),
  CONSTRAINT `UpdateNotification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`notification_id`),
  CONSTRAINT `UpdateNotification_ibfk_2` FOREIGN KEY (`update_id`) REFERENCES `EventUpdate` (`update_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UpdateNotification`
--

LOCK TABLES `UpdateNotification` WRITE;
/*!40000 ALTER TABLE `UpdateNotification` DISABLE KEYS */;
INSERT INTO `UpdateNotification` VALUES (1,7,1),(2,8,2),(3,9,3),(4,10,4),(5,11,5),(6,12,6),(7,13,7),(8,14,8),(9,15,9);
/*!40000 ALTER TABLE `UpdateNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `access_token` varchar(256) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Phong','Tran','phong@gmail.com','0123456789','Male','phong123','token1','2004-12-09'),(2,'Nguyen','Mai','nguyen@gmail.com','0987654321','Male','nguyen123','token2','2005-01-01'),(3,'Khanh','Nguyen','khanh@gmail.com','0135792468','Male','khanh123','token3','2005-01-01'),(4,'Bach','Tran','bach@gmail.com','0246813579','Gay','bach123','token4','2005-01-01'),(5,'Alice','Johnson','alice.johnson@example.com','234-567-8901','Female','password789','token789','1985-03-03'),(6,'Bob','Williams','bob.williams@example.com','345-678-9012','Male','password101','token101','1978-04-04'),(7,'Charlie','Brown','charlie.brown@example.com','456-789-0123','Male','password112','token112','1992-05-05'),(8,'Diana','Miller','diana.miller@example.com','567-890-1234','Female','password1234','token1234','1988-06-06');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Volunteer`
--

DROP TABLE IF EXISTS `Volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `receive_update` tinyint(1) DEFAULT NULL,
  `receive_event` tinyint(1) DEFAULT NULL,
  `is_subscribed_notis` tinyint(1) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `subscription_id` int DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`),
  KEY `branch_id` (`branch_id`),
  KEY `user_id` (`user_id`),
  KEY `subscription_id` (`subscription_id`),
  CONSTRAINT `Volunteer_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`),
  CONSTRAINT `Volunteer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `Volunteer_ibfk_3` FOREIGN KEY (`subscription_id`) REFERENCES `NotificationSubscription` (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Volunteer`
--

LOCK TABLES `Volunteer` WRITE;
/*!40000 ALTER TABLE `Volunteer` DISABLE KEYS */;
INSERT INTO `Volunteer` VALUES (4,1,1,1,1,5,1),(5,0,1,1,2,6,2),(6,0,0,1,3,7,3),(7,1,0,1,3,8,4);
/*!40000 ALTER TABLE `Volunteer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-28 14:10:23
