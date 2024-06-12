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
    const idsToRemove = req.body.ids;
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var query = `DELETE FROM Volunteer WHERE volunteer_id IN (?)`;
      connection.query(query, [idsToRemove], function(err, result, fields) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (result.affectedRows > 0) {
          return res.status(200).json({message: 'Members removed successfully'});
        }
      });
    });
});

router.post('/addVolunteer', function(req, res, next) {
  // Extract the user_id and branch_id from the request body
  const { user_id, branch_id } = req.body;

  // Establish database connection and execute the user existence check query
  req.pool.getConnection(function(err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // Check if the user exists in the User table
    const userCheckQuery = 'SELECT * FROM User WHERE user_id = ?';
    connection.query(userCheckQuery, [user_id], function(err, userResult) {
      if (err) {
        connection.release();
        return res.sendStatus(500);
      }

      // If the user does not exist in the User table, return an error message
      if (userResult.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'The user does not exist' });
      }

      // Check if the user exists in the Volunteer table
      const volunteerCheckQuery = 'SELECT * FROM Volunteer WHERE user_id = ? and branch_id = ?';
      connection.query(volunteerCheckQuery, [user_id, branch_id], function(err, volunteerResult) {
        if (err) {
          connection.release();
          return res.sendStatus(500);
        }

         // If the user exists in the Volunteer table, return an error message
        if (volunteerResult.length > 0) {
          connection.release();
          return res.status(409).json({ error: 'The user already exists in the Volunteer table' });
        }

        // Insert a new row into NotificationSubscription table
        const insertSubscriptionQuery = 'INSERT INTO NotificationSubscription (subscribed_event, subscribed_update) VALUES (?, ?)';
        connection.query(insertSubscriptionQuery, [1, 1], function(err, subscriptionResult) {
          if (err) {
            connection.release();
            return res.sendStatus(500);
          }

          // Get the subscription_id from the inserted row
          const subscription_id = subscriptionResult.insertId;

          // Proceed with creating the new volunteer member
          const insertVolunteerQuery = 'INSERT INTO Volunteer (is_subscribed_notis, branch_id, user_id, subscription_id) VALUES (?, ?, ?, ?)';
          connection.query(insertVolunteerQuery, [1, branch_id, user_id, subscription_id], function(err, result) {
            connection.release(); // Release the connection

            if (err) {
              return res.sendStatus(500);
            }

            // Check if the new member was successfully inserted
            if (result.affectedRows > 0) {
              // Respond with success message
              return res.status(200).json({ message: 'New volunteer member created successfully' });
            } else {
              // No rows affected (insertion failed)
              return res.status(500).json({ error: 'Failed to create new volunteer member' });
            }
          });
        });
      });
    });
  });
});


module.exports = router;