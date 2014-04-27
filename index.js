var   responseTime = require('koa-response-time')
    , ratelimit = require('koa-ratelimit')
    , compress = require('koa-compress')
    , logger = require('koa-logger')
    , Router = require('koa-router')
    , serve = require('koa-static')
    , redis = require('redis')
    , koa = require('koa')
    , hbs = require('koa-hbs')
    , less = require('koa-less')
    , parse = require('co-body');


//
// Local modules
//

var   routes = require('./api');


//
// Global variables
//

var secrets = require('./secrets.json');
var env = process.env.NODE_ENV || 'development';


//
// Entry point for the API
//

function api(opts) {
    opts = opts || {};
    var app = koa();

    // logging
    if ('test' !== env) {
        app.use(logger());
    }

    // x-response-time
    app.use(responseTime());

    // compression
    app.use(compress());

    // rate limiting
    app.use(ratelimit({
        max: opts.ratelimit,
        duration: opts.duration,
        db: redis.createClient()
    }));

    // handlebars templating
    app.use(hbs.middleware({
        viewPath: __dirname + '/views'
    }));

    // serve less, css, js, images, etc
    // bower components and the like are served out of /static/{whatever}
    // but they exist in /views/static/{whatever}
    app.use(less(__dirname + '/views'));
    app.use(serve(__dirname + '/views'));

    // request body handling for legacy modules
    app.use(function *(next) {
        if (this.req === undefined) {
            this.req = this.request;
        }

        if (this.is('json', 'urlencoded')) {
            this.req.body = yield parse(this);
        }

        yield next;
    });

    // sessions
    var session = require('koa-session');
    app.keys = [secrets.session];
    app.use(session());

    // authentication
    var passport = require('./api/auth.js');
    app.use(passport.initialize());
    app.use(passport.session());


    //
    // Public Routing
    //

    var public = new Router();
    public.get('/', function *() {
        var authenticated = (this.req && this.req.user && this.req.user._id !== undefined);
        yield this.render('index', {
            title: 'Boiler',
            loggedIn: authenticated
        });
    });

    public.get('/login', function *() {
        var authenticated = (this.req && this.req.user && this.req.user._id !== undefined);
        if (this._id !== undefined) {
            yield this.redirect('/');
        } else {
            yield this.render('login', {
                title: 'login',
                loggedIn: authenticated
            });
        }
    });

    public.get('/logout', function *() {
        this.req.logout();
        this.req.user = undefined;
        yield this.render('index', {
            title: 'Boiler',
            loggedIn: false
        });
    });

    public.get('/register', function *() {
        yield this.render('register', {
            title: 'register',
            loggedIn: (this._id !== undefined)
        });
    });

    public.post( '/auth/register', routes.users.create, passport.authenticate('local'));

    public.post('/auth/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.use(public.middleware());


    //
    // Private Routing
    //

    var private = new Router();
    app.use(function*(next) {
        if (this.req.isAuthenticated()) {
            yield next;
        } else {
            this.redirect('/login');
        }
    });

    private.get(  '/profile',       routes.users.me);
    private.get(  '/users/:id',     routes.users.single);


    private.get(  '/stats',         routes.stats.all);
    private.get(  '/stats/:id',     routes.stats.get);
    app.use(private.middleware());

    return app;
}

module.exports = api;
