const router = require("express").Router();
const {
  AdminLogin,
  getAllUsers,
  getAUser,
  alterBalance,
} = require("../controllers/admin");

router.get("/login", (req, res) => {
  res.render("login");
});
// router.get("/all-users", getAUser);
router.get("/home", (req, res) => {
  res.render("home");
});

router.post("/login", AdminLogin);

router.get("/all-users", getAllUsers);
router.get("/get-user/:id", getAUser);

router.post("/update-user/:id", alterBalance);
module.exports = router;
