-- Add measurement types (e.g., temperature and humidity)
INSERT INTO measurement_types (physical_parameter, unit) VALUES
    ('Temperature', '°C'),
    ('Humidity', '%');

-- Add an administrator user
INSERT INTO users (name, surname, email, hashed_pwd, is_admin) VALUES
    ('admin', 'admin', 'admin@admin', 'admin', true);

-- Add an initial platform for measurements
INSERT INTO platforms (name) VALUES
    ('Example Platform');

-- Grant the administrator access to the initial platform
INSERT INTO users_platforms (user_id, platform_id) VALUES
    (1, 1);

-- Add two sensors to the initial platform (measuring temperature and humidity)
INSERT INTO sensors (measurement_type_id, platform_id) VALUES
    (1, 1), -- Temperature sensor
    (2, 1); -- Humidity sensor

-- Add measurements for the first platform at a specific timestamp
INSERT INTO measurements (sensor_id, value, date) VALUES
    (1, 22.5, '2024-12-11 12:00:00'), -- Temperature: 22.5°C
    (2, 55.3, '2024-12-11 12:00:00'); -- Humidity: 55.3%

-- Add another set of measurements for the first platform at a later timestamp
INSERT INTO measurements (sensor_id, value, date) VALUES
    (1, 23.7, '2024-12-11 13:00:00'), -- Temperature: 23.7°C
    (2, 57.8, '2024-12-11 13:00:00'); -- Humidity: 57.8%

-- Add a new user to the system
INSERT INTO users (name, surname, email, hashed_pwd, is_admin) VALUES
    ('John', 'Doe', 'john.doe@example.com', 'securepassword123', false);

-- Add a second platform for additional measurements
INSERT INTO platforms (name) VALUES
    ('Second Platform');

-- Add two sensors to the second platform (measuring temperature and humidity)
INSERT INTO sensors (measurement_type_id, platform_id) VALUES
    (1, 2), -- Temperature sensor
    (2, 2); -- Humidity sensor

-- Grant the second user access to the second platform
INSERT INTO users_platforms (user_id, platform_id) VALUES
    (2, 2);

-- Add measurements for the second platform at an earlier timestamp
INSERT INTO measurements (sensor_id, value, date) VALUES
    (3, 21.8, '2024-12-11 12:00:00'), -- Temperature: 21.8°C
    (4, 50.2, '2024-12-11 12:00:00'); -- Humidity: 50.2%

-- Add measurements for the second platform at a later timestamp
INSERT INTO measurements (sensor_id, value, date) VALUES
    (3, 22.9, '2024-12-11 13:00:00'), -- Temperature: 22.9°C
    (4, 51.7, '2024-12-11 13:00:00'); -- Humidity: 51.7%
