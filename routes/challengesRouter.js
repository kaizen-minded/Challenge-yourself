const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ejs = require('ejs');


const { Challenge } = require("../models/challenge");
const { Task } = require("../models/task");

router.get('/:id', (req, res) => {
    User.findOne({ _id: "5b8c1c6137b93b413c777fdc" }) // req.user.id
        .then(userData => {
            //userData it the user object from User collection
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
                    const totalTask = data.reduce((a, v) => {
                        if (typeof a === 'object') return a.tasks.length + v.tasks.length; else return a + v.tasks.length
                    })
                    const completedTask = data.reduce((a, v) => {
                        if (typeof a === 'object') return a.tasks.filter(t => t.completed).length + v.tasks.filter(t => t.completed).length; else return a + v.tasks.filter(t => t.completed).length
                    });
                    // console.log(challengeFinder);
                    ejs.renderFile('views/task.ejs', { data, userName, challengeFinder, totalTask, completedTask }, { cache: true }, function (err, str) {
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

router.post('/addchallenge', (req, res) => {
    Challenge.create({
        userId: mongoose.Types.ObjectId("5b8c1c6137b93b413c777fdc"),
        name: req.body.name,
        startDate: req.body.startDate,
        deadline: req.body.deadline
    })
        .then(challenge => res.status(201))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
    res.redirect('/');
})

router.delete('/deletechallenge/:id', (req, res) => {
    Challenge.findByIdAndDelete({
        _id: req.params.id,
        userId: "5b8c1c6137b93b413c777fdc"
    })
        .then(element => res.status(204))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
    res.redirect('/');
})

router.post('/addtask/:id', (req, res) => {
    // console.log(req.body)
    Challenge.findOneAndUpdate({
        userId: "5b8c1c6137b93b413c777fdc",
        _id: req.params.id
    },
        {
            $push: {
                tasks: {
                    name: req.body.name
                }
            }
        })
        .then(challenge => res.status(204))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
    res.redirect('/');
})

// router.delete('/deletetask/:id', (req, res) => {
//     console.log(req.params.id)
//     let deletetask = req.params.id;
//     Challenge.findOneAndUpdate(
//        {'tasks._id' : deletetask}
//        ,{ $pull: {'tasks': deletetask}}
//     )
//     // .then(challenge => challenge.tasks.filter(x => x.id !== deletetask))
//     .then(newArray => {
//         console.log(newArray);
//         // Challenge.findOneAndUpdate(
//         //     {'tasks._id': deletetask}
//         //     ,{$set: {'tasks': newArray}}
//         // )
//     })
//     //take this array and set the tasks to a new value
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal Server Error" })
//     })
//     res.redirect('/');
// })

router.put('/completedTask/:id', (req, res) => {
    let task = req.params.id;
    console.log(typeof task, task, req.body)
    Challenge.findOneAndUpdate(
        { 'tasks._id': task },
        { $set: { 'tasks.$.completed': req.body.completed } },
        // {arrayFilters:  }
    )
        .then(element => res.status(201))
        //Challenge.findOne({'tasks._id': task}) // Still working on this use db.getCollection('challenges').find({'tasks._id': ObjectId("5b9081f01421fa3e24ccd56e")})
        //.then(element => console.log(element.tasks.filter(obj => obj._id === "5b9081f01421fa3e24ccd56e" )))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" })
        })
    res.redirect('/');
});



module.exports = router; 
