const mongoose = require('mongoose');

//Genre Schema

const todoSchema = mongoose.Schema({
    subject:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    },
    time_spent_studying: {
        type: Number
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const Todo = mongoose.model("Todo", todoSchema);

const getTodos = function(callback, limit){
    Todo.find(callback).limit(limit);
}

module.exports = { Todo, getTodos }