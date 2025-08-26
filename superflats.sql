-- Superflats Database Dump with Sample Data (Cleaned for MariaDB)
-- ------------------------------------------------------

-- Table structure for table `admin`
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin` VALUES (1,'admin@superflats.local','$2y$10$abcdefghijk1234567890','Super Admin','2025-08-26 10:06:43');

-- ------------------------------------------------------
-- Table structure for table `admin_users`
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` VALUES (1,'admin@superflats.in','+91 9205454717','$uperflats@2025','2025-08-26 12:29:58','2025-08-26 17:48:19');

-- ------------------------------------------------------
-- Table structure for table `listings`
DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT '0.00',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `listings` (id,title,slug,description,price,image_url,created_at) VALUES
(1,'Luxury 2BHK Apartment','luxury-2bhk-apartment','Spacious 2BHK with modern amenities in prime location.',25000.00,'/images/listing1.jpg','2025-08-27 12:00:00'),
(2,'Affordable Studio Flat','affordable-studio-flat','Compact studio ideal for working professionals.',12000.00,'/images/listing2.jpg','2025-08-27 12:05:00');

-- ------------------------------------------------------
-- Table structure for table `properties`
DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `property_type` enum('apartment','house','villa','studio','penthouse') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bhk_type` enum('1RK','1BHK','2BHK','3BHK','4BHK','5BHK+') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rent` decimal(10,2) NOT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` decimal(8,2) DEFAULT NULL,
  `furnished_status` enum('fully_furnished','semi_furnished','unfurnished') COLLATE utf8mb4_unicode_ci NOT NULL,
  `availability_status` enum('available','occupied','maintenance') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `parking` tinyint(1) DEFAULT '0',
  `parking_type` enum('covered','open','none') COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `floor_number` int DEFAULT NULL,
  `total_floors` int DEFAULT NULL,
  `age_of_property` int DEFAULT NULL,
  `facing` enum('north','south','east','west','north_east','north_west','south_east','south_west') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balcony` int DEFAULT '0',
  `bathroom` int DEFAULT '1',
  `available_from` date DEFAULT NULL,
  `contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `properties` (id,title,description,property_type,bhk_type,rent,deposit,location,area,furnished_status,availability_status,parking,parking_type,floor_number,total_floors,age_of_property,facing,balcony,bathroom,available_from,contact_name,contact_phone,contact_email,created_at) VALUES
(1,'Elegant 3BHK Apartment','Spacious apartment with great ventilation and natural light.','apartment','3BHK',32000.00,60000.00,'Bangalore, Whitefield',1450.50,'semi_furnished','available',1,'covered',5,10,5,'east',2,2,'2025-09-01','Rajesh Kumar','+91 9876543210','rajesh@example.com','2025-08-27 12:15:00'),
(2,'Modern Studio Flat','Perfect for singles or students, fully furnished.','studio','1RK',15000.00,30000.00,'Hyderabad, Hitech City',500.00,'fully_furnished','available',0,'none',7,15,2,'north',1,1,'2025-09-10','Anita Sharma','+91 9123456780','anita@example.com','2025-08-27 12:20:00');

-- ------------------------------------------------------
-- Table structure for table `property_amenities`
DROP TABLE IF EXISTS `property_amenities`;
CREATE TABLE `property_amenities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `amenity` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_amenities_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `property_amenities` (property_id,amenity) VALUES
(1,'Gym'),
(1,'Swimming Pool'),
(1,'Power Backup'),
(2,'WiFi'),
(2,'Lift Access');

-- ------------------------------------------------------
-- Table structure for table `property_images`
DROP TABLE IF EXISTS `property_images`;
CREATE TABLE `property_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `property_images` (property_id,image_url,image_alt,is_primary,display_order) VALUES
(1,'/images/property1_img1.jpg','Living Room',1,1),
(1,'/images/property1_img2.jpg','Bedroom',0,2),
(2,'/images/property2_img1.jpg','Studio Interior',1,1);

-- Dump completed with sample data
