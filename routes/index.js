var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/guests/index.html'));
});

router.get('/getPublicEvents', function(req, res, next) {
  const branch = req.query.branch;
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = 'SELECT * FROM Event WHERE is_public = 1 AND branch_id = (SELECT branch_id FROM Branch WHERE state = ?)';
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

router.get('/getPublicUpdates', function(req, res, next) {
  const branch = req.query.branch;
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = 'SELECT * FROM EventUpdate WHERE is_public = 1 AND branch_id = (SELECT branch_id FROM Branch WHERE state = ?)';
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

module.exports = router;
