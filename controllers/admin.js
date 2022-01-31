const User = require("../Models/user");

const AdminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username !== "admin") {
      return res
        .status(400)
        .json({ message: "Incorrect Username or Password" });
    } else {
      if (password !== "Admin1234+") {
        return res
          .status(400)
          .json({ message: "Incorrect Username or Password" });
      } else {
        res.status(200).redirect("home");
      }
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

let getAllUsers = (_, res) => {
  try {
    User.find({}, (err, docs) => {
      if (err) return res.json(err);

      // res.send(docs);
      res.render("allusers", {user: docs})
      // console.log(docs)
    }).limit(20).sort({createdAt: -1});
  } catch (error) {
    res.status(500).json(error);
  } 
};

let getAUser = async (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (!err) {
      // res.json({ user: doc });

        res.render("perUser", {user: doc});
    }
  });
};

let blockUser = async (req, res) => {
  // const idd = req.params;

  // let id;
  // Object.keys(idd).map(function (key) {
  //   id = idd[key];
  // });

  let body = await req.body;

  await User.findByIdAndUpdate(req.params.id, body, {
    useFindAndModify: false,
  })
    .then((result) => {
      if (!result)
        return res.status(406).json({ message: "User does not exist" });

      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

let alterBalance = async (req, res) => {
  

  let body = await req.body;

  await User.findByIdAndUpdate(req.params.id, body, {
    useFindAndModify: false,
  })
    .then((result) => {
      if (!result)
        return res.status(406).json({ message: "User does not exist" });

      res.redirect(`/admin/get-user/${result._id}`)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

module.exports = {
  AdminLogin,
  getAllUsers,
  getAUser,
  blockUser,
  alterBalance
};
