const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/todo-app";

async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
}

module.exports = connectDB;
