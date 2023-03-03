const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes/index.js");
const connection = require("./config/connection");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(routes);

// mongoose.set("debug", true);
connection.once("mongodb connection ", (conn) => {
  console.log("connection status", conn);
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
