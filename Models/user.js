const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  phone: String,
  picture: String,
  password: String,

  accountNumber: {
    type: String,
    default: ""
  },
  accountName: {
    type: String,
    default: ""
  },
  bankName: {
    type: String,
    default: ""
  },
  country: String,
  gender: String,
  block: {
    type: String, 
    default: "false"
  },
  balance: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
