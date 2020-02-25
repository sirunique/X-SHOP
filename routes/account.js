const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator');

const passport = require('passport');
require('../config/passport')(passport);

const Account = require('../models/account');
const accountController = require('../controllers/account');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth.accountAuth, accountController.getProfile);
router.get('/signin', accountController.getSignin);
router.get('/signup', accountController.getSignup);
router.get('/signout', accountController.getLogout);


router.post('/signup',[
    check('email').isEmail().withMessage('Enter valid email').normalizeEmail()
    .custom((value, {req})=>{
        return Account.findOne({email: value})
        .then(acct=>{
            if(acct){
                return Promise.reject('Email Exist');
            }
        });
    }).normalizeEmail(),
    body('password', 'password min 5').isLength({min:5}).trim()
], accountController.postSignup);

router.post('/signin',  [
    body('email').isEmail().withMessage('Enter Valid Email').normalizeEmail(),
    body('password').trim()
],  passport.authenticate('local', {
        // successRedirect: '/account',
        failureRedirect: '/account/signin',
        failureFlash: true
    }), accountController.postSignin
);


module.exports = router;