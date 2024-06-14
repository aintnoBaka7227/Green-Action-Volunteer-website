var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// Login route
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

        connection.query(query, [req.body.email], async function (err, results, fields) {
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

            const user = results[0];

            try {
                // Compare the provided password with the hashed password in the database
                const isMatch = await bcrypt.compare(req.body.password, user.password);

                if (!isMatch) {
                    res.status(400).send("Incorrect password");
                    return;
                }

                console.log("Login method called");

                console.log("User info:", user);

                // Set session variable for the role
                req.session.role = user.role;
                console.log("User Role:", user.role);

                if (req.session.role == "unknown") {
                    req.session.role = "volunteer";
                }

                req.session.user_id = user.user_id;
                console.log("User ID:", user.user_id);

                // Send response with status and role in JSON format
                res.status(200).json({ status: "OK", role: req.session.role });
            } catch (error) {
                console.error("Error comparing passwords:", error);
                res.status(500).send("Internal Server Error");
            }
        });
    });
});


// Signup route
router.post('/signup', async function (req, res, next) {
    req.pool.getConnection(async function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Check if the email already exists in the database
        let checkQuery = 'SELECT * FROM User WHERE email=?;';
        connection.query(checkQuery, [req.body.email], async function (checkErr, checkResults, checkFields) {
            if (checkErr) {
                console.log(checkErr);
                res.status(500).send("Internal Server Error");
                return;
            }

            // If the email already exists, return an error
            if (checkResults.length > 0) {
                res.status(400).send("Email already exists!");
                connection.release();
                return;
            }

            try {
                // If the email doesn't exist, hash the password and proceed with the signup
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

                let insertQuery = 'INSERT INTO User (first_name, last_name, email, phone_number, gender, password, DOB) VALUES (?, ?, ?, ?, ?, ?, ?);';
                let values = [req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.gender, hashedPassword, req.body.DOB];

                connection.query(insertQuery, values, function (insertErr, insertResults, insertFields) {
                    if (insertErr) {
                        console.log(insertErr);
                        res.status(500).send("Internal Server Error");
                        connection.release();
                        return;
                    }

                    // Query to get the user_id of the newly inserted user
                    let userIdQuery = 'SELECT user_id FROM User WHERE email = ?';
                    let emailValue = [req.body.email];

                    connection.query(userIdQuery, emailValue, function (userIdErr, userIdResults, userIdFields) {
                        connection.release();

                        if (userIdErr) {
                            console.log(userIdErr);
                            res.status(500).send("Internal Server Error");
                            return;
                        }

                        if (userIdResults.length > 0) {
                            // Set session variable for the role
                            req.session.role = "volunteer";
                            console.log("User Role:", req.session.role);

                            req.session.user_id = userIdResults[0].user_id;
                            console.log("User ID:", userIdResults[0].user_id);

                            res.sendStatus(200); // Signup successful
                        } else {
                            res.status(500).send("User not found after insertion");
                        }
                    });
                });
            } catch (error) {
                console.error("Error hashing password:", error);
                res.status(500).send("Internal Server Error");
                connection.release();
            }
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
                    connection.release();
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                if (results.length > 0) {
                    // User exists, log them in
                    let roleQuery = `
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

                    connection.query(roleQuery, [email], function (roleErr, roleResults) {
                        connection.release();

                        if (roleErr) {
                            console.log(roleErr);
                            res.status(500).send("Internal Server Error");
                            return;
                        }

                        req.session.role = roleResults[0].role || 'volunteer';
                        req.session.user_id = roleResults[0].user_id;
                        res.status(200).json({ status: "OK", role: req.session.role });
                    });
                } else {
                    // User does not exist, create a new user and set role as 'volunteer' by default
                    let insertQuery = 'INSERT INTO User (first_name, last_name, email) VALUES (?, ?, ?);';
                    let values = [firstName, lastName, email];
                    connection.query(insertQuery, values, function (insertErr, insertResults) {
                        if (insertErr) {
                            connection.release();
                            console.log(insertErr);
                            res.status(500).send("Internal Server Error");
                            return;
                        }

                        req.session.role = "volunteer";
                        let userIdQuery = 'SELECT user_id FROM User WHERE email = ?';
                        connection.query(userIdQuery, [email], function (userIdErr, userIdResults) {
                            connection.release();

                            if (userIdErr) {
                                console.log(userIdErr);
                                res.status(500).send("Internal Server Error");
                                return;
                            }

                            if (userIdResults.length > 0) {
                                req.session.user_id = userIdResults[0].user_id;
                                res.status(200).json({ status: "OK", role: req.session.role });
                            } else {
                                res.status(500).send("User not found after insertion");
                            }
                        });
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


router.get('/me', isAuthenticated, function (req, res) {
    const userId = req.session.user_id;

    const query = 'SELECT first_name, last_name, email, phone_number, gender, DOB FROM User WHERE user_id = ?';

    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        connection.query(query, [userId], function (err, results) {
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

router.post('/edit', isAuthenticated, async function (req, res) {
    const userId = req.session.user_id;
    const { first_name, last_name, phone_number, gender, DOB, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    const query = 'UPDATE User SET first_name = ?, last_name = ?, phone_number = ?, gender = ?, DOB = ?, password = ? WHERE user_id = ?';

    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500).send("Internal Server Error");
            return;
        }

        connection.query(query, [first_name, last_name, phone_number, gender, DOB, hashedPassword, userId], function (err, results) {
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

router.get('/user-name', function (req, res, next) {
    req.pool.getConnection(function (err, connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        const userId = req.session.user_id;

        console.log(userId);

        var queryUserName = `SELECT first_name FROM User WHERE user_id = ?`


        connection.query(queryUserName, [userId], function (err, result, fields) {
            if (err) {
                console.log("got here and broke");
                connection.release();
                res.sendStatus(500);
                return;
            }

            if (result.length === 0) {
                console.log(userId);
                res.status(404).json({ error: "User not found" });
                connection.release();
                return;
            }

            const userName = result[0].first_name;
            res.json({ first_name: userName });
            console.log({ first_name: userName });

            connection.release();
        });
    });
});


module.exports = router;
