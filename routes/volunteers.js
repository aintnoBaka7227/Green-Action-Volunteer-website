var express = require('express');
var router = express.Router();
var { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// router.get('/event-updates', function (req, res, next) {
//   req.pool.getConnection(function (err, connection) {
//     if (err) {
//       res.sendStatus(500);
//       return;
//     }

//     // Step 1: Retrieve all public event updates
//     var queryPublic = `
//       SELECT
//         eu.update_id,
//         eu.update_title,
//         eu.content,
//         eu.is_public,
//         eu.branch_id,
//         b.branch_name,
//         eu.event_id,
//         e.event_type AS eventName,
//         e.date AS eventDate
//       FROM
//         EventUpdate eu
//         JOIN Event e ON eu.event_id = e.event_id
//         JOIN Branch b ON eu.branch_id = b.branch_id
//       WHERE
//         eu.is_public = 1`;

//     connection.query(queryPublic, function (err, publicRows, fields) {
//       if (err) {
//         connection.release();
//         res.sendStatus(500);
//         return;
//       }

//       // Step 2: Get the user id
//       const userId = req.session.user_id;

//       // Step 3: Look up the user id in the Volunteer table to find branches the user belongs to
//       var queryBranches = `
//         SELECT
//           v.branch_id,
//           b.branch_name
//         FROM
//           Volunteer v
//           JOIN Branch b ON v.branch_id = b.branch_id
//         WHERE
//           v.user_id = ?`;

//       connection.query(queryBranches, [userId], function (err, branches, fields) {
//         if (err) {
//           connection.release();
//           res.sendStatus(500);
//           return;
//         }

//         const branchIds = branches.map(branch => branch.branch_id);

//         // Step 4: Retrieve private event updates for branches the user belongs to
//         // Ensure branchIds is not empty or null
//         if (!branchIds || branchIds.length === 0) {
//           // If branchIds is empty, there are no branches for the user, so send only public event updates
//           res.json(publicRows);
//           connection.release();
//           return;
//         }

//         // Construct the SQL query with the correct placeholder syntax for the IN clause
//         const placeholders = branchIds.map(() => '?').join(',');

//         // Construct the query to fetch private event updates for branches the user belongs to
//         var queryPrivate = `
//           SELECT
//             eu.update_id,
//             eu.update_title,
//             eu.content,
//             eu.is_public,
//             eu.branch_id,
//             b.branch_name,
//             eu.event_id,
//             e.event_type AS eventName,
//             e.date AS eventDate
//           FROM
//             EventUpdate eu
//             JOIN Event e ON eu.event_id = e.event_id
//             JOIN Branch b ON eu.branch_id = b.branch_id
//           WHERE
//             eu.is_public = 0
//             AND eu.branch_id IN (${placeholders})`;

//         // Execute the query to fetch private event updates
//         connection.query(queryPrivate, branchIds, function (err, privateRows, fields) {
//           if (err) {
//             console.error('Error fetching private event updates:', err);
//             res.sendStatus(500);
//             connection.release();
//             return;
//           }

//           // Combine public and private event updates and send the results
//           const allEventUpdates = [...publicRows, ...privateRows];
//           // console.log(allEventUpdates);
//           res.json(allEventUpdates);
//           connection.release();
//         });
//       });
//     });
//   });
// });

router.get('/event-updates', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Step 1: Retrieve all public event updates
    var queryPublic = `
      SELECT * FROM EventUpdate WHERE is_public = 1`;

    connection.query(queryPublic, function (err, publicRows, fields) {
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
          v.branch_id,
          b.branch_name
        FROM
          Volunteer v
          JOIN Branch b ON v.branch_id = b.branch_id
        WHERE
          v.user_id = ?`;

      connection.query(queryBranches, [userId], function (err, branches, fields) {
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
        connection.query(queryPrivate, branchIds, function (err, privateRows, fields) {
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

router.get('/events', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Step 1: Retrieve all public events
    var queryPublicEvents = `
      SELECT
        e.event_id,
        e.event_type,
        e.time,
        e.date,
        e.content,
        e.is_public,
        e.street_address,
        e.city,
        e.state,
        e.postcode,
        e.branch_id
      FROM
        Event e
      WHERE
        e.is_public = 1`;

    connection.query(queryPublicEvents, function (err, publicEvents, fields) {
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
          v.branch_id
        FROM
          Volunteer v
        WHERE
          v.user_id = ?`;

      connection.query(queryBranches, [userId], function (err, branches, fields) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        const branchIds = branches.map(branch => branch.branch_id);

        // Step 4: Retrieve private events for branches the user belongs to
        // Ensure branchIds is not empty or null
        if (!branchIds || branchIds.length === 0) {
          // If branchIds is empty, there are no branches for the user, so send only public events
          res.json(publicEvents);
          connection.release();
          return;
        }

        // Construct the SQL query with the correct placeholder syntax for the IN clause
        const placeholders = branchIds.map(() => '?').join(',');

        // Construct the query to fetch private events for branches the user belongs to
        var queryPrivateEvents = `
          SELECT
            e.event_id,
            e.event_type,
            e.time,
            e.date,
            e.content,
            e.is_public,
            e.street_address,
            e.city,
            e.state,
            e.postcode,
            e.branch_id
          FROM
            Event e
          WHERE
            e.is_public = 0
            AND e.branch_id IN (${placeholders})`;

        // Execute the query to fetch private events
        connection.query(queryPrivateEvents, branchIds, function (err, privateEvents, fields) {
          if (err) {
            console.error('Error fetching private events:', err);
            res.sendStatus(500);
            connection.release();
            return;
          }

          // Combine public and private events and send the results
          const allEvents = [...publicEvents, ...privateEvents];
          // console.log(allEvents);
          res.json(allEvents);
          connection.release();
        });
      });
    });
  });
});

