const express = require("express");
const router = express.Router();
const E_Attend = require("../models/attendance_model");

// Get All Attendees & their Attendance
router.get("/", (req, res) => {
    E_Attend.find()
        .then((evattend) => res.json(evattend))
        .catch((err) => res.status(400).json("Error: " + err));
});

// Get Attendee & his/her Attendance by ID
router.get("/:id", (req, res) => {
    E_Attend.findById({ _id: req.params.id })
        .then((attendees) => res.json(attendees))
        .catch((err) => res.status(400).json("Error: " + err));
});

// Create new Attendee, and initialise the Attendance
router.post("/register", (req, res) => {
    const registerAudience = new E_Attend({
        fname: req.body.fname,
        email: req.body.email,
        contact: Number(req.body.contact),
        event_name: req.body.event_name,
        slots: req.body.slots,
    });

    registerAudience
        .save()
        .then(() => res.json("Registration Successful"))
        .catch((err) => res.status(400).json("Error: " + err));
});

// Marking Attendance according to the Attendee ID
router.post("/attend/:id", (req, res) => {
    E_Attend.findById(req.params.id)
        .then((attendees) => {
            attendees.slots = req.body.slots;
            var i, j, len = 0, count = 0;
            var al = Object.values(attendees.slots);
            len = al.length;
            for (i = 0; i < len; i++) {
                for (j = 0; j < al[i].length; j++) {
                    count = count + 1;
                }
            }
            attendees.attendance = count;
            attendees
                .save()
                .then(() => res.json("Attendance Marked"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
