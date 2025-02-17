var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const path = require('path');
var { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getUsers', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    const userQuery = `
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.gender,
    v.volunteer_id,
    NULL AS manager_id,
    NULL AS admin_id,
    v.branch_id,
    b.state,
    'Volunteer' AS user_type
FROM
    User u
JOIN
    Volunteer v ON u.user_id = v.user_id
JOIN
    Branch b ON v.branch_id = b.branch_id

UNION ALL

SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.gender,
    NULL AS volunteer_id,
    m.manager_id,
    NULL AS admin_id,
    m.branch_id,
    b.state,
    'Manager' AS user_type
FROM
    User u
JOIN
    Manager m ON u.user_id = m.user_id
JOIN
    Branch b ON m.branch_id = b.branch_id

UNION ALL

SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.gender,
    NULL AS volunteer_id,
    NULL AS manager_id,
    a.admin_id,
    NULL AS branch_id,
    NULL AS state,
    'Admin' AS user_type
FROM
    User u
JOIN
    Admin a ON u.user_id = a.user_id

UNION ALL

SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.gender,
    NULL AS volunteer_id,
    NULL AS manager_id,
    NULL AS admin_id,
    NULL AS branch_id,
    'Unassigned' AS state,
    'Unassigned' AS user_type
FROM
    User u
LEFT JOIN
    Volunteer v ON u.user_id = v.user_id
LEFT JOIN
    Manager m ON u.user_id = m.user_id
LEFT JOIN
    Admin a ON u.user_id = a.user_id
WHERE
    v.user_id IS NULL
    AND m.user_id IS NULL
    AND a.user_id IS NULL

ORDER BY
    user_id, branch_id;
    `;
    connection.query(userQuery, function (err, results, fields) {
      if (err) {
        return res.sendStatus(500);
      }
      res.json(results);
    });
  });
});

router.get('/available-branches', (req, res) => {
  req.pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    const query = `
      SELECT
        Branch.branch_id,
        Branch.branch_name,
        CONCAT(User.first_name, ' ', User.last_name) AS manager_name,
        COUNT(Volunteer.volunteer_id) AS volunteer_count
      FROM Branch
      LEFT JOIN Manager ON Branch.branch_id = Manager.branch_id
      LEFT JOIN User ON Manager.user_id = User.user_id
      LEFT JOIN Volunteer ON Branch.branch_id = Volunteer.branch_id
      GROUP BY Branch.branch_id, Branch.branch_name, User.first_name, User.last_name
    `;

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      const branches = results.map(row => ({
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        manager_name: row.manager_name,
        volunteer_count: row.volunteer_count
      }));

      res.json({ branches });
    });
  });
});

router.get('/branches/:branch_id', (req, res) => {
  const branchId = req.params.branch_id;
  // Path to the HTML file
  const filePath = path.join(__dirname, '..', 'public', 'admins', 'branch.html');
  res.sendFile(filePath);
});

router.get('/getBranchInfo', function (req, res, next) {
  // Extract branch_id from query parameters
  const branch_id = parseInt(req.query.branch_id, 10);

  // Validate branch_id
  if (isNaN(branch_id)) {
    return res.status(400).json({ error: 'Invalid branch_id' });
  }

  // Get a database connection from the pool
  req.pool.getConnection(function (err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // SQL query to get branch information
    const branchQuery = `
    SELECT
      branch_id,
      branch_name,
      phone_number,
      street_address,
      city,
      state,
      postcode
    FROM
      Branch
    WHERE
      branch_id = ?
    `;

    // Execute the query with the branch_id as a parameter
    connection.query(branchQuery, [branch_id], function (err, results, fields) {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        return res.sendStatus(500);
      }

      // If no results, return a 404 error
      if (results.length === 0) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      // Return the branch information as a JSON response
      res.json(results[0]);
    });
  });
});

router.post('/deleteBranch', function (req, res, next) {
  // Extract branch_id from the request body
  const branch_id = parseInt(req.query.branch_id, 10);

  // Validate branch_id
  if (isNaN(branch_id)) {
    return res.status(400).json({ error: 'Invalid branch_id' });
  }

  // Get a database connection from the pool
  req.pool.getConnection(function (err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // Begin transaction to ensure atomicity
    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        return res.sendStatus(500);
      }

      // SQL query to delete the branch
      const deleteBranchQuery = `
        DELETE FROM Branch
        WHERE branch_id = ?
      `;

      // SQL query to delete manages entries
      const deleteManagersQuery = `
        DELETE FROM Manager
        WHERE branch_id = ?
      `;

      // SQL query to delete volunteer entries
      const deleteVolunteersQuery = `
        DELETE FROM Volunteer
        WHERE branch_id = ?
      `;

      // Execute delete operations in a transaction
      connection.query(deleteManagersQuery, [branch_id], function (err) {
        if (err) {
          connection.rollback(function () {
            connection.release();
            return res.sendStatus(500);
          });
        }

        connection.query(deleteVolunteersQuery, [branch_id], function (err) {
          if (err) {
            connection.rollback(function () {
              connection.release();
              return res.sendStatus(500);
            });
          }

          connection.query(deleteBranchQuery, [branch_id], function (err, results) {
            if (err) {
              connection.rollback(function () {
                connection.release();
                return res.sendStatus(500);
              });
            }

            // Commit the transaction
            connection.commit(function (err) {
              if (err) {
                connection.rollback(function () {
                  connection.release();
                  return res.sendStatus(500);
                });
              }

              // Check if any rows were affected (i.e., if the branch was deleted)
              if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Branch not found' });
              }

              // Return a success message
              res.json({ message: 'Branch and associated records deleted successfully' });
              connection.release();
            });
          });
        });
      });
    });
  });
});


router.post('/updateBranchDetails', function (req, res, next) {
  // Extract branch details from the request body
  const branch_id = parseInt(req.query.branch_id, 10);
  const branchDetails = {
    branch_name: req.body.branch_name,
    street_address: req.body.street_address,
    city: req.body.city,
    state: req.body.state,
    postcode: req.body.postcode,
    phone_number: req.body.phone_number
  };

  // Validate branch_id and other required fields
  if (isNaN(branch_id)) {
    return res.status(400).json({ error: 'Invalid branch_id' });
  }

  // Ensure all required fields are provided
  for (const [key, value] of Object.entries(branchDetails)) {
    if (!value) {
      return res.status(400).json({ error: `Missing ${key}` });
    }
  }

  // Get a database connection from the pool
  req.pool.getConnection(function (err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // SQL query to update the branch details
    const updateQuery = `
    UPDATE Branch SET
      branch_name = ?,
      street_address = ?,
      city = ?,
      state = ?,
      postcode = ?,
      phone_number = ?
    WHERE
      branch_id = ?
    `;

    // Execute the query with the branch details as parameters
    connection.query(updateQuery, [
      branchDetails.branch_name,
      branchDetails.street_address,
      branchDetails.city,
      branchDetails.state,
      branchDetails.postcode,
      branchDetails.phone_number,
      branch_id
    ], function (err, results, fields) {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        return res.sendStatus(500);
      }

      // Check if any rows were affected (i.e., if the branch was updated)
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      // Return a success message
      res.json({ message: 'Branch details updated successfully' });
    });
  });
});


router.post('/addNewUser', function (req, res, next) {
  // Extract user data from the request body
  const { first_name, last_name, email, phone_number, gender, password, DOB } = req.body;

  // Validate the incoming data (example validation)
  if (!first_name || !last_name || !email || !phone_number || !gender || !password || !DOB) {
    return res.status(400).json({ success: false, message: "Please provide all required fields." });
  }

  req.pool.getConnection((err, connection) => {
    if (err) {
      return res.sendStatus(500);
    }

    // Check if email or phone_number already exist
    const checkDuplicateQuery = 'SELECT COUNT(*) AS count FROM User WHERE email = ? OR phone_number = ?';
    const checkDuplicateValues = [email, phone_number];
    connection.query(checkDuplicateQuery, checkDuplicateValues, async (err, results) => {
      if (err) {
        connection.release();
        return res.status(500).json({ success: false, message: "Failed to check duplicate user.", error: err.message });
      }

      if (results[0].count > 0) {
        connection.release();
        return res.status(400).json({ success: false, message: "Email or phone number already exists." });
      }

      try {
        // Hash and salt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // If no duplicate, proceed to insert user
        const userInfo = [first_name, last_name, email, phone_number, gender, hashedPassword, DOB];
        const addUserQuery = 'INSERT INTO User (first_name, last_name, email, phone_number, gender, password, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)';

        connection.query(addUserQuery, userInfo, (err, result) => {
          connection.release();
          if (err) {
            return res.status(500).json({ success: false, message: "Failed to add user.", error: err.message });
          }

          res.status(200).json({ success: true, message: "User added successfully.", user: result.insertId });
        });
      } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        connection.release();
      }
    });
  });
});

router.post('/removeUsers', function (req, res, next) {
  const idsToRemove = req.body.ids;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = `DELETE FROM User WHERE user_id IN (?)`;
    connection.query(query, [idsToRemove], function (err, result, fields) {
      connection.release();
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Users removed successfully' });
      }
    });
  });
});

router.post('/createNewBranch', function(req, res, next) {
  // Extract branch details from the request body
  const branchDetails = {
    branch_name: req.body.branchName,
    street_address: req.body.branchStreet,
    city: req.body.branchCity,
    state: req.body.branchState,
    postcode: req.body.branchPostcode,
    phone_number: req.body.branchPhone
  };

  // Ensure all required fields are provided
  for (const [key, value] of Object.entries(branchDetails)) {
    if (!value) {
      console.log(`Missing ${key}`);
      return res.status(400).json({ error: `Missing ${key}` });
    }
  }

  // Get a database connection from the pool
  req.pool.getConnection(function(err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // SQL query to insert a new branch
    const insertQuery = `
      INSERT INTO Branch (branch_name, phone_number, street_address, city, state, postcode)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with the branch details as parameters
    connection.query(insertQuery, [
      branchDetails.branch_name,
      branchDetails.phone_number,
      branchDetails.street_address,
      branchDetails.city,
      branchDetails.state,
      branchDetails.postcode
    ], function(err, results, fields) {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        // Handle potential duplicate phone number error
        if (err.code === 'ER_DUP_ENTRY') {
          console.log("Dup Phone Number");
          return res.status(400).json({ error: 'Phone number must be unique' });
        }
        return res.sendStatus(500);
      }

      // Return a success message
      res.json({ message: 'New branch created successfully', branch_id: results.insertId });
    });
  });
});

