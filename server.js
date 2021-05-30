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


const eventSchema = {
    event_name: String,
    date: String,
    time_from: String,
    time_to: String,
    location: String,
    description: String,
    img_url: String,
    categories: [String]
}

const memberSchema = new mongoose.Schema({
    fullname: String,
    image_path: String,
    roles: String,
    pronouns: String,
    description: String
});

const conSchema = new mongoose.Schema({
    event_name: String,
    description: String,
    location: String,
    start: Date,
    end: Date,
    url:String
});

const SPOCEvent = mongoose.model('SPOCEvent', eventSchema);

const Member = mongoose.model('Member',memberSchema);

const Convention = mongoose.model('Convention',conSchema);

// Public Directories
app.get('/', function(req,res) {
    res.sendFile(__dirname+"/public/index.html");
})

app.get('/about', function(req,res) {
    res.sendFile(__dirname+"/public/about.html");
})

app.get('/conventions', function(req,res) {
    res.sendFile(__dirname+"/public/conventions.html");
})

app.get('/weekly-meeting', function(req,res) {
    res.sendFile(__dirname+"/public/weekly.html"); // subject to change
})

app.get('/contacts', function(req,res) {
    res.sendFile(__dirname+"/public/contacts.html");
})

app.get('/SPOC-calendar', function(req, res) {
    res.sendFile(__dirname+ "/public/SPOC-calendar.html");
})

app.get('/event-detail', function(req, res) {
    res.sendFile(__dirname+ "/public/event-detail.html");
})

// Private
app.get('/get_all_SPOC_events', function(req,res) {
    SPOCEvent.find(function(err, data) {
        if(err) {
            res.send({
                "message": "internal database error: SPOC_ALL",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    })
})

app.get('/get_event_by_id', function(req,res) {
    console.log(req.query.event_id)

    SPOCEvent.find({"_id": req.query.event_id},function(err, data) {
        if (err || data.length === 0) {
            res.send({
                "message": "internal database error: SPOC_by_ID",
                "data": {}
            })
        } else {
            res.send({
                "message": "success",
                "data": data[0]
            })
        }
    })
})


app.get("/node_get_all_members", function (req, res) {
    Member.find(function (err, data) {
        if (err) {
            res.send({
                "message": "internal database error",
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

app.get("/node_get_all_conventions", function (req, res) {
    Convention.find(function (err, data) {
        if (err) {
            res.send({
                "message": "internal database error",
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

app.get('/get_cons_by_filters',(req, res)=>{
    let sk = req.query.search_key;
    const hasSK = new RegExp(sk, "i")
    Convention.find({
        $or: [
            {event_name: {$regex: hasSK}},
            {description: {$regex: hasSK}},
            {location: {$regex: hasSK}}
        ]
    }, (err,data) =>{
        if (err) {
            res.send({
                "message":"db error",
                "data":[]
            });
        } else {
            res.send({
                "message":"success",
                "data":data
            });

        }
    });
});