const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    fullName: String,
    email: String,
    phone: String,
    picture: String,
    password: String,

    accountNumber: {
      type: String,
      default: "",
    },
    accountName: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    country: String,
    gender: String,
    block: {
      type: String,
      default: "false",
    },
    active:{
      type: Boolean,
      default: false
    },
    balance: {
      type: Number,
      default: null,
    },
    earnings: {
      type: Number,
      default: null
    },
    loanAmount: {
      type: Number,
      default: null
    },
    code: {
      type: Number,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
