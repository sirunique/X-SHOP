const passport = require('passport')
require('../config/passport')(passport)

const Product = require('../models/product')
const Order = require('../models/order')
const Cart = require('../models/cart')

const {check, validationResult} = require('express-validator')
const Account = require('../models/account')

exports.getProfile = (req, res, next)=>{
    Order.find({user: req.user})
    .then(orders=>{
        res.render('account/profile',{
            orders: orders
        })
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error)
    });
}

exports.getSignin = (req, res, next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null
    }
    res.render('account/signin',{
        errorMessage: message
    })
}

exports.getSignup = (req, res, next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null
    }
    res.render('account/signup',{
        errorMessage: message
    })
}

exports.postSignup = (req, res, next)=>{
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('account/signup',{
            errorMessage: errors.array()[0].msg,
        })
    }    
    const newAccount = new Account();
    newAccount.email = email;
    newAccount.password = newAccount.encryptPassword(password);
    newAccount.save()
    .then(result=>{
        console.log(result)
        res.redirect('/account');
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/account/signup');
    });
};

exports.getLogout = (req, res, next)=>{
    req.logout();
    res.redirect('/')
}

exports.postSignin = (req, res, next)=>{
    // console.log('clearing Cart')
    // return req.user.clearCart();

    let url;
    if(req.session.oldUrl){
        url = req.session.oldUrl;
        req.session.oldUrl = null;
        req.session.save();
    } else{
        url = '/';
    }

    if(req.session.cart){
        console.log(req.session.cart.items)
        const saveCart = req.user.addSessionCartToDB(req.session.cart.items);
        console.log(saveCart);
        saveCart
        .then(result=>{
            if(result){
                req.session.cart = null;
                req.session.save()
                return res.redirect(url)
            }
            return res.redirect(url)
        })
        .catch(err=>{
            console.log(err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    }
    else{
        res.redirect(url)
    }
}
