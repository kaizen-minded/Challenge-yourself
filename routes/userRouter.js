const express = require('express');
const router = express.Router();
const ejs = require('ejs');


let task = ['Study Node.js', 'Build UI'];
let complete = ["finish jQuery"];



const { Challenge } = require("../models/challenge")
const { User } = require("../models/user")

router.get('/', (req, res) => {
    User.findOne({_id: "5b8c1c6137b93b413c777fdc"})
    .then(userData => {
        Challenge.find({ userId: userData._id }) //this will be req.user.id
        .then(data => {
            const userName = userData.userName
            const totalTask = data.reduce((a, v) => {
                if (typeof a === 'object') return a.tasks.length + v.tasks.length; else return a + v.tasks.length
            })
            const completedTask = data.reduce((a, v) => {
                if (typeof a === 'object') return a.tasks.filter(t => t.completed).length + v.tasks.filter(t => t.completed).length; else return a + v.tasks.filter(t => t.completed).length
            });


            ejs.renderFile('views/index.ejs', { task, complete, data, totalTask, completedTask, userName }, { cache: true }, function (err, str) {
                res.send(str)
            }) 
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    })

});



router.post('/addtask', (req, res) => {
    let newTask = req.body.newtask;
    task.push(newTask);
    res.redirect('/');
});

router.post("/removetask", (req, res) => {
    let completeTask = req.body.check;
    if (typeof completeTask === 'string') {
        complete.push(completeTask);
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (let i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect('/');
});

module.exports = router; 
