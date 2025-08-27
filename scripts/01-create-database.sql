-- Create database and tables for SuperFlats property management
CREATE DATABASE IF NOT EXISTS superflats_temp;
USE superflats_temp;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO admin_users (email, password) VALUES 
('admin@superflats.in', '$uperflats@2025')
ON DUPLICATE KEY UPDATE password = '$uperflats@2025';

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('apartment', 'house', 'villa', 'studio', 'penthouse') NOT NULL,
    bhk_type ENUM('1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+') NOT NULL,
    rent DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area DECIMAL(8, 2),
    furnished_status ENUM('fully_furnished', 'semi_furnished', 'unfurnished') NOT NULL,
    availability_status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    parking BOOLEAN DEFAULT FALSE,
    parking_type ENUM('covered', 'open', 'none') DEFAULT 'none',
    floor_number INT,
    total_floors INT,
    age_of_property INT,
    facing ENUM('north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west'),
    balcony INT DEFAULT 0,
    bathroom INT DEFAULT 1,
    available_from DATE,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_alt VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Property amenities table
CREATE TABLE IF NOT EXISTS property_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_bhk_type ON properties(bhk_type);
CREATE INDEX idx_properties_rent ON properties(rent);
CREATE INDEX idx_properties_availability ON properties(availability_status);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);

-- Insert sample data
INSERT INTO properties (
    title, description, property_type, bhk_type, rent, deposit, location,
    area, furnished_status, parking, contact_phone
) VALUES 
(
    '2BHK Duplex Semi Furnished',
    'Beautiful 2BHK duplex apartment with modern amenities',
    'apartment', '2BHK', 25000.00, 50000.00, 'BTM Layout, Bangalore',
    1200.00, 'semi_furnished', TRUE, '+91 9876543210'
),
(
    '3BHK Fully Furnished Apartment',
    'Luxury 3BHK apartment with premium furnishing',
    'apartment', '3BHK', 35000.00, 70000.00, 'Koramangala, Bangalore',
    1800.00, 'fully_furnished', TRUE, '+91 9876543211'
);

-- Insert sample amenities
INSERT INTO property_amenities (property_id, amenity) VALUES
(1, 'Parking'), (1, 'Security'), (1, 'Gym'), (1, 'Swimming Pool'),
(2, 'Parking'), (2, 'Security'), (2, 'Gym'), (2, 'Swimming Pool'), (2, 'Club House');

-- Insert sample images
INSERT INTO property_images (property_id, image_url, display_order) VALUES
(1, '/modern-apartment-living.png', 0),
(2, '/luxury-apartment-interior.png', 0);
