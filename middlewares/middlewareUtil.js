const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

module.exports.errorMiddleware = (err, req, res, next) => {
    if (err) {
        console.log(err);
        if (err.name == 'SyntaxError') {
            res.status(400).json({error: "json parse error"});
        } else {
            res.status(500).json({error: "internal error"});
        }
    }
    else {
        next();
    }
}

passport.use(new LocalStrategy(function (username, password, done) {
    let user = {
        username: 'zwx',
        password: 'Zwx@123'
    }
    if (user.username !== username) {
        return done(null, false, {message: 'Incorrect username.'});
    }
    if (user.password !== password) {
        return done(null, false, {message: 'Incorrect password.'});
    }
    return done(null, user);
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.status('401').json({message:'not log in'});
    }

}

module.exports.passport = passport;
module.exports.isLoggedIn = isLoggedIn;