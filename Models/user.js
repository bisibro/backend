const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  phone: String,
  picture: String,
  password: String,
  accountNumber: String,
  accountName: String,
  bankName: String,
  country: String,
  block: {
    type: String, 
    default: "false"
  },
  balance: String
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