router.post('/updateUser', function(req, res, next) {
  const { current_branch_id, new_branch_id, user_id, new_role } = req.body;
  console.log(current_branch_id);
  console.log(new_branch_id);
  console.log(user_id);
  console.log(new_role);

  if (!user_id || !new_role) {
    return res.status(400).json({ error: 'Missing user_id or new_role parameters' });
  }

  // Get a database connection from the pool
  req.pool.getConnection(function (err, connection) {
      if (err) {
          console.error('Error getting database connection:', err);
          return res.sendStatus(500);
      }

      // Begin a transaction
      connection.beginTransaction(function (err) {
          if (err) {
              connection.release();
              return res.status(500).json({ error: 'Error starting transaction' });
          }

          const deleteManagerQuery = `
              DELETE FROM Manager
              WHERE branch_id = ? AND user_id = ?
          `;
          const deleteVolunteerQuery = `
              DELETE FROM Volunteer
              WHERE branch_id = ? AND user_id = ?
          `;
          const deleteAdminQuery = `
              DELETE FROM Admin
              WHERE user_id = ?
          `;

          // Define delete functions with nested callbacks
          const deleteFromManager = (callback) => {
              if (current_branch_id !== null) {
                  connection.query(deleteManagerQuery, [current_branch_id, user_id], callback);
              } else {
                  callback(null);
              }
          };

          const deleteFromVolunteer = (callback) => {
              if (current_branch_id !== null) {
                  connection.query(deleteVolunteerQuery, [current_branch_id, user_id], callback);
              } else {
                  callback(null);
              }
          };

          const deleteFromAdmin = (callback) => {
              if (current_branch_id === null) {
                  connection.query(deleteAdminQuery, [user_id], callback);
              } else {
                  callback(null);
              }
          };

          const insertIntoNewRole = (callback) => {
              if (new_branch_id === null && new_role === 'Admin') {
                  const insertAdminQuery = `
                      INSERT INTO Admin (user_id)
                      VALUES (?)
                  `;
                  connection.query(insertAdminQuery, [user_id], callback);
              } else if (new_branch_id !== null) {
                  const insertNewRoleQuery = `
                      INSERT INTO ${connection.escapeId(new_role)} (branch_id, user_id)
                      VALUES (?, ?)
                  `;
                  connection.query(insertNewRoleQuery, [new_branch_id, user_id], callback);
              } else {
                  callback(null);
              }
          };

          // Execute the delete and insert operations in sequence
          deleteFromManager((err) => {
              if (err) {
                  console.error('Error deleting from Manager:', err);
                  return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: 'Error deleting from Manager' });
                  });
              }

              deleteFromVolunteer((err) => {
                  if (err) {
                      console.error('Error deleting from Volunteer:', err);
                      return connection.rollback(() => {
                          connection.release();
                          res.status(500).json({ error: 'Error deleting from Volunteer' });
                      });
                  }

                  deleteFromAdmin((err) => {
                      if (err) {
                          console.error('Error deleting from Admin:', err);
                          return connection.rollback(() => {
                              connection.release();
                              res.status(500).json({ error: 'Error deleting from Admin' });
                          });
                      }

                      insertIntoNewRole((err) => {
                          if (err) {
                              console.error('Error inserting into new role:', err);
                              return connection.rollback(() => {
                                  connection.release();
                                  res.status(500).json({ error: 'Error inserting into new role' });
                              });
                          }

                          connection.commit((err) => {
                              if (err) {
                                  console.error('Error committing transaction:', err);
                                  return connection.rollback(() => {
                                      connection.release();
                                      res.status(500).json({ error: 'Error committing transaction' });
                                  });
                              }

                              // Release the connection and send a success response
                              connection.release();
                              res.json({ message: 'User role updated successfully' });
                          });
                      });
                  });
              });
          });
      });
  });
});

