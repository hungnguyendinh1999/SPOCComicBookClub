const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.listen(3000, function () {
    console.log("server started at 3000");
});

//Configure local Mongoose
mongoose.connect('mongodb://localhost:27017/comicDB', {useNewUrlParser: true, useUnifiedTopology: true}, function() {
    console.log("MongoDB connection successful");
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

const rsvpSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    email: String,
    head_count: Number,
    message: String,
    interests: [String]
});

const SPOCEvent = mongoose.model('SPOCEvent', eventSchema);

const Member = mongoose.model('Member',memberSchema);

const Convention = mongoose.model('Convention',conSchema);

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

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

app.get('/weekly_meeting', function(req,res) {
    res.sendFile(__dirname+"/public/rsvp_list.html"); // subject to change
})

app.get('/edit', function(req,res) {
    res.sendFile(__dirname+"/public/rsvp_edit.html");
})

app.get('/contacts', function(req,res) {
    res.sendFile(__dirname+"/public/contact.html");
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

app.post("/save_rsvp", (req, res) => {
    let avatar = null;
    if (!req.body.avatar) {
        avatar = "https://cdn.vox-cdn.com/thumbor/X7fW7KYz0XEz57TAGoUcDU2YpbA=/0x0:696x534/1200x800/filters:focal(293x212:403x322)/cdn.vox-cdn.com/uploads/chorus_image/image/69312307/Untitled.0.jpg";
    } else {
        avatar = req.body.avatar;
    }
    const rsvp = {
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        head_count: req.body.head_count,
        message: req.body.message,
        interests: req.body.interests
    }

    const nr = new Rsvp(rsvp);
    nr.save(
        (err, new_rsvp) => {
            if (err) {
                console.log(err['message']);
            } else {
                res.redirect("/weekly_meeting");
            }
        }
    );

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