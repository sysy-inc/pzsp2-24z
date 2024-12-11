CREATE TABLE measurement_types (
    id int  PRIMARY KEY,
    physical_parameter varchar(30)  NOT NULL,
    unit varchar(15)  NOT NULL
);

CREATE TABLE platforms (
    id int  PRIMARY KEY,
    name varchar(100)  NOT NULL
);

CREATE TABLE sensors (
    id int  PRIMARY KEY,
    measuremen_type_id int  NOT NULL REFERENCES measurement_types (id),
    platform_id int  NOT NULL REFERENCES platforms (id)
);

CREATE TABLE measurements (
    id int  PRIMARY KEY,
    sensor_id int NOT NULL REFERENCES sensors (id),
    value decimal(8,4)  NOT NULL,
    date timestamp  NOT NULL        
);

CREATE TABLE users (
    id int  PRIMARY KEY,
    name varchar(20)  NOT NULL,
    surname varchar(30)  NOT NULL,
    email varchar(40)  NOT NULL,
    passwd varchar(30)  NOT NULL
);

CREATE TABLE users_platforms (
    id int  PRIMARY KEY,
    user_id int  NOT NULL REFERENCES users (id),
    platform_id int  NOT NULL REFERENCES platforms (id)
);