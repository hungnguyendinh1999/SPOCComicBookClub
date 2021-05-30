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

const SPOCEvent = mongoose.model('SPOCEvent', eventSchema);

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