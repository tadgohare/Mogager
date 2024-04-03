--CREATE DATABASE mogager;


CREATE TABLE trainers (
    trainerid SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    sessions DATERANGE
);

CREATE TABLE health (
    healthid SERIAL PRIMARY KEY,
    userid INT,
    weight INT,
    height INT,
    gender TEXT NOT NULL,
    age INT NOT NULL,
    -- FOREIGN KEY (userid) REFERENCES users(userid),
);

CREATE TABLE exercises (
    exerciseid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    plan JSONB
);

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    trainerid INT,
    exerciseid INT,
    healthid INT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    payment_info VARCHAR(19),
    has_paid BOOLEAN NOT NULL DEFAULT FALSE,
    sessions DATERANGE,
    FOREIGN KEY (trainerid) REFERENCES trainers(trainerid),
    FOREIGN KEY (exerciseid) REFERENCES exercises(exerciseid),
    FOREIGN KEY (healthid) REFERENCES health(healthid)
);
CREATE TABLE equipment (
    asset_tag SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    needs_repair BOOLEAN NOT NULL
);

CREATE TABLE rooms (
    roomid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_bookable BOOLEAN NOT NULL,
    availability DATERANGE
);


CREATE TABLE admins (
    adminid SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

ALTER TABLE health
ADD CONSTRAINT fk_health_users
FOREIGN KEY (userid) REFERENCES users(userid);

-- CREATE VIEW dashboard AS SELECT
--     users.username,
--     users.name,
--     users.sessions,
--     users.payment_info,
--     trainers.name,
-- FROM users
-- LEFT JOIN health ON users.userid = health.userid,
-- LEFT JOIN excersises ON users.exerciseid = excersises.exerciseid;