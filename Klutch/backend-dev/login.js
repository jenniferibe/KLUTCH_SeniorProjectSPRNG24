const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const pool = require('./db');


const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = loginForm.elements['email'].value;
  const password = loginForm.elements['password'].value;

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
.then(response => response.json())
.then(data => {
    if (data.token) {
      // Save the token in local storage or a cookie
      localStorage.setItem('token', data.token);
      // Redirect the user to the dashboard
      window.location.href = '/dashboard.html';
    } else {
      // Display an error message
      alert('Invalid credentials');
    }
  })
.catch(error => {
    // Display an error message
    alert('Error: ' + error);
  });
});
              

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
