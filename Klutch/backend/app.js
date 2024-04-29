const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/klutch', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the user model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post('/Sign Up', (req, res) => {
  const { email, password, name } = req.body;
  const user = new User({ email, password, name });
  user.save((err, user) => {
    if (err) {
      res.status(400).send({ message: 'Error registering user' });
    } else {
      res.send({ message: 'User registered successfully' });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err ||!user) {
      res.status(401).send({ message: 'Invalid email or password' });
    } else {
      if (user.password === password) {
        res.send({ message: 'Logged in successfully' });
      } else {
        res.status(401).send({ message: 'Invalid email or password' });
      }
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

