INSERT INTO measurement_types (physical_parameter, unit) VALUES
    ('Temperature', '°C'),
    ('Humidity', '%');

INSERT INTO users (name, surname, email, passwd) VALUES
    ('admin', 'admin', 'admin@admin', 'admin');

INSERT INTO platforms (name) VALUES
    ('Example Platform');

INSERT INTO users_platforms (user_id, platform_id) VALUES
    (1, 1);

INSERT INTO sensors (measurement_type_id, platform_id) VALUES
    (1, 1),
    (2, 1);

INSERT INTO sensors (id, measurement_type_id, platform_id) VALUES
    (1, 1, 1),
    (2, 2, 1);
