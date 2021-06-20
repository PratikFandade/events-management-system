// Schema for Attendees & thier Attendance
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const evattendSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    event_name: {
        type: String,
        required: true,
    },
    slots: {
        type: Object,
        required: true,
    },
    attendance: {
        type: Number,
        default: 0,
    },
});

module.exports = attendance_model = mongoose.model( "new_attendances", evattendSchema );