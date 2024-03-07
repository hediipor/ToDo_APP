const express = require("express");
const connectDB = require("./database/database");
const cors = require("cors");
const app = express();
const listRoutes = require("./routes/list");
const cardRoutes = require("./routes/card");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/list", listRoutes);
app.use("/card", cardRoutes);

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
