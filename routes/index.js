var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/guests/index.html'));
});

router.get('/getBranches', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = 'SELECT * FROM Branch';
    connection.query(query, function(err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
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


/* GET user data for editing. */
router.get('/getUserData', function(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = 'SELECT first_name, last_name, email, phone_number, gender, DOB FROM User WHERE user_id = ?';
    connection.query(query, [req.session.user_id], function(err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    });
  });
});

/* POST user data for updating. */
router.post('/updateUserData', function(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).send('Unauthorized');
  }

  const { first_name, last_name, phone_number, gender, DOB, password } = req.body;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = 'UPDATE User SET first_name = ?, last_name = ?, phone_number = ?, gender = ?, DOB = ?, password = ? WHERE user_id = ?';
    connection.query(query, [first_name, last_name, phone_number, gender, DOB, password, req.session.user_id], function(err, results) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// const nodemailer = require('nodemailer');


// // Create a transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//       user: 'greenaction.organisation@gmail.com',
//       pass: 'pkkk tmch tife knre'
//   }
// });

// router.post('/upload-event', async (req, res) => {
//   const mailOptions = {
//     from: '"Khanh" <greenaction.organisation@gmail.com>', // Sender address
//     to: 'khanhahnahk@gmail.com', // List of receivers
//     subject: 'Hello', // Subject line
//     text: 'Hello world?', // Plain text body
//     html: '<b>Hello world?</b>' // HTML body
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message sent: %s', info.messageId);
//   });
// });

module.exports = router;
