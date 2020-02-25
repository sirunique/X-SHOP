const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const Account = require('../models/account')

passport.serializeUser((user, done)=>{
    done(null, user.id)
});

passport.deserializeUser((id, done)=>{
    Account.findById(id, (err, user)=>{
        done(err, user);
    })
})

module.exports = (passport)=>{
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        Account.findOne({email:email})
        .then(user=>{
            if(!user){ // User Not Found
                return done(null, false, {message: 'Invalid Credentials'})
            }
            // compare password
            if(!user.comparePassword(password, user.password)){  // Incorrrect password
                return done(null, false, {message: 'Invalid Credentials'})
            }
            console.log('account success')
            return done(null, user)
        })
        .catch(err=> console.log(err))
    }))
}
