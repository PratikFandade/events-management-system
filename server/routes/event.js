const express = require('express');
const router = express.Router();
const Event = require('../models/event_model');
//const verify = require('../token/authToken');

// Get Data for all the Events
router.get('/', /*verify,*/ (req,res) => {
    //console.log(req.user);
    Event.find()
        .then((events) => res.json(events))
        .catch((err) => res.status(400).json('Error '+err));
});

// Get Data for Event with specific ID
router.get('/:eId', (req,res) => {
    Event.find({ "ename": { $regex: req.params.eId, $options: 'i' }})
        .then((events) => res.json(events))
        .catch((err) => res.status(400).json('Error '+err));
});

// Add Event
router.post('/add', (req,res) => {
    const addEvent = new Event({
        ename: req.body.ename,
        date: Date.parse(req.body.date),
        venue: req.body.venue,
        duration: Number(req.body.duration),
        slots: req.body.slots
    });
    addEvent.save()
        .then(() => res.json("Event Added"))
        .catch((err) => res.status(400).json('Error: '+err));
});

module.exports = router;