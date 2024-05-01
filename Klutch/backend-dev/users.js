const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'klutch'
});

const User = connection.define('User', {
  username: {
    type: mysql.STRING,
    allowNull: false,
  },
  email: {
    type: mysql.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: mysql.STRING,
    allowNull: false,
  },
});

module.exports = User;