router.get('/getPeopleInfo', function (req, res, next) {
  // Get a database connection from the pool
  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.sendStatus(500);
    }

    // SQL query to get total number of users, number of males, and number of females
    const query = `
      SELECT
        COUNT(*) AS totalPeople,
        SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) AS numMale,
        SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) AS numFemale
      FROM User
    `;

    // Execute the query
    connection.query(query, function(err, results, fields) {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        return res.sendStatus(500);
      }

      // Extract results from the query response
      const { totalPeople, numMale, numFemale } = results[0];

      // Prepare the response object
      const userStats = {
        totalPeople: totalPeople || 0,
        numMale: numMale || 0,
        numFemale: numFemale || 0
      };

      // Send the response as JSON
      res.json(userStats);
    });
  });
});


router.get('/getVolManInfo', function (req, res, next) {
  // Get a database connection from the pool
  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.sendStatus(500);
    }

    // SQL query to get manager count
    const managerQuery = `
      SELECT COUNT(*) AS managerCount
      FROM Manager
    `;

    // Execute managerQuery
    connection.query(managerQuery, function(err, managerResults) {
      if (err) {
        console.error('Error executing manager query:', err);
        connection.release();
        return res.sendStatus(500);
      }

      // Get managerCount from results
      const managerCount = managerResults[0].managerCount;

      // SQL query to get volunteer count
      const volunteerQuery = `
        SELECT COUNT(*) AS volunteerCount
        FROM Volunteer
      `;

      // Execute volunteerQuery
      connection.query(volunteerQuery, function(err, volunteerResults) {
        // Release the connection back to the pool
        connection.release();

        if (err) {
          console.error('Error executing volunteer query:', err);
          return res.sendStatus(500);
        }

        // Get volunteerCount from results
        const volunteerCount = volunteerResults[0].volunteerCount;

        // Prepare the response object
        const volManInfo = {
          managerCount: managerCount || 0,
          volunteerCount: volunteerCount || 0
        };

        // Send the response as JSON
        res.json(volManInfo);
      });
    });
  });
});

