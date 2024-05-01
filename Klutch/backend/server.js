const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// Connect to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'klutch',
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

// Import routes
const onboardingRoutes = require('./Routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);

// Import routes
const signupRoutes = require('./Routes/signup');
app.use('/api/signup', signupRoutes);

// Import routes
const signupRoutes = require('./login/signup');
app.use('/api/login', loginRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
