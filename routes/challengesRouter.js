const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ejs = require('ejs');


const { Challenge } = require("../models/challenge");

router.get('/:id', (req, res) => {
    User.findOne({_id: "5b8c1c6137b93b413c777fdc"}) // req.user.id
    .then(userData => {
        Challenge.find({ 
            userId: userData._id
            // ,_id: req.params.id

        }) //this will be req.user.id
        .then(data => {
            let challengeFinder = data.find(c => {
                return c._id.toString() === req.params.id;
            })
            // console.log(challengeFinder);
            const userName = userData.userName
            // const totalTask = data.reduce((a, v) => {
            //     if (typeof a === 'object') return a.tasks.length + v.tasks.length; else return a + v.tasks.length
            // })
            // const completedTask = data.reduce((a, v) => {
            //     if (typeof a === 'object') return a.tasks.filter(t => t.completed).length + v.tasks.filter(t => t.completed).length; else return a + v.tasks.filter(t => t.completed).length
            // });
            console.log(challengeFinder);
            ejs.renderFile('views/task.ejs', { data, userName, challengeFinder }, { cache: true }, function (err, str) {
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

    router.post('/addtask/:id', (req, res) => {
        // console.log(req.body)
        Challenge.findOneAndUpdate({
            userId: "5b8c1c6137b93b413c777fdc",
            _id: req.params.id
        }, 
        {
            $push:{
                tasks: {
                    name: req.body.name
                }
            }
        })
            .then(challenge => res.status(201))
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" })
            })
        res.redirect('/');
    })

    router.post('/completedTask/:id', (req, res) => {
        let task = req.params.id;
        console.log(typeof task, task)
        Challenge.findOneAndUpdate(
            {'tasks._id': task},
            {$set: {completed: true}},
            // {arrayFilters:  }
        )
        //Challenge.findOne({'tasks._id': task}) // Still working on this use db.getCollection('challenges').find({'tasks._id': ObjectId("5b9081f01421fa3e24ccd56e")})
        //.then(element => console.log(element.tasks.filter(obj => obj._id === "5b9081f01421fa3e24ccd56e" )))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
        res.redirect('/');
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
