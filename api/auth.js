var   passport = require('koa-passport')
    , mongo = require('mongoose')
    , bcrypt = require('bcrypt-nodejs');


var LocalStrategy = require('passport-local').Strategy;

//
// Local strategy descriptor
//
passport.use(new LocalStrategy(function(username, password, done) {
    var User = mongo.model('User');
    User.findOne({ email: username }, function (err, profile) {
        // error checking on lookup
        if (err) {
            console.log('ERR: ', err);
            done(err);
            return;
        }

        // verify password
        if (!bcrypt.compareSync(password, profile.password)) {
            console.log('\n\nFound UNauthenticated user: %s', profile);
            done(null, false);
            return;
        }

        console.log('\n\nFound authenticated user: ', profile);
        profile.password = undefined;
        done(null, profile);
    });
}));


//
// User serialization
//
passport.serializeUser(function(user, done) {
    console.log('\n\n\nSerializing: %s\n\n\n\n', user);
    done(null, user._id);
});


//
// User deserialization
//
passport.deserializeUser(function(id, done) {
    console.log('\nDeserializing: %s\n\n', id);
    var User = mongo.model('User');
    User.findOne({ _id: id }, function (err, profile) {
        if (err) {
            console.log('ERR: ', err);
            done(err);
        } else {
            done(null, profile);
        }
    });
});

module.exports = passport;
