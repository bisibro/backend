const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const cors = require("cors")({ origin: "*" });
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const nodemailerCramMd5 = require("nodemailer-cram-md5");
const { Client, resources } = require("coinbase-commerce-node");
const { Charge } = resources;
Client.init("555a6d1b-63ee-4ff7-8b80-b325819cf444").setRequestTimeout(3000);
const path = require("path");
var hbs = require("nodemailer-express-handlebars");

let register = async (req, res) => {
  let { username, fullName, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json("User Already Exists");

    const newUser = new User(req.body);
    await newUser.save().then(() => {
      let transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        ignoreTLS: false,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve("./views"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views"),
        extName: ".handlebars",
      };

      transporter.use("compile", hbs(handlebarOptions));

      var mailOptions = {
        from: '"Capital Allocators" noreply@capitalallocators.com',
        to: newUser.email,
        subject: "Activate Account",
        // text: `https://capital-equity.herokuapp.com/users/verify-account/${newUser._id}`,
        // html: `

        // <a href="https://capital-equity.herokuapp.com/users/verify-account/${newUser._id}"><button>Activate Account</button></a>`,
        template: "email",
        context: {
          id: newUser._id,
          username: newUser.username
        },
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        res.status(200).json({ user: newUser });
        console.log(info);
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
};

let login = async (req, res) => {
  let { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (password == existingUser.password) {
        if (existingUser.active == false) {
          console.log("Please Verify Your Account");

          res.status(200).json({ msg: "Please Verify Your Account" });
        } else {
          res.status(200).json({ user: existingUser });
        }
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

  if (!verifyUser)
    return res.status(400).json({ message: "Something went wrong" });

  await User.findOneAndUpdate({ _id: id }, { active: true }, { new: true })
    .then(async (result) => {
      if (!result)
        return res.status(406).json({ message: "User does not exist" });

      return res.status(301).redirect("https://capitalallocatorsinternational.com/login/");
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
  let { loanAmount } = req.body;

  let verifyUser = await User.find({ _id: id });

  if (!verifyUser)
    return res.status(400).json({ message: "Something went wrong" });

  await User.findOneAndUpdate(
    { _id: id },
    { loanAmount: loanAmount },
    { new: true }
  )
    .then(async (result) => {
      if (!result)
        return res.status(406).json({ message: "User does not exist" });

      let transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        ignoreTLS: false,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve("./views"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views"),
        extName: ".handlebars",
      };
 
      transporter.use("compile", hbs(handlebarOptions));


      var mailOptions = {
        from: '"Capital Allocators" noreply@capitalallocators.com',
        to: result.email,
        subject: "Loan Request",
        // text: `Dear ${result.username}, Your Loan Request has been Receieved`,
        template: "loan",
        context: {
          username: result.username
        },
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
};

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

let forgotPassword = async (req, res) => {
  let forgotToken = Math.floor(Math.random() * 999999);
  let { username } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (existingUser.active == false) {
        res.status(400).json({ msg: "Please Verify Your Account" });
      } else {
        existingUser.code = forgotToken;
        existingUser
          .save()
          .then(() => {
            // res.status(200).json({ user: existingUser });
            console.log(existingUser);
            let transporter = nodemailer.createTransport({
              pool: true,
              host: "smtp.gmail.com",
              port: 465,
              ignoreTLS: false,
              secure: true,
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
              },
            });

            const handlebarOptions = {
              viewEngine: {
                extName: ".handlebars",
                partialsDir: path.resolve("./views"),
                defaultLayout: false,
              },
              viewPath: path.resolve("./views"),
              extName: ".handlebars",
            };
      
            transporter.use("compile", hbs(handlebarOptions));
            
            var mailOptions = {
              from: '"Capital Allocators" noreply@capitalallocators.com',
              to: existingUser.email,
              subject: "Forgot Password",
              // text: `Dear ${existingUser.username}, copy the token below and paste it in the password recovery page
              
              // ${forgotToken}
              // `,

              template: "password",
             context: {
                  username: existingUser.username,
                  token: forgotToken
                },
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) throw err;
              res.status(200).json({ msg: true });
              console.log(info);
            });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
        // res.status(200).json({ user: existingUser });
      }
    } else {
      res.status(400).json({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

let changePassword = async (req, res) => {
  let { code, username, newPassword } = req.body;

  let legitCode = await User.findOne({ code });

  if (!legitCode) {
    res.status(400).json({ msg: "Invalid OTP" });
  } else {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "User Does Not Exist" });
    }
    try {
      user.password = newPassword;
      user.code = null;

      user.save().then(() => res.status(200).json({ user: user }));
    } catch (error) {
      res.status(500).json(error);
    }
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
      name: "Capital Allocators",
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
  User.find({ balance: { $ne: null } }, (err, docs) => {
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
};

let sendmail = (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bisibro1@gmail.com",
      pass: "Capital1+",
    },
  });

  var mailOptions = {
    from: '"Capital Allocators" noreply@capitalallocators.com',
    to: "eaolaoti@gmail.com",
    subject: "It works",
    text: "LETs GOOO",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;

    console.log(info);
  });
};

const testEmail = (req, res) => {
  res.render('email')
}
module.exports = {
  register,
  login,
  bankInfo,
  getUser,
  findall,
  forgotPassword,
  changePassword,
  profile,
  createCharge,
  increaseEarnings,
  verifyAccount,
  loan,
  ublocked,
  sendmail,
  deleteAll,
  testEmail
};
