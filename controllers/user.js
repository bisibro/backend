const User = require("../Models/user");
const bcrypt = require("bcryptjs");

let register = async (req, res) => {
  let { username, fullName, email, phone, picture, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) throw "User Already Exists";

    const newUser = new User(req.body);
    await newUser.save().then(() => {
      res.send(newUser);
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
        res.status(200).json(existingUser);
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

let bankInfo = async (req, res) => {
  const idd = req.params;

  let id;
  Object.keys(idd).map(function (key) {
    id = idd[key];
  });

  let body = await req.body;

  await User.findByIdAndUpdate(id, body, {
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


let profile = async (req, res) => {
  const idd = req.params;

  let id;
  Object.keys(idd).map(function (key) {
    id = idd[key];
  });

  let body = await req.body;

  await User.findByIdAndUpdate(id, body, {
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
}



let changePassword = async (req, res) => {
  const idd = req.params;


  let id;
  Object.keys(idd).map(function (key) {
    id = idd[key];
  });

  let {oldPassword, newPassword} = req.body


  let user = await User.findOne({_id: id})

  try {
    if(!user) {
     return res.status(400).json('Invalid User')

    }

    if(user.password !== oldPassword) {
     return res.status(400).json('Incorrect Password')
    }

    user.password = newPassword

    user.save().then(() => res.status(200).json(user))
  } catch (error) {
    res.status(500).json(error)
  }
  
}



let findall = (req,res) => {
  User.find({}, (err, docs)=> {
    if(err) {
      console.log(err)
    }
    res.json(docs)
  })
}

module.exports = { register, login , bankInfo, findall,  changePassword,profile};
