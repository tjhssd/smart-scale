-- MySQL dump 10.13  Distrib 8.0.46, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: smart_scale_db
-- ------------------------------------------------------
-- Server version	9.6.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '111121ac-3b46-11f1-acd5-238226369d70:1-450';

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Token',7,'add_token'),(26,'Can change Token',7,'change_token'),(27,'Can delete Token',7,'delete_token'),(28,'Can view Token',7,'view_token'),(29,'Can add Token',8,'add_tokenproxy'),(30,'Can change Token',8,'change_tokenproxy'),(31,'Can delete Token',8,'delete_tokenproxy'),(32,'Can view Token',8,'view_tokenproxy'),(33,'Can add device',9,'add_device'),(34,'Can change device',9,'change_device'),(35,'Can delete device',9,'delete_device'),(36,'Can view device',9,'view_device'),(37,'Can add health record',10,'add_healthrecord'),(38,'Can change health record',10,'change_healthrecord'),(39,'Can delete health record',10,'delete_healthrecord'),(40,'Can view health record',10,'view_healthrecord'),(41,'Can add measurement session',11,'add_measurementsession'),(42,'Can change measurement session',11,'change_measurementsession'),(43,'Can delete measurement session',11,'delete_measurementsession'),(44,'Can view measurement session',11,'view_measurementsession'),(45,'Can add user profile',12,'add_userprofile'),(46,'Can change user profile',12,'change_userprofile'),(47,'Can delete user profile',12,'delete_userprofile'),(48,'Can view user profile',12,'view_userprofile');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1200000$ado9EiClvGxXkZaXAiACbE$/0o2rTTyYwJDotsf9jdpnwk1PUWiO48Cg0XMjJxSzes=','2026-06-25 18:07:33.433603',1,'admin','','','',1,1,'2026-06-20 16:53:18.178583'),(2,'pbkdf2_sha256$1200000$LW5TIOSt2KQGJ6mjcQjYLm$GkAyu+HpjYDTveB/57DoI7oOLPAKQVv0zugK1gXjTUI=',NULL,0,'user1','','','',0,1,'2026-06-20 16:54:55.446905'),(3,'pbkdf2_sha256$1200000$IcBG3BJwDiE3x0OH1zVmfh$TcO8gJ6kVnjKD5g/OPtPiBm90hH675f3DUX27ryhh7M=',NULL,0,'user2','','','',0,1,'2026-06-25 18:10:25.393278'),(4,'pbkdf2_sha256$1200000$8NABYP0hULKMU0bUnrcjo3$hpd0H3axycxIJ6l/hEdHebsCz2AX8f81ql0ufaK8BRc=',NULL,0,'test1','','','test@gmail.com',0,1,'2026-06-25 18:56:25.756472');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('2a3a4141d9e96a67be9fefe3f867db1f54944d54','2026-06-20 16:55:10.177841',2),('8271b88b7674b68acc74afab8ce19ae40a4f460a','2026-06-25 18:10:33.492764',3),('abf95b2c214fd6a9019791913afd1fbe37027e5c','2026-06-20 16:55:52.980734',1);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biometrics_device`
--

DROP TABLE IF EXISTS `biometrics_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biometrics_device` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `mac_address` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `registered_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mac_address` (`mac_address`),
  KEY `biometrics_device_user_id_14d465dc_fk_auth_user_id` (`user_id`),
  CONSTRAINT `biometrics_device_user_id_14d465dc_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biometrics_device`
--

LOCK TABLES `biometrics_device` WRITE;
/*!40000 ALTER TABLE `biometrics_device` DISABLE KEYS */;
INSERT INTO `biometrics_device` VALUES (1,'aa:bb:cc:11:22:33','abc',1,'2026-06-20 16:57:37.389048',2),(2,'cd:eg:hu:57:89:25','cân phòng ngủ',1,'2026-06-25 18:14:34.731379',3);
/*!40000 ALTER TABLE `biometrics_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biometrics_healthrecord`
--

DROP TABLE IF EXISTS `biometrics_healthrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biometrics_healthrecord` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `weight` double NOT NULL,
  `height` double NOT NULL,
  `bmi` double NOT NULL,
  `temperature` double NOT NULL,
  `heart_rate` int NOT NULL,
  `spo2` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `device_id` bigint DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `biometrics_healthrec_device_id_8d670c70_fk_biometric` (`device_id`),
  KEY `biometrics_healthrecord_user_id_16a64864_fk_auth_user_id` (`user_id`),
  CONSTRAINT `biometrics_healthrec_device_id_8d670c70_fk_biometric` FOREIGN KEY (`device_id`) REFERENCES `biometrics_device` (`id`),
  CONSTRAINT `biometrics_healthrecord_user_id_16a64864_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biometrics_healthrecord`
--

LOCK TABLES `biometrics_healthrecord` WRITE;
/*!40000 ALTER TABLE `biometrics_healthrecord` DISABLE KEYS */;
INSERT INTO `biometrics_healthrecord` VALUES (1,68.5,172,23.1,36.7,82,98,'2026-06-20 16:57:42.475928',1,2),(2,68.5,172,23.1,36.7,82,98,'2026-06-20 16:57:42.475751',1,2),(3,71.5,175,23.3,37.1,85,99,'2026-06-20 17:18:24.356487',1,2),(4,65.5,172,22.1,36.7,78,98,'2026-06-25 18:03:17.475961',1,2),(6,63,160.3,24.5,37.4,65,95,'2026-06-30 04:40:56.844318',NULL,2);
/*!40000 ALTER TABLE `biometrics_healthrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biometrics_measurementsession`
--

DROP TABLE IF EXISTS `biometrics_measurementsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biometrics_measurementsession` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mac_address` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` double NOT NULL,
  `height` double NOT NULL,
  `bmi` double NOT NULL,
  `temperature` double NOT NULL,
  `heart_rate` int NOT NULL,
  `spo2` int NOT NULL,
  `is_saved` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `biometrics_measurementsession_user_id_ed97ea41_fk_auth_user_id` (`user_id`),
  CONSTRAINT `biometrics_measurementsession_user_id_ed97ea41_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biometrics_measurementsession`
--

LOCK TABLES `biometrics_measurementsession` WRITE;
/*!40000 ALTER TABLE `biometrics_measurementsession` DISABLE KEYS */;
INSERT INTO `biometrics_measurementsession` VALUES (3,'4de8f24561f4459ea682876460b56ce9','AA:BB:CC:11:22:33',68.5,172,23.1,36.7,82,98,1,'2026-06-20 16:56:53.707573',2),(6,'a1cbbf69007e47afba07d1c508d0aedf','AA:BB:CC:11:22:33',71.5,175,23.3,37.1,85,99,1,'2026-06-20 17:18:04.408825',2),(8,'5f68f05d0ec242a9b468456c4af5f86c','AA:BB:CC:11:22:33',65.5,172,22.1,36.7,78,98,1,'2026-06-25 18:02:55.413441',2),(11,'ec474b76173d42fca483d484e8c1a438','AA:BB:CC:DD:EE:FF',63,160.3,24.5,37.4,65,95,1,'2026-06-30 04:39:51.758791',2),(74,'adc1242b62b049f3812fd88e5f49944d','AA:BB:CC:DD:EE:FF',75.6,170.9,25.9,36.5,86,95,0,'2026-07-06 16:33:28.052679',NULL);
/*!40000 ALTER TABLE `biometrics_measurementsession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biometrics_userprofile`
--

DROP TABLE IF EXISTS `biometrics_userprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biometrics_userprofile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date DEFAULT NULL,
  `default_height` double DEFAULT NULL,
  `target_weight` double DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `biometrics_userprofile_user_id_bc43d189_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biometrics_userprofile`
