// Import necessary modules
const http = require('http')
const express = require('express');
const path = require('path')
const { Pool } = require('pg');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// Middleware to parse urlencoded form data

app.use(express.urlencoded({ extended: true }));


const { error } = require('console');
const { register } = require('module');

var username = "";

//some logger middleware functions
function methodLogger(request, response, next){
  console.log("METHOD LOGGER")
  console.log("================================")
  console.log("METHOD: " + request.method)
  console.log("URL:" + request.url)
  next(); //call next middleware registered
}
function headerLogger(request, response, next){
  console.log("HEADER LOGGER:")
  console.log("Headers:")
      for(k in request.headers) console.log(k)
  next() //call next middleware registered
}

// Create a PostgreSQL database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'health_fitness_db',
  password: 'Ooli1234!',
  port: 5432 // Default PostgreSQL port
});

// Define routes
app.get('/', (req, res) => {
  res.render('welcome', {
  })
});

// route to open memberDashboard
app.get('/memberDashboard', (req, res) => {
  var exResults = [];
  var metResults = [];
  var trainResults = [];
  var seshResults = []

  const memberIDQuery = "SELECT member_id FROM members WHERE username = $1";
  pool.query(memberIDQuery, [username], (error, result) => {
    if (error) {
      console.error("Error retrieving member ID", error);
      res.status(500).send("Error retrieving member ID");
      return;
    }
    const memberId = result.rows[0].member_id;

    const exQuery = "SELECT exercise_name, sets, reps, weight_lifted, date FROM exerciseroutines WHERE member_id = $1";
    pool.query(exQuery, [memberId], (error, result) => {
      if (error) { 
        console.error("Error retrieving exercises: ", error);
        res.status(500).send("Error retrieving exercises");
        return;
      }
      exResults = result.rows;

      const metricQuery = "SELECT date, weight, bmi, body_fat_percentage FROM healthmetrics WHERE member_id = $1";
      pool.query(metricQuery, [memberId], (error, result) => {
        if (error) {
          console.error("Error retrieving metrics:", error);
          res.status(500).send("Error retrieving metrics");
          return;
        }
        metResults = result.rows;

        const trainerQuery = "SELECT username FROM trainers";
        pool.query(trainerQuery,[], (error, result) => {
          if (error){
            console.error("Error retrieving trainers: ", error)
            res.status(500).send("Error retrieving trainers");
            return;
          }
          trainResults = result.rows;

          const sessionQuery = "SELECT c.*, r.room_name FROM classschedule c JOIN rooms r ON c.room_id = r.room_id";
          pool.query(sessionQuery, [], (error, result) => {
            if (error) {
              console.error("Error retrieving class sessions: ", error)
              res.status(500).send("Error retrieving class sessions");
              return;
            }
            seshResults = result.rows;
            res.render("memberDashboard", { exercise: exResults, metric: metResults, trainer: trainResults, session: seshResults});
          })
        })
      });
    });
  });
});

// route to open trainerDashboard
app.get('/trainerDashboard', (req, res) => {
  
  const trainerIDQuery = "SELECT trainer_id FROM trainers WHERE username = $1";
  pool.query(trainerIDQuery, [username], (error, result) => {
    if (error) {
      console.error("Error fetching trainerId: ", error);
      res.status(500).send("Error fetching trainerID")
      return;
    }
    const trainerID = result.rows[0].trainer_id;

    const scheduledQuery = "SELECT start_time, end_time FROM trainer_availability WHERE trainer_id = $1";
    pool.query(scheduledQuery, [trainerID], (error, result) => {
      if (error) {
        console.error("Error retrieving scheduled availability: ", error);
        res.status(500).send("Error retrieving scheduled availability");
        return;
      }
      const availableResults = result.rows;

      const memberQuery = "SELECT username FROM members";
      pool.query(memberQuery, [], (error, result) => {
        if (error) {
          console.error("Error retrieving member usernames: ", error);
          res.status(500).send("Error retrieving member usenames")
          return;
        }
        const usernames = result.rows;
        res.render('trainerDashboard', { time: availableResults, member: usernames});
      });
    });
  });
});