// check events rsvpd
router.get('/rsvp-events', (req, res) => {
  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const volunteerQuery = `
      SELECT volunteer_id
      FROM Volunteer
      WHERE user_id = ?
    `;

    connection.query(volunteerQuery, [userId], (volunteerError, volunteerResults) => {
      if (volunteerError) {
        console.error('Error fetching volunteer IDs:', volunteerError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (volunteerResults.length === 0) {
        return res.status(404).json({ error: 'No volunteer IDs found for the user' });
      }

      const volunteerIds = volunteerResults.map(row => row.volunteer_id);

      const query = `
        SELECT Event.event_id, Event.event_type, Event.date, Event.content, EventRSVP.volunteer_id
        FROM Event
        INNER JOIN EventRSVP ON Event.event_id = EventRSVP.event_id
        WHERE EventRSVP.volunteer_id IN (?)
      `;

      connection.query(query, [volunteerIds], (error, results) => {
        if (error) {
          console.error('Error fetching RSVP events:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        console.log(results);
        res.json(results);
      });
    });
  });
});

router.get('/available-branches', (req, res) => {
  const userID = req.session.user_id;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Execute SQL query to get branch IDs for the user
    connection.query('SELECT branch_id FROM Volunteer WHERE user_id = ?', [userID], function (err, rows) {
      if (err) {
        connection.release(); // Release the connection in case of an error
        res.sendStatus(500); // Internal Server Error
        return;
      }

      const branchIds = rows.map(row => row.branch_id);

      // Execute SQL query to get all branches
      connection.query('SELECT * FROM Branch', function (err, branches) {
        if (err) {
          connection.release(); // Release the connection in case of an error
          res.sendStatus(500); // Internal Server Error
          return;
        }

        // Add is_user_in key-value pair to each row
        branches.forEach(row => {
          row.is_user_in = branchIds.includes(row.branch_id);
        });

        let count = 0;
        const totalBranches = branches.length;

        branches.forEach(branch => {
          // Execute SQL query to get manager details
          connection.query('SELECT manager_id, user_id FROM Manager WHERE branch_id = ?', [branch.branch_id], (err, managers) => {
            if (err) {
              console.error('Error fetching manager_id:', err);
            } else {
              branch.manager_id = managers.length > 0 ? managers[0].user_id : null;
              branch.user_id = userID;

              // Fetch manager's name from User table
              if (branch.manager_id) {
                connection.query('SELECT first_name, last_name FROM User WHERE user_id = ?', [branch.manager_id], (err, users) => {
                  if (err) {
                    console.error('Error fetching manager details:', err);
                  } else {
                    if (users.length > 0) {
                      branch.manager_name = `${users[0].first_name} ${users[0].last_name}`;
                    } else {
                      branch.manager_name = null;
                    }
                  }

                  // Fetch volunteer count for the branch
                  connection.query('SELECT COUNT(*) AS volunteerCount FROM Volunteer WHERE branch_id = ?', [branch.branch_id], (err, volunteerCountResult) => {
                    if (err) {
                      console.error('Error fetching volunteer count:', err);
                    } else {
                      branch.volunteer_count = volunteerCountResult[0].volunteerCount;
                    }

                    count++;
                    if (count === totalBranches) {
                      connection.release(); // Release the connection
                      // Send branches in the response
                      res.json({ branches });
                    }
                  });
                });
              } else {
                // If no manager, still fetch volunteer count
                connection.query('SELECT COUNT(*) AS volunteerCount FROM Volunteer WHERE branch_id = ?', [branch.branch_id], (err, volunteerCountResult) => {
                  if (err) {
                    console.error('Error fetching volunteer count:', err);
                  } else {
                    branch.volunteer_count = volunteerCountResult[0].volunteerCount;
                  }

                  count++;
                  if (count === totalBranches) {
                    connection.release(); // Release the connection
                    // Send branches in the response
                    res.json({ branches });
                  }
                });
              }
            }
          });
        });
      });
    });
  });
});

