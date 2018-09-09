const mongoose = require('mongoose');

//Genre Schema

const taskSchema = mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Challenge'
    },
    name:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    },
    deadline:{
        type: Date,
    },
    copmleted: {
        type: Boolean
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task }