const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const { Challenge } = require("../models/challenge")
const { User } = require("../models/user")

router.get('/', (req, res) => {
    if(req.user){
        res.redirect(`/challenges/${req.user.id}`)
    }
    ejs.renderFile('views/home.ejs', {loggedIn: false}, function(err, str){
        res.send(str)
    });
    res.status(200);
})

// router.get('/dashboard', (req, res) => {
//     User.findOne({_id: "5b8c1c6137b93b413c777fdc"})
//     .then(userData => {
//         Challenge.find({ userId: userData._id }) //this will be req.user.id
//         .then(data => {
//             const username = userData.username
//             const totalTask = data.reduce((a, v) => {
//                 if (typeof a === 'object') return a.tasks.length + v.tasks.length; else return a + v.tasks.length
//             })
//             const completedTask = data.reduce((a, v) => {
//                 if (typeof a === 'object') return a.tasks.filter(t => t.completed).length + v.tasks.filter(t => t.completed).length; else return a + v.tasks.filter(t => t.completed).length
//             });


//             ejs.renderFile('views/profile.ejs', { data, totalTask, completedTask, username }, { cache: true }, function (err, str) {
//                 res.send(str)
//             }) 
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ message: "Internal Server Error" })
//         })
//     })
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal Server Error" })
//     })

// });

router.get('/register', (req, res) => {
    ejs.renderFile('views/register.ejs',{loggedIn: false}, function(err, str){
        res.send(str)
    })
})

router.post('/register', (req, res) => {
    // console.log(req.body);
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
    
    if(missingField){
        return res.status(422).json({
            code:422,
            reason: 'ValidationError',
            message: "Missing field",
            location: missingField
        })
    }
    
    const stringFields = [ 'username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find( field =>{ 
        (field in req.body)&& typeof req.body[field !== 'string']});

    if(nonStringField){
        return res.status(422).json({
            code:422,
            reason: 'ValidationError',
            message: "Incorrect field type: expected string",
            location: nonStringField
        })
    }    
    const explicitylyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitylyTrimmedFields.find(field => {
        req.body[field].trim() !== req.body[field]
    });

    if(nonTrimmedField) {
        return res.status(422).json({
            code:422,
            reason: 'ValidationError',
            message: "Cannot start or end with whitespace",
            location: nonTrimmedField
        })
    }

    const sizedFields = {
        username: {
            min:1
        },
        password: {
            min: 8,
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(field => {
        'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
    });
    const tooLargeField = Object.keys(sizedFields).find(field =>{
        'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    });

    if(tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField]
              .min} characters long`
            : `Must be at most ${sizedFields[tooLargeField]
              .max} characters long`,
          location: tooSmallField || tooLargeField
        });
    }
    let { username, password, email, firstName ='', lastName =''} = req.body
    
    return User
        .find({username})
        .count()
        .then(count => {
            if (count > 0){
                return Promise.reject({
                    code: 422,
                    reason: 'ValdationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            return User.hashPassword(password)
        })
        .then(hash => {
            // console.log({hash})
            return User.create({
                username,
                password: hash,
                firstName,
                lastName,
                email
            });
        })
        .then(user => {
            res.status(201).json(user.serialize());

            
            // .json(user.serialize());
        })
        .catch(err => {
            console.log(err)
            if(err.reason === 'ValidationError'){
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: 'Innternal server error'
        });
        })
    
})

router.get('/login', (req, res) => {
    ejs.renderFile('views/login.ejs', {loggedIn: false}, function(err, str){
        res.send(str)
    })
    res.status(200);
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router; 
