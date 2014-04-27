var   parse = require('co-body')
    , mongo = require('mongoose')
    , bcrypt = require('bcrypt-nodejs')
    , uuid = require('node-uuid')
    , grvtr = require('grvtr');

mongo.connect('mongodb://localhost/main');
var db = mongo.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('User module DB connection open.');
});

var User = mongo.model('User', require('./model.js'));

//
// Get the currently logged in user's profile
// If not logged in, redirect
//
exports.me = function *() {
    if (!this.req.user || !this.req.user._id) {
        this.redirect('/login');
        return;
    }

    var profile = yield User.find({ _id:this.req.user._id }, function(err, profile) {
        if (err) {
            this.throw(500, 'could not fetch user');
            console.log('ERR: ', err);
        }
        this.body = profile;
    }).exec();

    yield this.render('profile', profile[0]);
};


//
// Get a user's profile based on their user id
//
exports.single = function *(id) {
    yield User.find({ _id:id }, function(err, profile) {
        if (err) {
            this.throw(500, 'could not fetch user');
            console.log('ERR: ', err);
        }
        this.body = profile;
    });
};


//
// Create a new user and respond with success, existing, or error
//
exports.create = function *(next) {
    if (!this.req.body.name) {
        this.throw(400, '.name required');
        return;
    } else if (!this.req.body.email) {
        this.throw(400, '.email required');
        return;
    } else if (!this.req.body.password) {
        this.throw(400, '.password required');
        return;
    }

    var newUser = User.create({
        _id: uuid.v4(),
        name: this.req.body.name,
        email: this.req.body.email,
        password: bcrypt.hashSync(this.req.body.password),
        photo: grvtr.create(this.req.body.email, {
            size: 200,
            defaultImage: 'identicon',
            secure: true
        })
    });

    if (!newUser) {
        this.throw (409, 'The email has all ready been registered.');
        return;
    }

    this.status = 201;

    // this method should be passed to passport
    // or some other "hey, I've been authenticated" function
    this.req.body = {
        username: this.req.body.email,
        password: this.req.body.password
    };
    yield next;
};
