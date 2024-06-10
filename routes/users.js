var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        let query = `
            SELECT
                u.*,
                CASE
                    WHEN v.user_id IS NOT NULL THEN 'volunteer'
                    WHEN a.user_id IS NOT NULL THEN 'admin'
                    WHEN m.user_id IS NOT NULL THEN 'manager'
                    ELSE 'unknown'
                END AS role
            FROM User u
            LEFT JOIN Volunteer v ON u.user_id = v.user_id
            LEFT JOIN Admin a ON u.user_id = a.user_id
            LEFT JOIN Manager m ON u.user_id = m.user_id
            WHERE u.email=?;
        `;

        connection.query(query, [req.body.email], function (err, results, fields) {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (!results[0]) {
                res.status(400).send("Email not found!");
                return;
            }

            // Compare the passwords directly (not recommended in production)
            if (req.body.password !== results[0].password) {
                res.status(400).send("Incorrect password");
                return;
            }

            console.log("Login method called");

            // Set session variable for the role
            req.session.role = results[0].role;
            console.log("User Role:", results[0].role);

            req.session.user_id = results[0].user_id;
            console.log("User ID:", results[0].user_id);

            // Send response with status and role in JSON format
            res.status(200).json({ status: "OK", role: req.session.role });
        });
    });
});


router.post('/signup', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
      if (cerr) {
          console.log(cerr);
          res.status(500).send("Internal Server Error");
          return;
      }

      // Check if the email already exists in the database
      let checkQuery = 'SELECT * FROM User WHERE email=?;';
      connection.query(checkQuery, [req.body.email], function (checkErr, checkResults, checkFields) {
          if (checkErr) {
              console.log(checkErr);
              res.status(500).send("Internal Server Error");
              return;
          }

          // If the email already exists, return an error
          if (checkResults.length > 0) {
              res.status(400).send("Email already exists!");
              return;
          }

          // If the email doesn't exist, proceed with the signup
          let insertQuery = 'INSERT INTO User (first_name, last_name, email, phone_number, gender, password, DOB) VALUES (?, ?, ?, ?, ?, ?, ?);';
          let values = [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.gender, req.body.password, req.body.DOB];
          connection.query(insertQuery, values, function (insertErr, insertResults, insertFields) {
              connection.release();

              if (insertErr) {
                  console.log(insertErr);
                  res.status(500).send("Internal Server Error");
                  return;
              }
              // Set session variable for the role
              req.session.role = results[0].role;
              console.log("User Role:", results[0].role);

              req.session.user_id = results[0].user_id;
              console.log("User ID:", results[0].user_id);

              res.sendStatus(200); // Signup successful
          });
      });
  });
});

router.post('/glogin', async function (req, res) {
    const token = req.body.credential;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const firstName = payload.given_name;
        const lastName = payload.family_name;

        req.pool.getConnection(function (cerr, connection) {
            if (cerr) {
                console.log(cerr);
                res.status(500).send("Internal Server Error");
                return;
            }

            let query = 'SELECT * FROM User WHERE email = ?;';
            connection.query(query, [email], function (err, results) {
                if (err) {
                    connection.release(); // Release the connection back to the pool
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                if (results.length > 0) {
                    // User exists, log them in
                    let query = `
                        SELECT
                            u.*,
                            CASE
                                WHEN v.user_id IS NOT NULL THEN 'volunteer'
                                WHEN a.user_id IS NOT NULL THEN 'admin'
                                WHEN m.user_id IS NOT NULL THEN 'manager'
                                ELSE 'unknown'
                            END AS role
                        FROM User u
                        LEFT JOIN Volunteer v ON u.user_id = v.user_id
                        LEFT JOIN Admin a ON u.user_id = a.user_id
                        LEFT JOIN Manager m ON u.user_id = m.user_id
                        WHERE u.email=?;
                    `;

                    connection.query(query, [email], function (err, results, fields) {
                        connection.release(); // Release the connection back to the pool

                        if (err) {
                            console.log(err);
                            res.status(500).send("Internal Server Error");
                            return;
                        }

                        // Set session variable for the role
                        req.session.role = results[0].role;
                        console.log("User Role:", results[0].role);

                        req.session.user_id = results[0].user_id;
                        console.log("User ID:", results[0].user_id);

                        // Send response with status and role in JSON format
                        res.status(200).json({ status: "OK", role: req.session.role });
                    });
                } else {
                    // User does not exist, create a new user
                    let insertQuery = 'INSERT INTO User (first_name, last_name, email) VALUES (?, ?, ?);';
                    connection.query(insertQuery, [firstName, lastName, email], function (insertErr, insertResults) {
                        connection.release(); // Release the connection back to the pool

                        if (insertErr) {
                            console.log(insertErr);
                            res.status(500).send("Internal Server Error");
                            return;
                        }

                        res.status(200).send("Signup and login successful");
                    });
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid token");
    }
});

function isAuthenticated(req, res, next) {
    console.log(req.session);
    console.log(req.session.user_id);

    if (req.session && req.session.user_id) {
        return next();
    } else {
        res.status(401).send('Unauthorized');
    }
}


router.get('/me', isAuthenticated, function(req, res) {
    const userId = req.session.user_id;

    const query = 'SELECT first_name, last_name, email, phone_number, gender, DOB FROM User WHERE user_id = ?';

    req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        connection.query(query, [userId], function(err, results) {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send("User not found");
            }
        });
    });
});

router.post('/edit', isAuthenticated, function(req, res) {
    const userId = req.session.user_id;
    const { first_name, last_name, phone_number, gender, DOB, password } = req.body;

    const query = 'UPDATE User SET first_name = ?, last_name = ?, phone_number = ?, gender = ?, DOB = ?, password = ? WHERE user_id = ?';

    dbConnectionPool.getConnection(function(cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        connection.query(query, [first_name, last_name, phone_number, gender, DOB, password, userId], function(err, results) {
            connection.release();

            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.status(200).send("User updated successfully");
        });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('An error occurred. Please try again later.');
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).send('Logout successful');
    });
});

module.exports = router;
