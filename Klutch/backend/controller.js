const db = require('../models');
const User = db.user;

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};