const express = require('express');
const router = express.Router();

let task = ['Study Node.js', 'Build UI'];
let complete = ["finish jQuery"];

router.get('/', (req, res) =>{
    res.render('index', {task: task, complete: complete});
    // res.render('index', {task: task, complete: complete})
});

router.post('/addtask', (req, res) =>{
    let newTask = req.body.newtask;
    task.push(newTask);
    res.redirect('/');
});

router.post("/removetask", (req, res) => {
    let completeTask = req.body.check;
    if (typeof completeTask === 'string'){
        complete.push(completeTask);
        console.log(complete);
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object"){
        for (let i = 0; i < completeTask.length; i++){
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect('/');
});

module.exports = router; 
