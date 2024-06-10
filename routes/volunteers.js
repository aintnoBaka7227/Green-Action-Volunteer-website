var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('198821023017-acnrsha9l5f807koqqu2g0dp800tn0nf.apps.googleusercontent.com');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/event-updates', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Step 1: Retrieve all public event updates
    var queryPublic = `
      SELECT
        eu.update_id,
        eu.update_title,
        eu.content,
        eu.is_public,
        eu.branch_id,
        b.branch_name,
        eu.event_id,
        e.event_type AS eventName,
        e.date AS eventDate
      FROM
        EventUpdate eu
        JOIN Event e ON eu.event_id = e.event_id
        JOIN Branch b ON eu.branch_id = b.branch_id
      WHERE
        eu.is_public = 1`;

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
          v.branch_id,
          b.branch_name
        FROM
          Volunteer v
          JOIN Branch b ON v.branch_id = b.branch_id
        WHERE
          v.user_id = ?`;

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
          SELECT
            eu.update_id,
            eu.update_title,
            eu.content,
            eu.is_public,
            eu.branch_id,
            b.branch_name,
            eu.event_id,
            e.event_type AS eventName,
            e.date AS eventDate
          FROM
            EventUpdate eu
            JOIN Event e ON eu.event_id = e.event_id
            JOIN Branch b ON eu.branch_id = b.branch_id
          WHERE
            eu.is_public = 0
            AND eu.branch_id IN (${placeholders})`;

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
          console.log(allEventUpdates);
          res.json(allEventUpdates);
          connection.release();
        });
      });
    });
  });
});


module.exports = router;

