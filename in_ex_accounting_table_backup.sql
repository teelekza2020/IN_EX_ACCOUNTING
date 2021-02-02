-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: in_ex_accounting
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES UTF8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `accountId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verifyHash` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verifyState` tinyint(1) NOT NULL,
  PRIMARY KEY (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expensedata`
--

DROP TABLE IF EXISTS `expensedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensedata` (
  `expenseDataId` int NOT NULL AUTO_INCREMENT,
  `expenseTimeId` int NOT NULL,
  `material` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(13,2) NOT NULL,
  `unitPrice` decimal(13,2) NOT NULL,
  `totalPrice` decimal(13,2) NOT NULL,
  PRIMARY KEY (`expenseDataId`),
  KEY `expenseTimeId` (`expenseTimeId`),
  CONSTRAINT `expensedata_ibfk_1` FOREIGN KEY (`expenseTimeId`) REFERENCES `expensetime` (`expenseTimeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensedata`
--

LOCK TABLES `expensedata` WRITE;
/*!40000 ALTER TABLE `expensedata` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expensedate`
--

DROP TABLE IF EXISTS `expensedate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensedate` (
  `expenseDateId` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`expenseDateId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `expensedate_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `account` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensedate`
--

LOCK TABLES `expensedate` WRITE;
/*!40000 ALTER TABLE `expensedate` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensedate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expensetime`
--

DROP TABLE IF EXISTS `expensetime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensetime` (
  `expenseTimeId` int NOT NULL AUTO_INCREMENT,
  `expenseDateId` int NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`expenseTimeId`),
  KEY `expenseDateId` (`expenseDateId`),
  CONSTRAINT `expensetime_ibfk_1` FOREIGN KEY (`expenseDateId`) REFERENCES `expensedate` (`expenseDateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensetime`
--

LOCK TABLES `expensetime` WRITE;
/*!40000 ALTER TABLE `expensetime` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensetime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incomedata`
--

DROP TABLE IF EXISTS `incomedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incomedata` (
  `incomeDataId` int NOT NULL AUTO_INCREMENT,
  `incomeTimeId` int NOT NULL,
  `category` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(13,2) NOT NULL,
  PRIMARY KEY (`incomeDataId`),
  KEY `incomeTimeId` (`incomeTimeId`),
  CONSTRAINT `incomedata_ibfk_1` FOREIGN KEY (`incomeTimeId`) REFERENCES `incometime` (`incomeTimeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incomedata`
--

LOCK TABLES `incomedata` WRITE;
/*!40000 ALTER TABLE `incomedata` DISABLE KEYS */;
/*!40000 ALTER TABLE `incomedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incomedate`
--

DROP TABLE IF EXISTS `incomedate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incomedate` (
  `incomeDateId` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`incomeDateId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `incomedate_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `account` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incomedate`
--

LOCK TABLES `incomedate` WRITE;
/*!40000 ALTER TABLE `incomedate` DISABLE KEYS */;
/*!40000 ALTER TABLE `incomedate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incometime`
--

DROP TABLE IF EXISTS `incometime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incometime` (
  `incomeTimeId` int NOT NULL AUTO_INCREMENT,
  `incomeDateId` int NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`incomeTimeId`),
  KEY `incomeDateId` (`incomeDateId`),
  CONSTRAINT `incometime_ibfk_1` FOREIGN KEY (`incomeDateId`) REFERENCES `incomedate` (`incomeDateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incometime`
--

LOCK TABLES `incometime` WRITE;
/*!40000 ALTER TABLE `incometime` DISABLE KEYS */;
/*!40000 ALTER TABLE `incometime` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-24  7:55:29
