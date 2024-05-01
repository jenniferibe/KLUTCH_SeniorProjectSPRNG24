const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const pool = require('./db');


// Create a connection pool for the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Middleware to handle JSON request bodies
router.use(express.json());

// Login route
router.post('/api/auth/login', (req, res) => {
  // Get the email and password from the request body
  const email = req.body.email;
  const password = req.body.password;

  // Query the MySQL database to find the user with the given email and password
  pool.query(
    'SELECT * FROM users WHERE email =? AND password =?',
    [email, password],
    (error, results, fields) => {
      if (error) {
        // If there's an error, return a 500 Internal Server Error response
        return res.status(500).send({ error: 'An error occurred while logging in' });
      }

      if (results.length === 0) {
        // If the user is not found, return a 401 Unauthorized response
        return res.status(401).send({ error: 'Invalid credentials' });
      }

      // If the user is found, return a 200 OK response with the user data
      const user = results[0];
      return res.send({ user });
    }
  );
});

module.exports = router;