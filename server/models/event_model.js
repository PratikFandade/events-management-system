// Schema for Events
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema ({
    ename: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    slots: {
        type: Object,
        required: true
    },
});

module.exports = event_model = mongoose.model( "new_events", eventSchema );