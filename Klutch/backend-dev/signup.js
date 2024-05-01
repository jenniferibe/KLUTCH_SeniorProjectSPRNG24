const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Connect to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'klutch'
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to the database');
});

// Signup route
router.post('/', (req, res) => {
  const { name, username, email, password } = req.body;

  // Validate inputs
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
 
  // Check if user already exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) throw error;

      // Create new user
      const sql = 'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)';
      const values = [name, username, email, hash];
      connection.query(sql, values, (error, results) => {
        if (error) throw error;
        res.status(201).json({ message: 'User created' });
      });
    });
  });
});

module.exports = router;