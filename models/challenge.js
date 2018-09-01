const mongoose = require("mongoose");

const challengeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    name: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    deadline: Date,
    tasks: [{
        name: String,
        start:{
            type: Date,
            default: Date.now
        },
        deadline: Date,
        completed: Boolean
    }]

})

challengeSchema = mongoose.model('Challenge', challengeSchema);

module.exports ={ challengeSchema }