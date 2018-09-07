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

User = mongoose.model('User', userSchema);

module.exports ={ User }