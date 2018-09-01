const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    user: {
    firstName: String,
    lastName: String,
    },
    userName: {
        type: String,
        unique: true
    }

})

userSchema = mongoose.model('User', challengeSchema);

module.exports ={ userSchema }