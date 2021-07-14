const mongoose = require("mongoose");
const { mongoURI } = require('../configs/secret');

const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected successfully');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDb;