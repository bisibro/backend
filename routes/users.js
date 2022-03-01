var express = require('express');
var router = express.Router();
const {register, login, bankInfo, findall, profile, changePassword, createCharge, getUser, increaseEarnings, ublocked } = require('../controllers/user')
/* GET users listing. */
router.post('/register', register)
router.post('/login', login)
router.post('/bank-info/:id', bankInfo)
router.post('/profile/:id', profile)
router.post('/change-password/:id', changePassword)
router.post('/create-charge', createCharge)
router.post('/earn', increaseEarnings)
router.get('/findall', findall)
router.get('/get-user/:id', getUser)
router.get('/get', ublocked)

module.exports = router;
