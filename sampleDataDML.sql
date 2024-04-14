-- Insert sample data into the 'members' table
INSERT INTO members (username, password, role, goal_value)
VALUES
  ('user1', 'password1', 'member', 150),
  ('user2', 'password2', 'member', 160),
  ('user3', 'password3', 'member', 140);

-- Insert sample data into the 'trainers' table
INSERT INTO trainers (username, password, role)
VALUES
  ('trainer1', 'password1', 'trainer'),
  ('trainer2', 'password2', 'trainer'),
  ('trainer3', 'password3', 'trainer');

-- Insert sample data into the 'admins' table
INSERT INTO admins (username, password, role)
VALUES
  ('admin1', 'password1', 'admin'),
  ('admin2', 'password2', 'admin'),
  ('admin3', 'password3', 'admin');

-- Insert sample data into the 'healthmetrics' table
INSERT INTO healthmetrics (member_id, date, weight, height, bmi, body_fat_percentage)
VALUES
  (1, '2024-01-01', 160, 70, 22.9, 18),
  (2, '2024-01-01', 170, 72, 23.0, 19),
  (3, '2024-01-01', 150, 68, 22.8, 17);

-- Insert sample data into the 'equipmentmaintenance' table
INSERT INTO equipmentmaintenance (equipment_name, maintenance_date, maintenance_description)
VALUES
  ('Treadmill', '2024-01-01', 'Routine maintenance performed'),
  ('Elliptical', '2024-01-05', 'Replaced broken parts'),
  ('Stationary Bike', '2024-01-10', 'Cleaned and lubricated moving parts');

-- Insert sample data into the 'rooms' table
INSERT INTO rooms (room_name, capacity)
VALUES
  ('Room 1', 20),
  ('Room 2', 30),
  ('Room 3', 25);

-- Insert sample data into the 'classschedule' table
INSERT INTO classschedule (trainer_id, capacity, room_id, start_time, end_time, member_ids)
VALUES
  (1, 20, 1, '2024-01-01 09:00:00', '2024-01-01 10:00:00', ARRAY[1, 2]),
  (2, 25, 2, '2024-01-01 09:00:00', '2024-01-01 10:00:00', ARRAY[3]);

-- Insert sample data into the 'trainer_availability' table
INSERT INTO trainer_availability (trainer_id, start_time, end_time)
VALUES
  (1, '2024-01-01 09:00:00', '2024-01-01 12:00:00'),
  (2, '2024-01-01 10:00:00', '2024-01-01 13:00:00'),
  (3, '2024-01-01 11:00:00', '2024-01-01 14:00:00');

-- Insert sample data into the 'personaltrainingsessions' table
INSERT INTO personaltrainingsessions (member_id, trainer_id, status, date_time)
VALUES
  (1, 1, 'booked', '2024-01-01 09:00:00'),
  (2, 2, 'booked', '2024-01-01 10:00:00'),
  (3, 3, 'booked', '2024-01-01 11:00:00');

-- Insert sample data into the 'roombookings' table
INSERT INTO roombookings (room_name, starting_time, ending_time, bookingType)
VALUES
  ('Room 1', '2024-01-01 09:00:00', '2024-01-01 10:00:00', 'training'),
  ('Room 2', '2024-01-01 10:00:00', '2024-01-01 11:00:00', 'meeting'),
  ('Room 3', '2024-01-01 11:00:00', '2024-01-01 12:00:00', 'class');
