INSERT INTO measurement_types (id, physical_parameter, unit) VALUES
    (1, 'Temperature', '°C'),
    (2, 'Humidity', '%');

INSERT INTO users (id, name, surname, email, passwd) VALUES
    (1, 'admin', 'admin', 'admin@admin', 'admin');

INSERT INTO platforms (id, name) VALUES
    (1, 'Example Platform');

INSERT INTO users_platforms (id, user_id, platform_id) VALUES
    (1, 1, 1);

INSERT INTO sensors (id, measurement_type_id, platform_id) VALUES
    (1, 1, 1),
    (2, 2, 1);