// route to open adminDashboard
app.get('/adminDashboard', (req, res) => {
  var roomInfo = [];
  var trainerInfo = [];
  var scheduledInfo = []
  const roomInfoQuery = "SELECT * FROM rooms;"
  pool.query(roomInfoQuery, [], (error, result) => {
    if (error) {
      console.error("Error in retrieving room info: ", error);
      res.status(500).send("Error in retrieving room info");
      return;
    }
    roomInfo = result.rows;

    const trainerInfoQuery = "SELECT * FROM trainers";
    pool.query(trainerInfoQuery, [], (error, result) => {
      if (error) {
        console.error("Error in retrieving trainer info: ", error);
        res.status(500).send("Error in retrieving trainer info")
        return;
      }
      trainerInfo = result.rows;

      const scheduledQuery = "SELECT c.*, r.room_name FROM classschedule c JOIN rooms r ON c.room_id = r.room_id";
      pool.query(scheduledQuery, [], (error, result) => {
        if(error) {
          console.error("Error retrieving scheduled classes: ", error);
          res.status(500).send("Error retrieving scheduled classes");
          return;
        }
        scheduledInfo = result.rows;
        const equipmentQuery = "SELECT * FROM equipmentmaintenance";
        pool.query(equipmentQuery, [], (error, result) => {
          if (error) {
            console.error("Error executing equipment query:", error);
            res.status(500).send("Error retrieving equipment info");
            return;
          }
          const equipment = result.rows;

          const date = new Date();
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let currentDate = `${day}-${month}-${year}`
          const paymentQuery = "SELECT * FROM billingandpayment WHERE date > $1";

          pool.query(paymentQuery, [currentDate], (error, result) => {
            if (error) {
              console.error("Error retrieving upcoming payments", error);
              res.status(500).send("Error retrieving upcoming payments");
              return;
            }
            paymentResult = result.rows;

            const membersQuery = "SELECT * FROM members";
            pool.query(membersQuery, [], (error, result) => {
              if (error) {
                console.error("Error retrieving members: ", error);
                res.status(500).send("Error retrieving members");
                return;
              }
              const memberResult = result.rows;

              const roomBookingQuery = "SELECT * FROM roombookings";
              pool.query(roomBookingQuery, [], (error, result) => {
                if (error) {
                  console.error("Error retrieving room bookings: ", error);
                  res.status(500).send("Error retrieving room bookings");
                  return;
                }
                const roomBookingInfo = result.rows;
                res.render("adminDashboard", {room: roomInfo, trainer: trainerInfo, scheduled: scheduledInfo, Equipment: equipment, payment: paymentResult, member: memberResult, roomBooking: roomBookingInfo})
              }) 
            })
          })
        });
      })
    })
  })
});



// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database:', result.rows[0].now);
  }
});

