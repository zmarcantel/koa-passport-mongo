Koa-Passport-Mongo Boilerplate
==============================

Get up and running quickly.

Check out [What's Included](#what-is-included)


Installation
============

Clone away.

Once setup, you will need to do a quick setup:

### 1. Create `secret.json`

Create a file containing your session secret and any secrets to you may need.

Minimum:

````json
{
    "session": "some string here"
}
````

### 2. Install npm modules

    npm install

### 3. Install bower components

    bower install



Optional Deployment Steps
=========================

Included in the repo is an `upstart` script. Upstart is the service management software included in Ubuntu.

If you are using a different distribution or service manager (sysvinit, systemd, etc), please feel free to submit a pull request containing these scripts.

This script will maintain a single process. If you are using `nginx` to reverse proxy a series of processes (you should) check out [my post](https://zed.io/tutorials/tech/multiple-node-processes.html) about it.



Usage
=====

The application is started with the file `bin/api`.

    node ./bin/api

For an example of how this works, see the `deploy/upstart/upstart.conf` file.

The application file responds to the foloowing arguments:

```

  Usage: api [options]

  Options:

    -h, --help            output usage information
    -H, --host <host>     specify the host [0.0.0.0]
    -p, --port <port>     specify the port [4000]
    -b, --backlog <size>  specify the backlog size [511]

```



Live Testing
============

The repo contains a `Vagrantfile` in the root directory.

This file belongs to a tool called [Vagrant](http://vagrantup.com). It is a virtualmachine manager with multiple supported clients (Virtualbox, AWS, Docker, etc).

The default configuration installs the latest `nodejs` package from [Chris Lea's Devel PPA](https://launchpad.net/~chris-lea/+archive/node.js-devel). Once `0.11.x` or __more importantly__ the stable `0.12.x` goes live, I will adjust this accordingly.

This comes with a few benefits:

1. Isolated environment
    * don't install a bunch of dependencies on your machine
    * expand it to simulate your production environment
2. Mirrored directories
    * the `/vagrant` directory is mirrored to the root directory
    * the `./log` directory contains logs of the application
    * edit on the host machine, changes reflected in the VM

To install `Vagrant`, simply use your package manager:

````bash
# Ubuntu
sudo apt-get install -y vagrant

# Mac OS/X
brew install vagrant

# Arch
sudo pacman -Sy vagrant

# CentOS/RHEL is apparently a little harder -- must use ruby gems
sudo yum install ruby rubygems
sudo gem update --system
sudo gem install vagrant

````

To get started, just run

    vagrant up

and to log into the machine

    vagrant ssh


### Viewing From VM

By default, the VM is bound to the IP `192.168.50.100` and the application runs on port `4000`. If you have changed these defaults, change them accordingly below.

1. Point a browser at `192.168.50.100:4000`.
2. Done.

Easy :)




What Is Included
================

For an in-depth look, check out the `package.json`.

### Auth/Security

* [bcrypt](https://www.npmjs.org/package/bcrypt-nodejs) -- bcrypt password hashing
* [koa-session](https://www.npmjs.org/package/koa-session) -- session handling
* [passport](https://www.npmjs.org/package/passport) -- highly popular and modular authorization module
* [koa-passport](https://www.npmjs.org/package/koa-passport) -- wraps passport in a generator-based wrapper


### Koa Server

* [koa](http://koajs.com/) -- obviously
* [koa-compress](https://www.npmjs.org/package/koa-compress) -- compress responses
* [co-body](https://www.npmjs.org/package/co-body) -- body parser
* [koa-logger](https://www.npmjs.org/package/koa-logger) -- basic traffic logger
* [koa-ratelimit](https://www.npmjs.org/package/koa-ratelimit) -- simple to use rate limiting
* [koa-response-time](https://www.npmjs.org/package/koa-response-time) -- add response time header
* [koa-router](https://www.npmjs.org/package/koa-router) -- koa routers make forking middleware easy
* [koa-static](https://www.npmjs.org/package/koa-static) -- serve static files like images, videos, sound, etc


### Design

* [koa-hbs](https://www.npmjs.org/package/koa-hbs) -- Handlebars templating
* [koa-less](https://www.npmjs.org/package/koa-less) -- on the fly LESS file compilation/caching

### Addons

* [commander](https://www.npmjs.org/package/commander) -- expand command line options
* [grvtr](https://www.npmjs.org/package/grvtr) -- gravatar fetcher on singup
* [mongoos](https://www.npmjs.org/package/mongoose) -- most popular MongoDB ODM
* [redis](https://www.npmjs.org/package/redis) -- redis client. used for the statistics module and any caching
* [node-uuid](https://www.npmjs.org/package/node-uuid) -- generate UUIDs for user identification among other things