--

LOCK TABLES `biometrics_userprofile` WRITE;
/*!40000 ALTER TABLE `biometrics_userprofile` DISABLE KEYS */;
INSERT INTO `biometrics_userprofile` VALUES (1,NULL,NULL,'Nam',NULL,NULL,NULL,4),(2,NULL,NULL,'Nam',NULL,NULL,NULL,2);
/*!40000 ALTER TABLE `biometrics_userprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2026-06-25 18:08:02.927533','5','user1 - 65.5kg - 78bpm',3,'',10,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'auth','user'),(7,'authtoken','token'),(8,'authtoken','tokenproxy'),(9,'biometrics','device'),(10,'biometrics','healthrecord'),(11,'biometrics','measurementsession'),(12,'biometrics','userprofile'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-06-20 16:52:45.622230'),(2,'auth','0001_initial','2026-06-20 16:52:45.802587'),(3,'admin','0001_initial','2026-06-20 16:52:45.841942'),(4,'admin','0002_logentry_remove_auto_add','2026-06-20 16:52:45.849879'),(5,'admin','0003_logentry_add_action_flag_choices','2026-06-20 16:52:45.854795'),(6,'contenttypes','0002_remove_content_type_name','2026-06-20 16:52:45.883426'),(7,'auth','0002_alter_permission_name_max_length','2026-06-20 16:52:45.900417'),(8,'auth','0003_alter_user_email_max_length','2026-06-20 16:52:45.911227'),(9,'auth','0004_alter_user_username_opts','2026-06-20 16:52:45.915546'),(10,'auth','0005_alter_user_last_login_null','2026-06-20 16:52:45.931054'),(11,'auth','0006_require_contenttypes_0002','2026-06-20 16:52:45.931728'),(12,'auth','0007_alter_validators_add_error_messages','2026-06-20 16:52:45.936177'),(13,'auth','0008_alter_user_username_max_length','2026-06-20 16:52:45.952738'),(14,'auth','0009_alter_user_last_name_max_length','2026-06-20 16:52:45.970658'),(15,'auth','0010_alter_group_name_max_length','2026-06-20 16:52:45.983140'),(16,'auth','0011_update_proxy_permissions','2026-06-20 16:52:45.988075'),(17,'auth','0012_alter_user_first_name_max_length','2026-06-20 16:52:46.004773'),(18,'authtoken','0001_initial','2026-06-20 16:52:46.020514'),(19,'authtoken','0002_auto_20160226_1747','2026-06-20 16:52:46.031601'),(20,'authtoken','0003_tokenproxy','2026-06-20 16:52:46.032578'),(21,'authtoken','0004_alter_tokenproxy_options','2026-06-20 16:52:46.034872'),(22,'biometrics','0001_initial','2026-06-20 16:52:46.099652'),(23,'sessions','0001_initial','2026-06-20 16:52:46.108194'),(24,'biometrics','0002_userprofile','2026-06-25 18:32:52.163662');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('3tybetxerwgeeruae6wvzg5vlh6qn5yf','.eJxVjE0OwiAYBe_C2hDA8ufSvWcgjw-QqqFJaVfGu9smXej2zbx5s4B1qWHteQ5jYhcm2el3i6BnbjtID7T7xGlqyzxGviv8oJ3fppRf18P9C1T0ur2FTyBIK3Q5g4qyZJww3kPFLaK0gjERUUNo56yHEyQNDA15yKUowT5f84U4Tw:1wcoU9:UN30O9-7-C7oBp9Cp8WNQrmfl5mh0deK-17fGT0MXbs','2026-07-09 18:07:33.444063');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-06 23:56:19
