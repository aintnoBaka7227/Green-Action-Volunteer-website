var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* get manager branch name */
router.get('/getManagerBranch', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const userId = req.session.user_id;

    var queryBranch = `
        SELECT
          m.branch_id,
          b.state
        FROM
          Manager m
          JOIN Branch b ON m.branch_id = b.branch_id
        WHERE
          m.user_id = ?`;

    connection.query(queryBranch, [userId], function(err, branches, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (branches.length === 0) {
        res.status(404).send("Branch not found");
        return;
      }

      res.json(branches[0]);
    });
  });
});

/* get branch member */
router.get('/getBranchMembers', function(req, res, next) {
  const branch = req.query.branch;
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = `SELECT Volunteer.*, User.* FROM Volunteer
    INNER JOIN User ON Volunteer.user_id = User.user_id
    WHERE Volunteer.branch_id = (SELECT branch_id FROM Branch WHERE state = ?)`;
    connection.query(query, [branch], function(err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/removeBranchMembers', function(req, res, next) {

});

module.exports = router;