-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 30, 2025 at 02:50 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u786430913_super_flats`
--

-- --------------------------------------------------------

--
-- Table structure for table `property_amenities`
--

CREATE TABLE `property_amenities` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `amenity` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_amenities`
--

INSERT INTO `property_amenities` (`id`, `property_id`, `amenity`, `created_at`) VALUES
(1, 1, 'Parking', '2025-08-28 11:38:50'),
(2, 1, 'Security', '2025-08-28 11:38:50'),
(3, 1, 'Gym', '2025-08-28 11:38:50'),
(4, 1, 'Swimming Pool', '2025-08-28 11:38:50'),
(5, 1, 'Power Backup', '2025-08-28 11:38:50'),
(6, 2, 'Parking', '2025-08-28 11:39:00'),
(7, 2, 'Security', '2025-08-28 11:39:00'),
(8, 2, 'Gym', '2025-08-28 11:39:00'),
(9, 2, 'Club House', '2025-08-28 11:39:00'),
(10, 2, 'Garden', '2025-08-28 11:39:00'),
(11, 3, 'Parking', '2025-08-28 11:39:07'),
(12, 3, 'Security', '2025-08-28 11:39:07'),
(13, 3, 'Power Backup', '2025-08-28 11:39:07'),
(14, 3, 'Garden', '2025-08-28 11:39:07'),
(15, 4, 'Parking', '2025-08-28 11:39:14'),
(16, 4, 'Security', '2025-08-28 11:39:14'),
(17, 4, 'Power Backup', '2025-08-28 11:39:14'),
(18, 5, 'Parking', '2025-08-28 11:39:23'),
(19, 5, 'Security', '2025-08-28 11:39:23'),
(20, 5, 'Gym', '2025-08-28 11:39:23'),
(21, 5, 'Swimming Pool', '2025-08-28 11:39:23'),
(22, 5, 'Garden', '2025-08-28 11:39:23'),
(23, 5, 'Club House', '2025-08-28 11:39:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `property_amenities`
--
ALTER TABLE `property_amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
