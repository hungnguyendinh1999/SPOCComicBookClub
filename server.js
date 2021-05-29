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
mongoose.connect('mongodb://localhost:27017/comicDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

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
    res.sendFile(__dirname+ "/public/SPOC-calendar.html")
})

// Private Directories

