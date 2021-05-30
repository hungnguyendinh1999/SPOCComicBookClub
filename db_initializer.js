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