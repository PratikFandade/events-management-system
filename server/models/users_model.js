const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,
        required: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    password: {
        type: String,
        minlength: 4
    },
    googleId: {
        type: String
    }
})

module.exports = users_model = mongoose.model('new_users', userSchema);