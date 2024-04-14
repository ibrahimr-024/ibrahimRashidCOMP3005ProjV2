-- Create Members Table
CREATE TABLE Members (
    member_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    goal_value DOUBLE PRECISION,
    CHECK (role IN ('admin', 'trainer', 'member'))
);

-- Create Trainers Table
CREATE TABLE Trainers (
    trainer_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    CHECK (role = 'trainer')
);

-- Create Admins Table
CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    CHECK (role = 'admin')
);

-- Create Health Metrics Table
CREATE TABLE HealthMetrics (
    metric_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES Members(member_id),
    date DATE,
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    body_fat_percentage DOUBLE PRECISION,
    CHECK (weight >= 0),
    CHECK (height >= 0),
    CHECK (bmi >= 0),
    CHECK (body_fat_percentage >= 0)
);

-- Create Exercise Routines Table
CREATE TABLE ExerciseRoutines (
    routine_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES Members(member_id),
    date DATE,
    exercise_name VARCHAR(100),
    sets INTEGER,
    reps INTEGER,
    weight_lifted DOUBLE PRECISION,
    CHECK (sets > 0),
    CHECK (reps > 0),
    CHECK (weight_lifted > 0)
);

-- Create Personal Training Sessions Table
CREATE TABLE PersonalTrainingSessions (
    session_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES Members(member_id),
    trainer_id INTEGER REFERENCES Trainers(trainer_id),
    status VARCHAR(50),
    date_time TIMESTAMP,
    CHECK (status IN ('scheduled', 'completed', 'cancelled'))
);

-- Create Class Schedule Table
CREATE TABLE ClassSchedule (
    class_id SERIAL PRIMARY KEY,
    trainer_id INTEGER REFERENCES Trainers(trainer_id),
    capacity INTEGER,
    room_id INTEGER,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    CHECK (capacity > 0)
);

-- Create Room Bookings Table
CREATE TABLE RoomBookings (
    starting_time TIMESTAMP,
    ending_time TIMESTAMP,
    booking_type VARCHAR(50),
    room_name VARCHAR(50) REFERENCES Rooms(room_name)
);

-- Create Rooms Table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) UNIQUE,
    capacity INTEGER CHECK (capacity > 0)
);

-- Create Equipment Maintenance Table
CREATE TABLE EquipmentMaintenance (
    maintenance_id SERIAL PRIMARY KEY,
    description TEXT,
    status VARCHAR(50),
    date DATE
);

-- Create Billing and Payments Table
CREATE TABLE BillingAndPayments (
    transaction_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES Members(member_id),
    amount NUMERIC(10, 2),
    date DATE
);

-- Create Trainer Availability Table
CREATE TABLE TrainerAvailability (
    trainer_id INTEGER PRIMARY KEY REFERENCES Trainers(trainer_id),
    start_time TIME,
    end_time TIME
);
