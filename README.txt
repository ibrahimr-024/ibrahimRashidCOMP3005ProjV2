Name: Ibrahim Rashid
Student Number: 101256625


Fitness Management System:


Overview:

The Fitness Management System is a web application designed to manage various aspects of a fitness center, including user management, equipment maintenance, class scheduling, and more. It provides functionality for members, trainers, and administrators to interact with the system according to their roles.

Features
User Management: Users can register, login, and update their profiles. Different roles (member, trainer, admin) have different access levels and capabilities within the system.

Health Metrics Tracking: Members can track their health metrics such as weight, height, BMI, and body fat percentage over time.

Equipment Maintenance: Trainers and administrators can log maintenance activities for fitness equipment, ensuring that all equipment is properly maintained and safe to use.

Class Scheduling: Trainers can create and manage class schedules, specifying the time, room, capacity, and member enrollment for each class.

Personal Training Sessions: Members can book personal training sessions with trainers, specifying the date, time, and trainer of their choice.

Room Booking: Users can book rooms for various purposes such as training sessions, meetings, or classes.


-------------------------------------------------------------------------------------------------------------------
Installation and Setup:

Navigate to the project directory: cd fitness-management-system
Install dependencies: npm install
Set up the PostgreSQL database and run the provided SQL script to create tables and insert sample data.

Configure the database connection in the server.js file where it says:

// Create a PostgreSQL database connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_db',
  password: 'your_password',
  port: 5432 // Default PostgreSQL port
});

Change the user, database, and password to your own username, database and password.

Start the server: npm start or node server.js
Access the application in your web browser at http://localhost:3000
-------------------------------------------------------------------------------------------------------------------

Usage
Visit the homepage to register or login.
Once logged in, users can access features based on their role (member, trainer, admin).
Navigate through the different sections of the application using the sidebar or navigation menu.
Perform actions such as tracking health metrics, booking classes, scheduling maintenance, etc.
Log out when done using the application.



Video Demonstartion: https://youtu.be/n_1cvmH_KGs

