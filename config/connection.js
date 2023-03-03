const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    keepAlive: true,
  })
  .catch((err) => console.log(err));

// mongoose.set("debug", true);

module.exports = mongoose.connection;
