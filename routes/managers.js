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

module.exports = router;

