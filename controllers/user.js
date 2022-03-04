const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const cors = require("cors")({ origin: "*" });
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { Client, resources } = require("coinbase-commerce-node");
const { Charge } = resources;
Client.init("555a6d1b-63ee-4ff7-8b80-b325819cf444").setRequestTimeout(3000);

let register = async (req, res) => {
  let { username, fullName, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json("User Already Exists");

    const newUser = new User(req.body);
    await newUser.save().then(() => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
          secure: false,
        auth: {
          user: "bisibro1@gmail.com",
          pass: "Capital1+",
        },
      });

      var mailOptions = {
        from: '"Capital Equity Funds" noreply@capitalequityfunds.com',
        to: newUser.email,
        subject: "Activate Account",
        text: `http://localhost:5000/users/verify-account/${newUser._id}`,
        html: `<a href="http://localhost:5000/users/verify-account/${newUser._id}"><button>Activate Account</button></a>`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        res.status(200).json({ user: newUser });
        console.log(info);
      });
    });
  } catch (error) {
    console.log(error)
    res.json({ message: error });
  }
};

let login = async (req, res) => {
  let { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (password == existingUser.password) {
        if (existingUser.active === false) {
          res.status(400).json({ message: "Please Verify Your Account" });
        }

        return res.status(200).json({ user: existingUser });
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

let verifyAccount = async (req, res) => {
  const id = req.params.id;

  let verifyUser = await User.find({ _id: id });

  if(!verifyUser) return res.status(400).json({ message: "Something went wrong" });

  await User.findOneAndUpdate({ _id: id }, {active: true}, { new: true })
  .then(async (result) => {
    if (!result) return res.status(406).json({ message: "User does not exist" });

    return res.status(301).redirect("http://localhost:3000/login");
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: err });
  });
  
};

let bankInfo = async (req, res) => {
  let body = await req.body;

  await User.findOneAndUpdate({ _id: req.params.id }, body, { new: true })
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

let loan = async (req, res) => {
  const id = req.params.id;
  let { loanAmount} = req.body

  let verifyUser = await User.find({ _id: id });

  if(!verifyUser) return res.status(400).json({ message: "Something went wrong" });

  await User.findOneAndUpdate({ _id: id }, {loanAmount: loanAmount}, { new: true })
  .then(async (result) => {
    if (!result) return res.status(406).json({ message: "User does not exist" });
   
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "bisibro1@gmail.com",
        pass: "Capital1+",
      },
    });

    var mailOptions = {
      from: '"Capital Equity Funds" noreply@capitalequityfunds.com',
      to: result.email,
      subject: "Loan Request",
      text: `Dear ${result.username}, Your Loan Request has been Receieved`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      res.status(200).json({ msg: true });
      console.log(info);
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: err });
  });
  

}

let profile = async (req, res) => {
  let body = await req.body;

  await User.findOneAndUpdate({ _id: req.params.id }, body, { new: true })
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

let getUser = (req, res) => {
  let id = req.params.id;
  User.find({ _id: id }, (err, user) => {
    if (err) {
      console.log(err);
    }
    res.json(user);
  });
};

let increaseEarnings = async (req, res) => {
  let earn = (Math.floor(Math.random() * 9) + 5).toString();
  console.log(earn);
  return await User.updateMany(
    { block: !"true" },
    { $set: { earnings: earn } },
    { multi: true }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

let ublocked = (req, res) => {
  User.find({ "balance": {$ne: null} }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  });
};

let deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send("All Deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while Deleting.",
      });
    });
}

let sendmail = (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bisibro1@gmail.com",
      pass: "Capital1+",
    },
  });

  var mailOptions = {
    from: '"Capital Equity Funds" noreply@capitalequityfunds.com',
    to: "eaolaoti@gmail.com",
    subject: "It works",
    text: "LETs GOOO",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;

    console.log(info);
  });
};

module.exports = {
  register,
  login,
  bankInfo,
  getUser,
  findall,
  changePassword,
  profile,
  createCharge,
  increaseEarnings,
  verifyAccount,
  loan,
  ublocked,
  sendmail,
  deleteAll
};