router.get('/getOtherInfo', function(req, res, next) {
  // Get a database connection from the pool
  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.sendStatus(500);
    }

    // SQL query to get event count
    const eventQuery = `
      SELECT COUNT(*) AS eventCount
      FROM Event
    `;

    // SQL query to get branch count
    const branchQuery = `
      SELECT COUNT(*) AS branchCount
      FROM Branch
    `;

    // SQL query to get event update count
    const updateQuery = `
      SELECT COUNT(*) AS updateCount
      FROM EventUpdate
    `;

    // Object to store counts
    const otherInfo = {};

    // Execute eventQuery
    connection.query(eventQuery, function(err, eventResults) {
      if (err) {
        console.error('Error executing event query:', err);
        connection.release();
        return res.sendStatus(500);
      }

      // Get eventCount from results
      otherInfo.eventCount = eventResults[0].eventCount;

      // Execute branchQuery
      connection.query(branchQuery, function(err, branchResults) {
        if (err) {
          console.error('Error executing branch query:', err);
          connection.release();
          return res.sendStatus(500);
        }

        // Get branchCount from results
        otherInfo.branchCount = branchResults[0].branchCount;

        // Execute updateQuery
        connection.query(updateQuery, function(err, updateResults) {
          // Release the connection back to the pool
          connection.release();

          if (err) {
            console.error('Error executing update query:', err);
            return res.sendStatus(500);
          }

          // Get updateCount from results
          otherInfo.updateCount = updateResults[0].updateCount;

          // Send the response as JSON
          res.json(otherInfo);
        });
      });
    });
  });
});

module.exports = router;