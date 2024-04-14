-- Insert into trainers
INSERT INTO trainers (name, username, password) VALUES ('John Doe', 'johndoe@gym.com', 'password123');
INSERT INTO trainers (name, username, password) VALUES ('Zyzz', 'zyzz@gym.com', 'password123');
INSERT INTO trainers (name, username, password) VALUES ('David Goggins', 'davidgoggins@gym.com', 'password123');
INSERT INTO trainers (name, username, password) VALUES ('Sam Sulek', 'samsulek@gym.com', 'password123');


-- Insert into health
-- INSERT INTO health (weight, height, gender, age) VALUES (70, 180, 'Male', 30);

-- Insert into exercises
INSERT INTO exercises (name, description, plan) VALUES ('Push Ups', 'Push ups exercise', '{"sets": 3, "reps": 10}');

-- Insert into users
-- INSERT INTO users (exerciseid, healthid, username, password, name, payment_info, has_paid) VALUES (1, 1, 'user1', 'password1', 'User One', '1234-5678-9012-3456', true);

-- Insert into rooms
INSERT INTO rooms (name, is_bookable) VALUES ('Cardio', false);
INSERT INTO rooms (name, is_bookable) VALUES ('Personal Training 1', true);
INSERT INTO rooms (name, is_bookable) VALUES ('Crossfit', true);
INSERT INTO rooms (name, is_bookable) VALUES ('Weights', false);
INSERT INTO rooms (name, is_bookable) VALUES ('Machines', false);
INSERT INTO rooms (name, is_bookable) VALUES ('Stretching/Misc', true);


-- Insert into equipment
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Treadmill', 1, false);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Treadmill', 1, false);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Stairmaster', 1, true);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Stairmaster', 1, false);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Rowing Machine', 1, false);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Bicycle', 1, false);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Bicycle', 1, true);
-- INSERT INTO equipment (name, roomid, needs_repair) VALUES ('Bench Press', 3, false);

-- Insert into admins
INSERT INTO admins (username, password) VALUES ('admin', 'admin');

-- Insert into sessions
INSERT INTO sessions (userid, trainerid, roomid, start_time) VALUES (1, 1, 1, '2025-01-01 10:00:00');