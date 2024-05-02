const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create User model
const User = mongoose.model('User', userSchema);

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Create new user
  const newUser = new User({ name, username, email, password });
  await newUser.save();

  res.status(201).json({ message: 'User created successfully' });
});


app.post('/api/login', (req, res) => {
  // Authenticate the user
  const user = authenticateUser(req.body.username, req.body.password);

  if (user) {
    // Store the user's ID in the session
    req.session.userId = user.id;

    // Send a response to the client
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Send an error response to the client
    res.status(401).json({ message: 'Invalid username or password' });
  }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});