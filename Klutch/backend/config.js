module.exports = {
    url: process.env.DB_URL || 'mongodb://localhost:27017/klutch',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  };