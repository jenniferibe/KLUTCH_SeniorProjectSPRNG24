//IMPORTS
const express = require("express");
const app = express();
const cors = require("cors");
// Connect to MongoDB
mysql.connect('mysql://localhost/klutch', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the user model
const userSchema = new mysql.Schema({
  email: String,
  password: String,
  name: String
});

const User = mysql.model('User', userSchema);

// Middleware
app.use(express.json());
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

//app.listen(3000, () => {
 // console.log('Server listening on port 3000');
//});

