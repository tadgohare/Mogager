-- ONLY USE THIS IF YOU ARE INITIALIZING OR HAVE MADE CHANGES TO THE DATABASE AS ALL THE DATA WILL BE DELETED!!!!!!!!!!!!
-- READ THE WARNING
-- DROP DATABASE IF EXISTS mogager;

CREATE DATABASE mogager;

CREATE TABLE trainers (
    trainerid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE health (
    healthid SERIAL PRIMARY KEY,
    weight INT,
    height INT,
    gender TEXT NOT NULL,
    age INT NOT NULL
);

CREATE TABLE exercises (
    exerciseid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    plan JSONB
);

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    exerciseid INT,
    healthid INT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    payment_info VARCHAR(19),
    has_paid BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (exerciseid) REFERENCES exercises(exerciseid),
    FOREIGN KEY (healthid) REFERENCES health(healthid)
);

CREATE TABLE rooms (
    roomid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_bookable BOOLEAN NOT NULL
);


CREATE TABLE equipment (
    asset_tag SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    roomid INT,
    needs_repair BOOLEAN NOT NULL,
    FOREIGN KEY (roomid) REFERENCES rooms(roomid)
);

CREATE TABLE admins (
    adminid SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE sessions (
    sessionid SERIAL PRIMARY KEY,
    userid INT,
    trainerid INT,
    roomid INT,
    start_time TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (trainerid) REFERENCES trainers(trainerid),
    FOREIGN KEY (roomid) REFERENCES rooms(roomid)
);
--Views for making complex queries much easier


CREATE OR REPLACE VIEW dashboard AS 
SELECT
    users.userid,
    users.username,
    users.name,
    users.payment_info,
    trainers.name AS trainer_name,
    health.healthid,
    health.weight,
    health.height,
    health.gender,
    health.age,
    exercises.name AS exercise_name,
    exercises.description AS exercise_description,
    exercises.plan AS exercise_plan
FROM users
LEFT JOIN health ON users.healthid = health.healthid
LEFT JOIN exercises ON users.exerciseid = exercises.exerciseid
LEFT JOIN trainers ON users.trainerid = trainers.trainerid;

CREATE VIEW schedule AS
SELECT
    sessions.start_time,
    sessions.end_time,
    sessions.userid,
    sessions.trainerid,
    users.name AS client_name,
    trainers.name AS trainer_name,
    rooms.name AS room_name
FROM sessions
LEFT JOIN users ON sessions.userid = users.userid
LEFT JOIN trainers ON sessions.trainerid = trainers.trainerid
LEFT JOIN rooms ON sessions.roomid = rooms.roomid;


CREATE VIEW equipment_view AS
SELECT
    equipment.asset_tag,
    equipment.name,
    equipment.needs_repair,
    rooms.name AS room_name
FROM equipment
LEFT JOIN rooms ON equipment.roomid = rooms.roomid;
