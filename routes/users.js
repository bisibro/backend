var express = require('express');
var router = express.Router();
const {register, login, bankInfo, findall, profile, changePassword, createCharge, getUser, increaseEarnings, ublocked, sendmail, verifyAccount, deleteAll, loan, forgotPassword } = require('../controllers/user')
/* GET users listing. */
router.post('/register', register)
router.post('/login', login)
router.post('/bank-info/:id', bankInfo)
router.post('/profile/:id', profile)
router.post('/forgot-password', forgotPassword)
router.post('/change-password', changePassword)
router.post('/create-charge', createCharge)
router.post('/earn', increaseEarnings)
router.get('/verify-account/:id', verifyAccount)
router.post('/loan/:id', loan)
router.post('/mail', sendmail)
router.get('/findall', findall)
router.get('/get-user/:id', getUser)
router.get('/get', ublocked)
router.get('/delete', deleteAll)


module.exports = router;
