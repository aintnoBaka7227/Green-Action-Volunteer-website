var express = require('express');
var router = express.Router();
const path = require('path');
var { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* get manager branch name */
router.get('/getManagerBranch', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
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

    connection.query(queryBranch, [userId], function (err, branches, fields) {
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

router.get('/events/:event_id', (req, res) => {
  const eventId = req.params.event_id;
  // Path to the HTML file'
  const filePath = path.join(__dirname, '..', 'public', 'managers', 'event.html');
  res.sendFile(filePath);
});

router.get('/getManagerEvents', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // 1. Receive all public events
    var queryPublicEvents = `
      SELECT * FROM Event WHERE is_public = 1`;

    connection.query(queryPublicEvents, function (err, publicEvents, fields) {
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

      connection.query(queryBranches, [userId], function (err, branches, fields) {
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

        connection.query(queryPrivateEvents, branchIds, function (err, privateEvents, fields) {
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

router.get('/events/:event_id', (req, res) => {
  const eventId = req.params.event_id;
  // Path to the HTML file
  const htmlFilePath = path.join(__dirname, '/public/managers/event.html');
  res.sendFile(htmlFilePath);
});

router.post('/createEvent', (req, res, next) => {
  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { event_type, date, time, street_address, city, state, postcode, content, is_public, branch_id } = req.body;

    // Perform validation on the event data
    if (!event_type || !date || !time || !street_address || !city || !state || !postcode || !content || !is_public || !branch_id) {
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
router.get('/getBranchMembers', function (req, res, next) {
  const branch = req.query.branch;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = `SELECT Volunteer.*, User.* FROM Volunteer
    INNER JOIN User ON Volunteer.user_id = User.user_id
    WHERE Volunteer.branch_id = (SELECT branch_id FROM Branch WHERE state = ?)`;
    connection.query(query, [branch], function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/removeBranchMembers', function (req, res, next) {
  const idsToRemove = req.body.ids;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = `DELETE FROM Volunteer WHERE volunteer_id IN (?)`;
    connection.query(query, [idsToRemove], function (err, result, fields) {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
      }
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Members removed successfully' });
      }
    });
  });
});

router.post('/addVolunteer', function (req, res, next) {
  // Extract the user_id and branch_id from the request body
  const { user_id, branch_id } = req.body;

  // Establish database connection and execute the user existence check query
  req.pool.getConnection(function (err, connection) {
    if (err) {
      return res.sendStatus(500);
    }

    // Check if the user exists in the User table
    const userCheckQuery = 'SELECT * FROM User WHERE user_id = ?';
    connection.query(userCheckQuery, [user_id], function (err, userResult) {
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
      connection.query(volunteerCheckQuery, [user_id, branch_id], function (err, volunteerResult) {
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
        connection.query(insertSubscriptionQuery, [1, 1], function (err, subscriptionResult) {
          if (err) {
            connection.release();
            return res.sendStatus(500);
          }

          // Get the subscription_id from the inserted row
          const subscription_id = subscriptionResult.insertId;

          // Proceed with creating the new volunteer member
          const insertVolunteerQuery = 'INSERT INTO Volunteer (is_subscribed_notis, branch_id, user_id, subscription_id) VALUES (?, ?, ?, ?)';
          connection.query(insertVolunteerQuery, [1, branch_id, user_id, subscription_id], function (err, result) {
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

router.delete('/deleteEvent/:eventId', (req, res, next) => {
  const eventId = req.params.eventId;

  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if the event exists
    const checkQuery = 'SELECT * FROM Event WHERE event_id = ?';
    connection.query(checkQuery, [eventId], (err, results) => {
      if (err) {
        console.error('Error checking event:', err);
        connection.release();
        return res.status(500).json({ error: 'An error occurred while checking the event' });
      }

      if (results.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Event not found' });
      }

      // Delete the event
      const deleteQuery = 'DELETE FROM Event WHERE event_id = ?';
      connection.query(deleteQuery, [eventId], (err, result) => {
        if (err) {
          console.error('Error deleting event:', err);
          connection.release();
          return res.status(500).json({ error: 'An error occurred while deleting the event' });
        }

        connection.release();
        res.status(200).json({ message: 'Event deleted successfully' });
      });
    });
  });
});

router.get('/getEventInfo', (req, res, next) => {
  const eventId = req.query.eventId; // Retrieve eventId from query parameters

  // Query to fetch event information based on event_id
  const query = 'SELECT * FROM Event WHERE event_id = ?';

  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query(query, [eventId], (err, rows) => {
      connection.release(); // Release the connection

      if (err) {
        res.sendStatus(500);
        return;
      }

      // Send the event information as a response
      if (rows.length > 0) {
        const eventInfo = {
          event_id: rows[0].event_id,
          event_type: rows[0].event_type,
          time: rows[0].time,
          date: rows[0].date,
          state: rows[0].state,
          postcode: rows[0].postcode,
          branch_id: rows[0].branch_id
        };
        res.json(eventInfo);
      } else {
        res.sendStatus(404); // Event not found
      }
    });
  });
});


router.get('/getEventAttendees', (req, res, next) => {
  const eventId = parseInt(req.query.eventId, 10);

  if (isNaN(eventId)) {
      res.status(400).send('Invalid event ID');
      return;
  }

  req.pool.getConnection((err, connection) => {
      if (err) {
          res.sendStatus(500);
          return;
      }

      // Query to get all volunteer_ids for the given event_id
      connection.query('SELECT volunteer_id FROM EventRSVP WHERE event_id = ?', [eventId], (err, rsvpRows) => {
          if (err) {
              connection.release();
              res.sendStatus(500);
              return;
          }

          if (rsvpRows.length === 0) {
              connection.release();
              res.json([]);
              return;
          }

          const volunteerIds = rsvpRows.map(row => row.volunteer_id);

          // Query to get user_ids for all volunteer_ids
          connection.query('SELECT user_id FROM Volunteer WHERE volunteer_id IN (?)', [volunteerIds], (err, volunteerRows) => {
              if (err) {
                  connection.release();
                  res.sendStatus(500);
                  return;
              }

              const userIds = volunteerRows.map(row => row.user_id);

              // Query to get user info for all user_ids
              connection.query('SELECT user_id, first_name, last_name, email, phone_number FROM User WHERE user_id IN (?)', [userIds], (err, userRows) => {
                  connection.release();
                  if (err) {
                      res.sendStatus(500);
                      return;
                  }

                  res.json(userRows);
              });
          });
      });
  });
});

router.get('/getManagerUpdates', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Step 1: Retrieve all public event updates
    var queryPublic = `
      SELECT * FROM EventUpdate WHERE is_public = 1`;

    connection.query(queryPublic, function(err, publicRows, fields) {
      if (err) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      // Step 2: Get the user id
      const userId = req.session.user_id;

      // Step 3: Look up the user id in the Volunteer table to find branches the user belongs to
      var queryBranches = `
        SELECT
          m.branch_id,
          b.branch_name
        FROM
          Manager m
          JOIN Branch b ON m.branch_id = b.branch_id
        WHERE
          m.user_id = ?`;

      connection.query(queryBranches, [userId], function(err, branches, fields) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        const branchIds = branches.map(branch => branch.branch_id);

        // Step 4: Retrieve private event updates for branches the user belongs to
        // Ensure branchIds is not empty or null
        if (!branchIds || branchIds.length === 0) {
          // If branchIds is empty, there are no branches for the user, so send only public event updates
          res.json(publicRows);
          connection.release();
          return;
        }

        // Construct the SQL query with the correct placeholder syntax for the IN clause
        const placeholders = branchIds.map(() => '?').join(',');

        // Construct the query to fetch private event updates for branches the user belongs to
        var queryPrivate = `
          SELECT * FROM EventUpdate WHERE is_public = 0 AND branch_id IN (${placeholders})`;

        // Execute the query to fetch private event updates
        connection.query(queryPrivate, branchIds, function(err, privateRows, fields) {
          if (err) {
            console.error('Error fetching private event updates:', err);
            res.sendStatus(500);
            connection.release();
            return;
          }

          // Combine public and private event updates and send the results
          const allEventUpdates = [...publicRows, ...privateRows];
          // console.log(allEventUpdates);
          res.json(allEventUpdates);
          connection.release();
        });
      });
    });
  });
});

router.post('/postUpdate', (req, res, next) => {
  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { update_title, branch_id, content, is_public } = req.body;

    // Perform validation on the event data
    if (!update_title || !branch_id || !content || !is_public) {
      connection.release();
      return res.status(400).json({ error: 'Information is required' });
    }

    // Insert the new event into the database
    const query = 'INSERT INTO EventUpdate (update_title, branch_id, content, is_public) VALUES (?, ?, ?, ?)';
    const values = [update_title, branch_id, content, is_public];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error creating event:', err);
        connection.release();
        return res.status(500).json({ error: 'An error occurred while creating the event' });
      }

      const newUpdateId = result.insertId;
      connection.release();
      res.status(200).json({ id: newUpdateId });
    });
  });
});

router.delete('/deleteUpdate/:updateId', (req, res, next) => {
  const updateId = req.params.updateId;

  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if the event exists
    const checkQuery = 'SELECT * FROM EventUpdate WHERE update_id = ?';
    connection.query(checkQuery, [updateId], (err, results) => {
      if (err) {
        console.error('Error checking update:', err);
        connection.release();
        return res.status(500).json({ error: 'An error occurred while checking the update' });
      }

      if (results.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Update not found' });
      }

      // Delete the event
      const deleteQuery = 'DELETE FROM EventUpdate WHERE update_id = ?';
      connection.query(deleteQuery, [updateId], (err, result) => {
        if (err) {
          console.error('Error deleting update:', err);
          connection.release();
          return res.status(500).json({ error: 'An error occurred while deleting the update' });
        }

        connection.release();
        res.status(200).json({ message: 'Update deleted successfully' });
      });
    });
  });
});

module.exports = router;