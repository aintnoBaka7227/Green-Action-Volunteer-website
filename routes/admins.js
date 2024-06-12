var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getUsers', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
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
    connection.query(userQuery, function(err, results, fields) {
      if (err) {
        return res.sendStatus(500);
      }
      res.json(results);
    });
  });
});


module.exports = router;