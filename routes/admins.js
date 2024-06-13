var express = require('express');
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
    m.manager_id,
    a.admin_id,
    CASE
        WHEN v.volunteer_id IS NOT NULL THEN 'Volunteer'
        WHEN m.manager_id IS NOT NULL THEN 'Manager'
        WHEN a.admin_id IS NOT NULL THEN 'Admin'
        ELSE 'Role unassigned'
    END AS user_type,
    CASE
        WHEN v.branch_id IS NOT NULL OR m.branch_id IS NOT NULL THEN b.state
        WHEN a.admin_id IS NOT NULL OR (v.volunteer_id IS NULL AND m.manager_id IS NULL AND a.admin_id IS NULL) THEN 'Branch unassigned'
        ELSE NULL
    END AS state
    FROM
        User u
    LEFT JOIN Volunteer v ON u.user_id = v.user_id
    LEFT JOIN Manager m ON u.user_id = m.user_id
    LEFT JOIN Admin a ON u.user_id = a.user_id
    LEFT JOIN Branch b ON v.branch_id = b.branch_id OR m.branch_id = b.branch_id
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
      console.error('Error getting connection from pool:', err);
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
        console.error('Error fetching available branches:', error);
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
      console.log(results[0]);
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
      console.log(`Missing ${key}`);
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


router.post('/addNewUser', function(req, res, next) {
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
      connection.query(checkDuplicateQuery, checkDuplicateValues, (err, results) => {
          if (err) {
              connection.release();
              return res.status(500).json({ success: false, message: "Failed to check duplicate user.", error: err.message });
          }

          if (results[0].count > 0) {
              connection.release();
              return res.status(400).json({ success: false, message: "Email or phone number already exists." });
          }

          // If no duplicate, proceed to insert user
          const userInfo = [first_name, last_name, email, phone_number, gender, password, DOB];
          const addUserQuery = 'INSERT INTO User (first_name, last_name, email, phone_number, gender, password, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)';
          connection.query(addUserQuery, userInfo, (err, result) => {
              connection.release();
              if (err) {
                  return res.status(500).json({ success: false, message: "Failed to add user.", error: err.message });
              }

              res.status(200).json({ success: true, message: "User added successfully.", user: result.insertId });
          });
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



module.exports = router;