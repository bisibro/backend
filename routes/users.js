var express = require('express');
var router = express.Router();
const {register, login, bankInfo, findall, profile, changePassword, createCharge } = require('../controllers/user')
/* GET users listing. */
router.post('/register', register)
router.post('/login', login)
router.post('/bank-info/:id', bankInfo)
router.post('/profile/:id', profile)
router.post('/change-password/:id', changePassword)
router.post('/create-charge', createCharge)
router.get('/findall', findall)
module.exports = router;
