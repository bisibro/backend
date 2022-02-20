const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const cors = require("cors")({ origin: "*" });
const { Client, resources } = require("coinbase-commerce-node");
const { Charge } = resources;
Client.init("555a6d1b-63ee-4ff7-8b80-b325819cf444").setRequestTimeout(3000);

let register = async (req, res) => {
  let { username, fullName, email, phone,  password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json("User Already Exists");

    const newUser = new User(req.body);
    await newUser.save().then(() => {
      res.status(200).json({ user: newUser });
    });
  } catch (error) {
    res.json({ message: error });
  }
};

let login = async (req, res) => {
  let { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (password == existingUser.password) {
        return res.status(200).json({ user: existingUser });
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

let bankInfo = async (req, res) => {
  

  let body = await req.body;

  

  await User.findOneAndUpdate({_id: req.params.id}, body, {new :true})
  .then(async (result) => {
        if (!result)
          return res.status(406).json({ message: "User does not exist" });
  
        await res.status(200).json({ user: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err });
      });
};

let profile = async (req, res) => {
  
  let body = await req.body;

  

  await User.findOneAndUpdate({_id: req.params.id}, body, {new :true})
  .then(async (result) => {
        if (!result)
          return res.status(406).json({ message: "User does not exist" });
  
        await res.status(200).json({ user: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err });
      });
};

let changePassword = async (req, res) => {
  const idd = req.params;

  let id;
  Object.keys(idd).map(function (key) {
    id = idd[key];
  });

  let { oldPassword, newPassword } = req.body;

  let user = await User.findOne({ _id: id });

  try {
    if (!user) {
      return res.status(400).json("Invalid User");
    }

    if (user.password !== oldPassword) {
      return res.status(400).json("Incorrect Password");
    }

    user.password = newPassword;

    user.save().then(() => res.status(200).json({ user: user }));
  } catch (error) {
    res.status(500).json(error);
  }
};

let findall = (req, res) => {
  User.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    }
    res.json(docs);
  });
};

let createCharge = (req, res) => {
  let { Amount } = req.body;
  cors(req, res, async () => {
    const chargeData = {
      name: "Capital Equity",
      description: "Deposit",
      local_price: {
        amount: Amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
    };

    const charge = await Charge.create(chargeData);

    res.json(charge);
  });
};

module.exports = {
  register,
  login,
  bankInfo,
  findall,
  changePassword,
  profile,
  createCharge,
};
