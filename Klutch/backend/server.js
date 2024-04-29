const express = require('express');
const app = express();
const config = require('./config/db.config');

app.use(express.json());
app.use('/api', require('./app'));

const PORT = process.env.PORT || 3000;

mongoose.connect(config.url, config.options)
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });

  