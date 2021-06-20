// Importing User model
const Users = require("../models/users_model");

// Importing Express Modules
const express = require("express");
const router = express.Router();

// Importing Encryption Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Importing Email Modules
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Importing Verifation & Validation Models
const verify = require("../token/actToken");
const registerValidation = require("../models/register_validation_model");
const loginValidation = require("../models/login_validation_model");

// Returns all Users
router.get("/", (req, res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Send the Activation-Mail to new User
router.post("/register", (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  Users.findOne({ email: req.body.email }, (err, user) => {
    if (user) return res.status(400).json("Email Exists");

    const salt = 10;
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      const payLoad = {
        fname: req.body.fname,
        email: req.body.email,
        password: hash,
      };
      const token = jwt.sign(payLoad, process.env.SECRET_KEY, {
        expiresIn: 1800,
      });

      const msg = {
        to: req.body.email,
        from: "anurag.kulkarni19@vit.edu",
        subject: "DSC Account Activation Link",
        html:
          '<strong><center>Click Here to Activate Account<br><a href="http://localhost:3000/activate/' +
          token +
          '">Activate</a></center></strong>',
      };
      sgMail
        .send(msg)
        .then(() => res.json("Account Activation Mail Sent"))
        .catch((err) => res.status(400).json("Error: " + err));
    });
  });
});

// Activation of a New User
router.post("/activate/:token", verify, (req, res) => {
  Users.updateOne(
    { email: req.user.email },
    {
      fname: req.user.fname,
      email: req.user.email,
      password: req.user.password,
    },
    { upsert: true }
  )
    .then(() => res.json("User Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Check Login of a User
router.post("/login", (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  Users.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt.compare(req.body.password, user.password, (err, auth) => {
        if (!auth) {
          res.status(400).json("Passwords do not match");
        } else {
          const payload = {
            _id: user.id,
            fname: user.fname,
          };

          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600,
          });
          res.header("auth-token", token).json(token);
        }
      });
    })
    .catch((err) => res.status(400).json("Email Doesn't Exists " + err));
});

// Send the Activation-Mail to new Google-User
router.post("/google/register", (req, res) => {
  Users.updateOne(
    { email: req.body.email },
    {
      fname: req.body.fname,
      email: req.body.email,
      googleId: req.body.googleId,
    },
    { upsert: true }
  )
    .then(() => res.json("User Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Check Login of a Google-User
router.post("/google/login", (req, res) => {
  Users.findOne({ email: req.body.email })
    .then((user) => {
      if (user.googleId != req.body.googleId) {
        res.status(400).json("Passwords do not match");
      } else {
        const payload = {
          _id: user.id,
          fname: user.fname,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 3600,
        });
        res.header("auth-token", token).json(token);
        // console.log("thisis " + res);
      }
    })
    .catch((err) => res.status(400).json("Email Doesn't Exists " + err));
});

// logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.delete("/:id", (req, res) => {
  Users.findByIdAndDelete(req.params.id)
    .then(() => res.json("User Account Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