router.get('/available-events', (req, res) => {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Query to get all volunteer IDs associated with the user ID
    const volunteerQuery = `
        SELECT volunteer_id
        FROM Volunteer
        WHERE user_id = ?
    `;

    connection.query(volunteerQuery, [userId], (volunteerError, volunteerResults) => {
      if (volunteerError) {
        console.error('Error fetching volunteer IDs:', volunteerError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Check if volunteer IDs are found
      if (volunteerResults.length === 0) {
        return res.status(404).json({ error: 'No volunteer IDs found for the user' });
      }

      const volunteerIds = volunteerResults.map(row => row.volunteer_id);

      // Query to get all branch IDs associated with the volunteer IDs
      const branchQuery = `
            SELECT DISTINCT branch_id
            FROM Volunteer
            WHERE volunteer_id IN (?)
        `;

      connection.query(branchQuery, [volunteerIds], (branchError, branchResults) => {
        if (branchError) {
          console.error('Error fetching branch IDs:', branchError);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if branch IDs are found
        if (branchResults.length === 0) {
          return res.status(404).json({ error: 'No branch IDs found for the volunteers' });
        }

        const branchIds = branchResults.map(row => row.branch_id);

        // Query to get all events for the branch IDs
        const eventsQuery = `
                SELECT event_id, event_type, date, content
                FROM Event
                WHERE branch_id IN (?)
            `;

        connection.query(eventsQuery, [branchIds], (eventsError, eventsResults) => {
          if (eventsError) {
            console.error('Error fetching events:', eventsError);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Check if events are found
          if (eventsResults.length === 0) {
            return res.status(404).json({ error: 'No events found for the branches' });
          }

          const event_ids = eventsResults.map(row => row.event_id);

          // Query to get all RSVP events for the volunteer IDs
          const rsvpQuery = `
                    SELECT event_id
                    FROM EventRSVP
                    WHERE volunteer_id IN (?)
                `;

          connection.query(rsvpQuery, [volunteerIds], (rsvpError, rsvpResults) => {
            if (rsvpError) {
              console.error('Error fetching RSVP events:', rsvpError);
              return res.status(500).json({ error: 'Internal server error' });
            }

            const rsvpevent_ids = rsvpResults.map(row => row.event_id);

            // Filter out the events that the volunteer has RSVPed for
            const availableEvents = eventsResults.filter(event => !rsvpevent_ids.includes(event.event_id));
            console.log(availableEvents);
            res.json(availableEvents);
          });
        });
      });
    });
  });
});

// remove rsvp event
router.post('/resign', (req, res) => {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const { volunteerId, eventId } = req.body;
    const event_id = eventId;

    if (!volunteerId || !event_id) {
      return res.status(400).json({ error: 'Volunteer ID and Event ID are required' });
    }

    const resignQuery = `
        DELETE FROM EventRSVP
        WHERE volunteer_id = ? AND event_id = ?
    `;

    connection.query(resignQuery, [volunteerId, event_id], (resignError, results) => {
      connection.release();

      if (resignError) {
        console.error('Error resigning from event:', resignError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ success: true });
    });
  });
});

// add rsvp
router.post('/add-rsvp', (req, res) => {
  console.log('Session:', req.session); // Log session to check user_id
  console.log('Request body:', req.body); // Log request body to check event_id

  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const userId = req.session.user_id;
    const event_id = req.body.eventId.event_id;
    console.log(event_id);
    if (!userId || !event_id) {
      console.log(userId);
      console.log(event_id);

      console.error('User ID or Event ID is missing');
      connection.release();
      return res.status(400).json({ error: 'User ID and Event ID are required' });
    }

    const volunteerQuery = `
      SELECT v.volunteer_id
      FROM Volunteer v
      JOIN Event e ON v.branch_id = e.branch_id
      WHERE v.user_id = ? AND e.event_id = ?
    `;

    connection.query(volunteerQuery, [userId, event_id], (volunteerError, volunteerResults) => {
      if (volunteerError) {
        console.error('Error fetching volunteer ID:', volunteerError);
        connection.release();
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (volunteerResults.length === 0) {
        console.error('No matching volunteer found');
        connection.release();
        return res.status(404).json({ error: 'No matching volunteer found for the user and event' });
      }

      const volunteerId = volunteerResults[0].volunteer_id;

      const insertQuery = `
        INSERT INTO EventRSVP (event_id, volunteer_id)
        VALUES (?, ?)
      `;

      connection.query(insertQuery, [event_id, volunteerId], (insertError) => {
        connection.release();
        if (insertError) {
          console.error('Error inserting RSVP:', insertError);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ success: true });
      });
    });
  });
});


