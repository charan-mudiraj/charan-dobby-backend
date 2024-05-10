const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./schema");
const userRoute = require("./routes");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.status(200).send("Backend has Started");
});

app.listen(process.env.PORT, () => {
  console.log("Server running at Port: " + process.env.PORT);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("Failed to connect to DB");
  });
