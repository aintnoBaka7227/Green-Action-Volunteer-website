const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const managersRouter = require('./routes/managers');
const volunteersRouter = require('./routes/volunteers');
const adminsRouter = require('./routes/admins');


const dbConnectionPool = mysql.createPool({
    host: '127.0.0.1',
    database: 'greenAction',
});

const app = express();

// Middleware to add database connection pool to request object
app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize express-session middleware
app.use(session({
    secret: '6sbU3zS0a3v0FpWZVz6LlGupjy13kU76', // Replace 'your_secret_key' with your own secret key
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

function authorize(role) {
    return function (req, res, next) {
        if (req.session.role && req.session.role === role) {
            // Redirect to forbidden.html if role does not match
            next();
        }
        else {
            res.status(403).json({ message: 'Access required' });
        }
    };
}

app.use('/admins', authorize('admin'), adminsRouter); // Protected routes for admins
app.use('/managers', authorize('manager'), managersRouter); // Protected routes for managers
app.use('/volunteers', authorize('volunteer'), volunteersRouter); // Protected routes for volunteers

module.exports = app;
