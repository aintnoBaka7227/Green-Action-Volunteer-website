var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getManagerEvents', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // 1. Receive all public events
    var queryPublicEvents = `
      SELECT * FROM Event WHERE is_public = 1`;

    connection.query(queryPublicEvents, function(err, publicEvents, fields) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      // 2. Get user id
      const userId = req.session.user_id;

      // 3. Find branch based on id
      var queryBranches = `
        SELECT
          m.branch_id
        FROM
          Manager m
        WHERE
          m.user_id = ?`;

      connection.query(queryBranches, [userId], function(err, branches, fields) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        const branchIds = branches.map(branch => branch.branch_id);

        // 4. Receive private events for manager's branch
        if (!branchIds || branchIds.length === 0) {
          // If branchIds is empty, there are no branches for the user, so send only public events
          res.json(publicEvents);
          connection.release();
          return;
        }

        const placeholders = branchIds.map(() => '?').join(',');
        var queryPrivateEvents = `
            SELECT * FROM Event WHERE is_public = 0 AND branch_id IN (${placeholders})`;

        connection.query(queryPrivateEvents, branchIds, function(err, privateEvents, fields) {
          if (err) {
            console.error('Error fetching private events:', err);
            res.sendStatus(500);
            connection.release();
            return;
          }

          // Combine public and private events and send the results
          const allEvents = [...publicEvents, ...privateEvents];
          console.log(allEvents);
          res.json(allEvents);
          connection.release();
        });
      });
    });
  });
});

router.post('/createEvent', (req, res, next) => {
  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { event_type, date, time, street_address, city, state, postcode, content, is_public, branch_id } = req.body;

    // Perform validation on the event data
    if (!event_type || !date || !time || !street_address || !city || !state || !postcode || !content || !is_public ||!branch_id) {
      connection.release();
      return res.status(400).json({ error: 'Event name and date are required' });
    }

    // Insert the new event into the database
    const query = 'INSERT INTO Event (event_type, date, time, street_address, city, state, postcode, content, is_public, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [event_type, date, time, street_address, city, state, postcode, content, is_public, branch_id];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error creating event:', err);
        connection.release();
        return res.status(500).json({ error: 'An error occurred while creating the event' });
      }

      const newEventId = result.insertId;
      connection.release();
      res.status(200).json({ id: newEventId });
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