-- Update existing database to work with current structure
-- This script works with your existing superflats_temp database

-- Check if properties table exists, if not create it
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL,
  bhk_type VARCHAR(20) NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area INT NOT NULL,
  furnished_status VARCHAR(50) NOT NULL,
  parking BOOLEAN DEFAULT FALSE,
  parking_type VARCHAR(50),
  floor_number INT,
  total_floors INT,
  age_of_property INT,
  facing VARCHAR(50),
  balcony INT DEFAULT 0,
  bathroom INT DEFAULT 1,
  available_from DATE,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create property images table
CREATE TABLE IF NOT EXISTS property_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create property amenities table
CREATE TABLE IF NOT EXISTS property_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  amenity VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Update admin table to ensure password_hash field exists and add sample data
-- Update the existing admin record to use the correct email and password
UPDATE admin SET 
  email = 'admin@superflats.in',
  password_hash = '$uperflats@2025',
  name = 'Super Admin'
WHERE email = 'admin@superflats.local';

-- Insert sample property data
INSERT IGNORE INTO properties (
  title, description, property_type, bhk_type, rent, deposit, location, area,
  furnished_status, parking, parking_type, floor_number, total_floors,
  age_of_property, facing, balcony, bathroom, available_from,
  contact_name, contact_phone, contact_email
) VALUES 
(
  '2BHK Duplex Semi Furnished Flat',
  'Beautiful 2BHK duplex apartment in prime location with modern amenities',
  'Apartment',
  '2BHK',
  25000.00,
  50000.00,
  'BTM Layout, Bangalore',
  1200,
  'Semi Furnished',
  TRUE,
  'Covered',
  2,
  4,
  5,
  'East',
  2,
  2,
  '2025-09-01',
  'Property Manager',
  '+91 9876543210',
  'manager@superflats.in'
),
(
  '3BHK Luxury Apartment',
  'Spacious 3BHK apartment with premium amenities and city view',
  'Apartment',
  '3BHK',
  35000.00,
  70000.00,
  'Koramangala, Bangalore',
  1500,
  'Fully Furnished',
  TRUE,
  'Covered',
  5,
  8,
  3,
  'North',
  3,
  3,
  '2025-08-15',
  'Property Manager',
  '+91 9876543210',
  'manager@superflats.in'
);

-- Insert sample images for properties
INSERT IGNORE INTO property_images (property_id, image_url, display_order) VALUES
(1, '/placeholder.svg?height=400&width=600', 0),
(1, '/placeholder.svg?height=400&width=600', 1),
(1, '/placeholder.svg?height=400&width=600', 2),
(2, '/placeholder.svg?height=400&width=600', 0),
(2, '/placeholder.svg?height=400&width=600', 1),
(2, '/placeholder.svg?height=400&width=600', 2);

-- Insert sample amenities
INSERT IGNORE INTO property_amenities (property_id, amenity) VALUES
(1, 'Gym'),
(1, 'Swimming Pool'),
(1, 'Security'),
(1, 'Power Backup'),
(2, 'Gym'),
(2, 'Swimming Pool'),
(2, 'Security'),
(2, 'Power Backup'),
(2, 'Club House'),
(2, 'Garden');