router.post('/modifyBranch', (req, res) => {
  const { branchId, userId } = req.body;

  console.log (branchId, " ", userId);

  req.pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    // Check if the volunteer already exists
    const checkVolunteerQuery = 'SELECT volunteer_id FROM Volunteer WHERE branch_id = ? AND user_id = ?';
    connection.query(checkVolunteerQuery, [branchId, userId], (err, results) => {
      if (err) {
        connection.release();
        res.status(500).send(err);
        return;
      }

      if (results.length > 0) {
        // Volunteer exists, delete the row (leave the branch)
        const deleteVolunteerQuery = 'DELETE FROM Volunteer WHERE volunteer_id = ?';
        connection.query(deleteVolunteerQuery, [results[0].volunteer_id], (err) => {
          connection.release();
          if (err) {
            res.status(500).send(err);
          } else {
            res.json({ message: 'Left the branch successfully' });
          }
        });
      } else {
        // Volunteer does not exist, insert the row (join the branch)
        const insertVolunteerQuery = 'INSERT INTO Volunteer (branch_id, user_id) VALUES (?, ?)';
        connection.query(insertVolunteerQuery, [branchId, userId], (err) => {
          connection.release();
          if (err) {
            res.status(500).send(err);
          } else {
            res.json({ message: 'Joined the branch successfully' });
          }
        });
      }
    });
  });
});

// Route to fetch branches and their subscription statuses for the user
router.get('/notification-branches', function (req, res) {
  const userId = req.session.user_id;

  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.status(500).send('Internal Server Error');
    }

    const query = `
      SELECT b.branch_id, b.branch_name, v.volunteer_id, ns.subscription_id,
             ns.subscribed_event, ns.subscribed_update
      FROM Branch b
      LEFT JOIN Volunteer v ON v.branch_id = b.branch_id AND v.user_id = ?
      LEFT JOIN NotificationSubscription ns ON ns.subscription_id = v.subscription_id
      WHERE v.user_id = ?;
    `;

    connection.query(query, [userId, userId], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).send('Internal Server Error');
      }
      console.log(res);
      res.json({ branches: results });
    });
  });
});

router.post('/update-subscription', function (req, res) {
  const userId = req.session.user_id;
  const { branchId, subscribedEvent, subscribedUpdate } = req.body;

  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const volunteerQuery = `SELECT volunteer_id, subscription_id FROM Volunteer WHERE user_id = ? AND branch_id = ?`;

    connection.query(volunteerQuery, [userId, branchId], (error, results) => {
      if (error) {
        connection.release();
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const volunteer = results[0];
      if (!volunteer) {
        connection.release();
        return res.status(404).json({ error: 'Volunteer record not found' });
      }

      let subscriptionId = volunteer.subscription_id;
      if (!subscriptionId) {
        // Create a new subscription if it doesn't exist
        const insertSubscriptionQuery = `INSERT INTO NotificationSubscription (subscribed_event, subscribed_update) VALUES (?, ?)`;

        connection.query(insertSubscriptionQuery, [subscribedEvent, subscribedUpdate], (error, result) => {
          if (error) {
            connection.release();
            console.error('Error inserting subscription:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          subscriptionId = result.insertId;

          // Update the volunteer record with the new subscription_id
          const updateVolunteerQuery = `UPDATE Volunteer SET subscription_id = ? WHERE volunteer_id = ?`;

          connection.query(updateVolunteerQuery, [subscriptionId, volunteer.volunteer_id], (error) => {
            connection.release();

            if (error) {
              console.error('Error updating volunteer:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Subscription updated successfully' });
          });
        });
      } else {
        // Update the existing subscription
        const updateSubscriptionQuery = `UPDATE NotificationSubscription SET subscribed_event = ?, subscribed_update = ? WHERE subscription_id = ?`;

        connection.query(updateSubscriptionQuery, [subscribedEvent, subscribedUpdate, subscriptionId], (error) => {
          connection.release();

          if (error) {
            console.error('Error updating subscription:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(200).json({ message: 'Subscription updated successfully' });
        });
      }
    });
  });
});




module.exports = router;
