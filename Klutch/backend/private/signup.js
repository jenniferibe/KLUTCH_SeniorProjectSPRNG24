const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();

// Connect to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'KungFuKenny1997!',
  database: 'klutch'
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to the database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const onboardingRoutes = require('./routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);

const signupRoutes = require('./routes/signup');
app.use('/api/signup', signupRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Signup route
app.post('/api/signup', (req, res) => {
  const { name, username, email, password } = req.body;

  // Validate inputs
  if (!name ||!username ||!email ||!password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const sql = 'SELECT * FROM users WHERE email =?';
  connection.query(sql, [email], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) throw error;

      // Create new user
      const sql = 'INSERT INTO users (name, username, email, password) VALUES (?,?,?,?)';
      const values = [name, username, email, hash];
      connection.query(sql, values, (error, results) => {
        if (error) throw error;
        res.status(201).json({ message: 'User created' });
      });
    });
  });
});