const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index', {task: task, complete: complete})
});

let task = ['Study Node.js', 'Build UI'];
let complete = ["finish jQuery"];

router.post('/addtask', (req, res) =>{
    let newTask = req.body.newTask;
    task.push(newTask);
    res.redirect('/');
});


module.exports = router; 
