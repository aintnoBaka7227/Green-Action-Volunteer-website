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


module.exports = router;