//start server
app.listen(port, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${port} CNTL:-C to stop`)
		console.log('http://localhost:3000')

	}
})

//method to login users
app.post('/login', (request, response) => {
  username = request.body.username;
  const password = request.body.password;

  const checkUserQuery = 'SELECT username, role FROM members WHERE username = $1 AND password = $2';

  pool.query(checkUserQuery, [username, password], (error, result) => {
    if (error) {
      console.error("Error logging in user: ", error);
      response.status(500).send("Error logging in user");
      return;
    }

    // If user not found or invalid credentials, check trainer and admin
    if (result.rows.length === 0) {
      const checkTrainerQuery = 'SELECT username, role FROM trainers WHERE username =$1 AND password = $2';
      pool.query(checkTrainerQuery, [username, password], (error, result) => {
        if (error) {
          console.error("Error logging in trainer: ", error);
          response.status(500).send("Error logging in trainer");
          return;
        }
        if (result.rows.length === 0) {
          const checkAdminQuery = "SELECT username, role FROM admins WHERE username = $1 AND password = $2";
          pool.query(checkAdminQuery, [username, password], (error, result) => {
            if (error) {
              console.error("Error logging in admin: ", error);
              response.status(500).send("Error logging in admin");
              return;
            }
            if (result.rows.length === 0) {
              response.status(401).send("Invalid credentials");
              return;
            } else {
              response.redirect("/adminDashboard");
              console.log(`${username} logged in successfully as admin`);
            }
          });
        } else {
          response.redirect('/trainerDashboard');
          console.log(`${username} logged in successfully as trainer`);
        }
      });
    } else {
      // User found, redirect to member dashboard
      response.redirect('/memberDashboard');
      console.log(`${username} logged in successfully as member`);
    }
  });
});


//method to register members
app.post('/register', (request, response) => {
  const newUsername = request.body.newUsername;
  const newPassword = request.body.newPassword;

  const checkUserQuery = 'SELECT username FROM members WHERE username = $1';

  pool.query(checkUserQuery, [newUsername], (error,result)=> {
    if(error){
      console.error("Error checking username:", error);
      response.status(500).send("Error checking username");
      return;
    }
    if (result.rows.length > 0){
      response.status(400).send('User already exists');
      return;
    }



    const registerUserQuery = 'INSERT INTO members (username, password) VALUES ($1, $2)';
    pool.query(registerUserQuery, [newUsername, newPassword], (registerError, registerResult) => {
      if (registerError){
        console.error("Error registering user:", registerError);
        response.status(500).send("Error registering user")
        return;
      }

      console.log(newUsername + ' registered successfully');
      username = newUsername;
      response.redirect("/memberDashboard");
    })
  })
});

app.post('/update', (request, response) => {
  const username = request.body.username;
  const newUsername = request.body.newUsername;
  const newPassword = request.body.newPassword;
  const goalWeight = request.body.goalWeight;
  const curWeight = request.body.curWeight;
  const height = request.body.height;
  const bfp = request.body.bfp;

  const checkUserQuery = 'SELECT username from members WHERE username = $1';

  pool.query(checkUserQuery, [username], (error, result) => {
    if(error){
      console.error("Error checking username: ", error);
      response.status(500).send("Error checking username");
      return;
    }
    if (result.rows.length < 1) {
      response.status(400).send("User does not exist")
      return;
    }

    // Query to retrieve the member's ID based on the username
    const memberIDQuery = "SELECT member_id FROM members WHERE username = $1";
    pool.query(memberIDQuery, [username], (error, result) => {
      if (error) {
        console.error("Error retrieving member ID", error);
        response.status(500).send("Error retrieving member ID");
        return;
      }
    const memberId = result.rows[0].member_id;

    const updateUserQuery = 'UPDATE members SET username = $1, password = $2, goal_value = $3 WHERE username = $4';
    pool.query(updateUserQuery, [newUsername, newPassword, goalWeight, username], (error, result) => {
      if(error){
        console.error("Error updating user information: ", error);
        response.status(500).send("Error updating user information");
        return;
      }
      console.log("User information updated successfully")
    })

    const insertMetricsQuery = 'INSERT INTO healthmetrics (member_id, date, weight, height, bmi, body_fat_percentage) VALUES ($1, CURRENT_DATE, $2, $3, ($2 / (POWER($3, 2)) * 703), $4)';
    pool.query(insertMetricsQuery, [memberId, curWeight, height, bfp], (error, result) => {
      if (error) {
        console.error("Error inserting metrics information: ", error);
        response.status(500).send("Error inserting metrics information")
        return;
      }
      console.log("User health metrics updated successfully")
      response.redirect('/memberDashboard');
    })
  })
  })
});

//method to display member's exercises;
app.post("/display", (request, response) => {
  const memberIDQuery = "SELECT member_id FROM members WHERE username = $1";
  pool.query(memberIDQuery, [username], (error, result) => {
    if (error) {
      console.error("Error retrieving member ID", error);
      response.status(500).send("Error retrieving member ID");
      return;
    }
    const memberId = result.rows[0].member_id;

    const exQuery = "SELECT exercise_name, sets, reps, weight_lifted FROM exerciseroutines WHERE member_id = $1";
    pool.query(exQuery, [memberId], (error, result) => {
      if (error) { 
        console.error("Error retrieving exercises: ", error);
        response.status(500).send("Error retrieving exercises");
        return;
      }

      var exerciseData = {exercise: result.rows};

      for(let i = 0; i<result.rows.length; i++) {
        
        exerciseData[i] = {exercise_name: result.rows[i].exercise_name,sets: result.rows[i].sets,reps: result.rows[i].reps,weight_lifted: result.rows[i].weight_lifted}

      }
      console.log(result.rows)
    });
  });
});

//method to allow user's to schedule personal workout sessions
app.post("/schedulePersonal", (request, response) => {
  const dateTime = request.body.workoutTime;
  const trainer = request.body.trainer;

  console.log(dateTime);

  var trainerID = 0;
  const trainerIDQuery = "SELECT trainer_id FROM trainers WHERE username = $1";
  pool.query(trainerIDQuery, [trainer], (error, result) => {
      if (error) {
          console.error("Error retrieving trainerId: ", error)
          response.status(500).send("Error retrieving trainerID");
          return;
      }
      trainerID = result.rows[0].trainer_id;
      const memberIDQuery = "SELECT member_id FROM members WHERE username = $1";
      pool.query(memberIDQuery, [username], (error, result) => {
          if (error) {
              console.error("Error retrieving member ID", error);
              response.status(500).send("Error retrieving member ID");
              return;
          }
          const memberId = result.rows[0].member_id;
          console.log(trainerID)
          const personalQuery = "SELECT status FROM personaltrainingsessions WHERE date_time = $1 AND trainer_id = $2";
          pool.query(personalQuery, [dateTime, trainerID], (error, result) => {
              if (error) {
                  console.error("Error retrieving sessions: ", error)
                  response.status(500).send("Error retrieving sessions");
                  return;
              }
              if (result.rows.length > 0) {
                  console.error("Timing not available at requested sessions time");
                  response.status(404).send("Timing not available at requested sessions time");
                  return;
              } else if (dateTime.split(" ")[1] > '09:00:00' && dateTime.split(" ")[1] < '10:00:00') {
                  console.error("Timing not available at requested sessions time");
                  response.status(404).send("Timing not available at requested sessions time");
                  return;
              } else {
                  const availableQuery = "SELECT * FROM trainer_availability WHERE trainer_id = $1 AND $2 > start_time AND $2 < end_time";
                  pool.query(availableQuery, [trainerID, dateTime], (error, result) => {
                      if (error) {
                          console.error("Error retrieving availability: ", error);
                          response.status(500).send("Error retrieving availability");
                          return;
                      } else if (result.rows.length === 0) {
                          console.error("Session is unavailable at chosen time");
                          response.status(404).send("Session is unavailable at chosen time");
                          return;
                      } else {
                          const personalInsert = "INSERT INTO personaltrainingsessions (member_id, trainer_id, status, date_time) VALUES ($1, $2, $3, $4)";
                          pool.query(personalInsert, [memberId, trainerID, 'booked', dateTime], (error, result) => {
                              if (error) {
                                  console.error("Error inserting personal sessions: ", error);
                                  response.status(500).send("Error inserting personal session");
                                  return;
                              }
                              response.redirect("/memberDashboard");
                          });
                      }
                  });
              }
          });
      });
  });
});


//method to allows users to join class sessions
app.post("/scheduleGroup", (request, response) => {
  const chosenSesh = request.body.sessionTime;
  const chosenClassId = chosenSesh.split(",")[0];

  const memberIDQuery = "SELECT member_id FROM members WHERE username = $1";
      pool.query(memberIDQuery, [username], (error, result) => {
        if (error) {
          console.error("Error retrieving member ID", error);
          response.status(500).send("Error retrieving member ID");
          return;
        }
        const memberId = result.rows[0].member_id;
        const checkGroupQuery = "SELECT array_length(member_ids, 1) AS array_length FROM classschedule WHERE class_id = $1";

        pool.query(checkGroupQuery, [chosenClassId], (error, result) => {
          if(error){
            console.error("Error retrieving array length: ", error);
            response.status(500).send("Error retrieving array length");
            return;
          } else if (result.rows[0].array_length >= 30){
            console.error("session is full at chosen time");
            response.status(404).send("session is full at chosen time");
          } else {
            const updateGroupQuery = "UPDATE classschedule SET member_ids = ARRAY_APPEND(member_ids, $1) WHERE class_id = $2";
            pool.query(updateGroupQuery, [memberId, chosenClassId], (error, result) => {
              if (error) {
                console.error("Error in inserting member to session");
                response.status(500).send("Error in inserting member to session");
                return;
              }
              response.redirect("/memberDashboard")
            })
          }
      });
  })
})


app.post("/available", (request, response) => {
  const startTime = request.body.startTime;
  const endTime = request.body.endTime;
  const trainerIDQuery = "SELECT trainer_id FROM trainers WHERE username = $1";
  pool.query(trainerIDQuery, [username], (error, result) => {
    if(error){
      console.error("Error retrieving trainerId: ", error);
      response.status(500).send("Error retriving trainerId")
      return;
    }
    const trainerID = result.rows[0].trainer_id;
    const availableQuery = "INSERT INTO trainer_availability (trainer_id, start_time, end_time) VALUES ($1, $2, $3)";

    pool.query(availableQuery, [trainerID, startTime, endTime], (error,result) => {
      if(error) {
        console.error("Error inserting availability: ", error);
        response.status(500).send("Error inserting availabilty");
        return;
      } else {
        console.log("Availability inserted successfully!")
        response.redirect("/trainerDashboard")
      }
    })

  }) 
})

//method to allow trainers to search and retrieve info about specified members
app.post("/memberSearch", (request, response) => {
  const memberChosen = request.body.member;

  const memberIDQuery = "SELECT member_id FROM members WHERE username=$1";
  pool.query(memberIDQuery, [memberChosen], (error, result) => {
    if (error) {
      console.error("Error retrieving memberId: ", error);
      response.status(500).send("Error retrieving memberID")
      return;
    }
    const memberID = result.rows[0].member_id;

    const memberInfoQuery = 'SELECT date, weight, bmi, body_fat_percentage FROM healthmetrics WHERE member_id = $1'
    pool.query(memberInfoQuery, [memberID], (error, result) => {
      if (error) {
        console.error("Error retrieving member information:", error);
        response.status(500).send("Error retrieving member information");
        return;
      }
      const userInfo = result.rows;
      response.render("trainerDashboard", {memberChosen: userInfo, selectedMember: memberChosen});
    });
  });
});

//method to allow admins to book a class
app.post("/room", (request, response) => {
  const selectedRoom = request.body.room;
  const selectedTrainer = request.body.trainer;
  const startTime = request.body.startTime;
  const endTime = request.body.endTime;

  const getTrainerIdQuery = "SELECT trainer_id FROM trainers WHERE username = $1";
  pool.query(getTrainerIdQuery, [selectedTrainer], (error, result) => {
    if (error) {
      console.error("Error in retrieving trainer Id: ", error);
      response.status(500).send("Error in retrieving trainer Id");
      return;
    }
    const trainerId = result.rows[0].trainer_id;

    const getRoomID = "SELECT room_id FROM rooms WHERE room_name = $1";
    pool.query(getRoomID, [selectedRoom], (error, result) => {
      if (error) {
        console.error("Error in retrieving room ID: ", error);
        response.status(500).send("Error in retrieving room Id");
        return;
      }
      const roomId = result.rows[0].room_id;

      const checkRoomAvailibility = "SELECT * FROM roombookings WHERE starting_time > $1 AND ending_time < $2";
      pool.query(checkRoomAvailibility, [startTime, endTime], (error, result) => {
        if(error) {
          console.error("Error retrieving room availability: ", error);
          response.status(500).send("Error retrieving room availability")
          return;
        } else if (result.rows.length > 0) {
          console.error("Room is unavailable for scheduled time: ", error);
          response.status(404).send("Room is unavailable for scheduled time");
          return;
        } else {
          const checkClassAvailability = "SELECT * FROM classschedule WHERE start_time > $1 AND end_time < $2";
          pool.query(checkClassAvailability, [startTime, endTime], (error, result) => {
            if (error) {
              console.error("Error retrieving classes: ", error);
              response.status(500).send("Error retrieving classes");
              return;
            } else if (result.rows.length > 0) {
              console.error("Selected time is unavailable: ", error);
              response.status(404).send("Selected time is unavailable");
              return;
            } else {
              const insertBookingQuery = "INSERT INTO classschedule (trainer_id, capacity, room_id, member_ids, start_time, end_time) VALUES ($1, 30, $2, '{}', $3, $4)";
              pool.query(insertBookingQuery, [trainerId, roomId, startTime, endTime], (error, result) => {
                if (error) {
                  console.error("Error in inserting booking: ", error);
                  response.status(500).send("Error in inserting booking");
                  return;
                }
              response.redirect("/adminDashboard")
              })
            }
          })
        }
      })
    })
  })
})

//method to allow admins to delete a class
app.post("/delete", (request, response) => {
  const classID = request.body.scheduled.split(",")[0];
  const startTime = request.body.scheduled.split(",")[1];
  const roomName = request.body.scheduled.split(",")[2];

  const deleteQuery = "DELETE FROM classschedule WHERE class_id = $1";
  pool.query(deleteQuery, [classID], (error, result) => {
    if (error) {
      console.error("Error in deleting scheduled class: ", error);
      response.status(500).send("Error in deleting scheduled class");
      return;
    }
    response.redirect("/adminDashboard");
  })
})

//method for admin to process a payment
app.post("/pay", (request, response) => {
  const transactionID = request.body.upcomingPay.split(",")[0];
  const date = request.body.upcomingPay.split(",")[1];
  const amount = request.body.upcomingPay.split(",")[2];
  const payQuery = "DELETE FROM billingandpayment WHERE transaction_id = $1";
  pool.query(payQuery, [transactionID], (error, result) => {
    if (error) {
      console.error("Error paying payment: ", error);
      response.status(500).send("Error paying payment");
      return;
    }
    response.redirect('/adminDashboard');
  })
})

//method for admin to create a bill
app.post("/makeBill", (request, response) => {
  const chosenMember = request.body.members;
  const amount = request.body.amount;
  const date = request.body.date;

  const getMemberId = "SELECT member_id FROM members WHERE username = $1";
  pool.query(getMemberId, [chosenMember], (error, result) => {
    if (error) {
      console.error("Error retrieving memberID: ", error);
      response.status(500).send("Error retrieving memberID");
      return;
    }
    const memberID = result.rows[0].member_id;

    const createBill = "INSERT INTO billingandpayment (member_id, amount, date) VALUES ($1, $2, $3)";
    pool.query(createBill, [memberID, amount, date], (error, result) => {
      if (error) {
        console.error("Error creating bill: ", error);
        response.status(500).send("Error creating bill");
        return;
      }
      response.redirect("/adminDashboard");
    })
  })
})

//method to allow admin to book a room
app.post("/bookRoom", (request, response) => {
  const room = request.body.room;
  const startTime = request.body.startingTime;
  const endTime = request.body.endTime;
  const bookType = request.body.bookingType;

  const checkAvailabilityQuery = "SELECT * FROM classschedule WHERE start_time > $1 AND end_time < $2";
  pool.query(checkAvailabilityQuery, [startTime, endTime], (error, result) => {
    if (error) {
      console.error("Error retrieving scheduled classes: ", error);
      response.status(500).send("Error retrieving scheduled classes");
      return;
    } else if (result.rows.length > 0) {
      console.error("Chosen time is unavailable: ", error);
      response.status(404).send("Chosen time is unavailable")
      return;
    } else {
      const checkRoomAvailabilityQuery = "SELECT * FROM roombookings WHERE starting_time > $1 AND ending_time < $2";
      pool.query(checkRoomAvailabilityQuery, [startTime, endTime], (error, result) => {
        if(error){
          console.error("Error retrieving room bookings: ", error);
          response.status(500).send("Error retrieving room bookings");
          return;
        } else if (result.rows.length > 0) {
          console.error("Chosen time is unavailable: ", error);
          response.status(404).send("Chosen time is unavailable");
          return;
        } else {
          const insertRoomBookQuery = "INSERT INTO roombookings (room_name, starting_time, ending_time, bookingType) VALUES ($1,$2,$3,$4)";
          pool.query(insertRoomBookQuery, [room, startTime, endTime, bookType], (error, result) => {
            if (error) {
              console.error("Error inserting room booking: ", error);
              response.status(500).send("Error inserting room booking");
              return;
            }
            response.redirect("/adminDashboard");
          })
        }
      })
    }
  })
})

//method for admin to delete a room booking
app.post("/deleteBooking", (request, response) => {
  const roomName = request.body.roomName;
  const startingTime = request.body.startingTime;

  console.log(roomName);
  console.log(startingTime);

  const deleteRoomBookingQuery = "DELETE FROM roombookings WHERE room_name = $1 AND starting_time = $2";
  pool.query(deleteRoomBookingQuery, [roomName, startingTime], (error, result) => {
      if (error) {
          console.error("Error removing booking: ", error);
          response.status(500).send("Error removing booking");
          return;
      }
      console.log(result.rows);
      response.redirect("/adminDashboard");
  });
});
