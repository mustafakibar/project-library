const mongoose = require('mongoose');
const { Schema } = mongoose;

var db;
const connect = async () => {
  try {
    db = await mongoose.connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connected');
  } catch (err) {
    console.log('Failed to connect to DB', err);
  }

  return db;
};

const Book = mongoose.model(
  'book',
  new Schema({
    title: { type: String, required: true },
    comments: [String],
  })
);

module.exports = { connect, Book, db };
