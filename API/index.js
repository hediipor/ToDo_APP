const express = require("express");
const connectDB = require("./database/database");
const cors = require("cors");
const app = express();
const listRoutes = require("./routes/list");
const cardRoutes = require("./routes/card");

app.use(cors());
app.use(express.json());
app.use("/list", listRoutes);
app.use("/card", cardRoutes);

const PORT = 3001;

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
