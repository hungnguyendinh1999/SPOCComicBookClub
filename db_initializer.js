const mongoose = require('mongoose');

const fs = require('fs');
const rawdata = fs.readFileSync(__dirname + "/events_data.json");
const jsonList = JSON.parse(rawdata);

// console.log(jsonList);

mongoose.connect('mongodb://localhost:27017/comicDB',
    {useNewUrlParser: true, useUnifiedTopology: true }, function () {
        console.log("db connection successful");
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

const eventList = []

jsonList.forEach(function (event) {
    eventList.push({
        "event_name": event["event_name"],
        "date": event["date"],
        "time_from": event["time_from"],
        "time_to": event["time_to"],
        "location": event["location"],
        "description": event["description"],
        "img_url": event["img_url"],
        "categories": event["categories"]
    })
});

SPOCEvent.insertMany(eventList, {}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("all Event data saved");
        mongoose.connection.close();
    }
});

const memberdata = fs.readFileSync(__dirname + "/members.json");
memberJSON = JSON.parse(memberdata);

const memberSchema = new mongoose.Schema({
    fullname: String,
    image_path: String,
    roles: String,
    pronouns: String,
    description: String
});

const Member = mongoose.model('Member', memberSchema);

memberList = []

memberJSON.forEach(function (member) {
    memberList.push({
        "fullname": member["fullname"],
        "image_path": member["image_path"],
        "roles": member["roles"],
        "pronouns": member["pronouns"],
        "description": member["description"]
    });
});

Member.insertMany(memberList, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        mongoose.connection.close();
    }
});

const condata = fs.readFileSync(__dirname + "/conventions.json");
conJSON = JSON.parse(condata);

const conSchema = new mongoose.Schema({
    event_name: String,
    description: String,
    location: String,
    start: Date,
    end: Date,
    url:String
});

const Convention = mongoose.model('Convention', conSchema);

conList = []

conJSON.forEach(function (convention) {
    conList.push({
        "event_name": convention["event_name"],
        "description": convention["description"],
        "location": convention["location"],
        "start": new Date(convention["start"]),
        "end": new Date(convention["end"]),
        "url": convention["url"]
    });
});

Convention.insertMany(conList, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        mongoose.connection.close();
    }
});

// RSVP
const rsvpFile = fs.readFileSync(__dirname + "/rsvp.json");
rsvpJSON = JSON.parse(rsvpFile);

const rsvpSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    email: String,
    head_count: Number,
    message: String,
    interests: [String]
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

let rsvpList = []

rsvpJSON.forEach(function (rsvp) {
    rsvpList.push({
        "name": rsvp["name"],
        "avatar": rsvp["avatar"],
        "email": rsvp["email"],
        "head_count": rsvp["head_count"],
        "message": rsvp["message"],
        "interests": rsvp["interests"]
    });
});

Rsvp.insertMany(rsvpList, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All RSVP data saved");
        mongoose.connection.close();
    }
});