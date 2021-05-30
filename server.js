//npm i express body-parser mongoose
//npm i express-session passport passport-local passport-local-mongoose

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
//Add sessions
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/comicDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);


const rsvpSchema = {
    name: String,
    email: String,
    head_count: Number,
    message: String
};

const Rsvp = mongoose.model('Rsvp', rsvpSchema);
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            minlength: [5, 'username > 3 char']
        },
        password: {
            type: String,
            require: true
        },
        fullname: {
            type: String,
            require: true
        }
    }
);

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/rsvp_list.html");
});

app.get('/get_current_user', function (req, res) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.send({
            message: 'success',
            data: req.user
        });
    } else {
        res.send({
            message: 'no login',
            data: {}
        })
    }
});

app.get("/get_all_rsvps", function (req, res) {
    Rsvp.find(function (err, data) {
        if (err) {
            res.send({
                "message": "error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

app.get('/get_rsvp_by_id', function (req, res) {
    Rsvp.findOne({"_id": req.query.rsvp_id}, function (err, data) {
        if (err) {
            res.send({
                "message": "error",
                "data": {}
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

app.get('/register', (req, res) => {
    if (req.query.error) {
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});

app.post('/register', (req, res) => {
    const newUser = {
        username: req.body.username,
        fullname: req.body.fullname
    };
    User.register(
        newUser,
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register?error=" + err);
            } else {
                //write into cookies, authenticate code
                const authenticate = passport.authenticate('local');
                authenticate(req, res, function () {
                    res.redirect("/");
                });
            }
        }
    );
});


app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(
        user,
        function (err) {
            if (err) {
                console.log(err);
                res.redirect('login?error=Invalid username or password');
            } else {
                const authenticate = passport.authenticate(
                    'local',
                    {
                        successRedirect: '/',
                        failureRedirect: '/login?error=Username and password dont match'
                    });
                authenticate(req, res);
            }
        }
    )
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.get("/edit", (req, res) => {
    //A page can be viewed only after login
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/rsvp_edit.html");
    } else {
        res.redirect('/login.html?error=You need to login first');
    }

});


app.post('/like_movie', (req, res) => {
    //Users need to login to like a movie
    if (req.isAuthenticated()) {
        //add user to movie
        const movie_id = req.body.movie_id;
        const user = {
            username: req.user.username,
            fullname: req.user.fullname
        };
        Movie.updateOne(
            {_id: movie_id, 'likes.username' : {$ne:user.username}},
            {
                $push: {likes: user}
            },
            {},
            (err, info) => {
                if (err) {
                    res.send({
                        message: 'database error'
                    });
                } else {
                    res.send({
                        message: 'success'
                    })
                }
            }
        );
    } else {
        //navigate to login
        res.send({
            message: 'login required!',
            data: '/login'
        });
    }


});