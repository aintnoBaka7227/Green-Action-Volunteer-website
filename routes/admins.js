var express = require('express');
var router = express.Router();
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