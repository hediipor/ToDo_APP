const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URI = process.env.URI;

async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
}

module.exports = connectDB;
