require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const challengesRoutes = require('./routes/challengesRouter');
const userRoutes = require('./routes/userRouter');
const authRoutes = require('./auth/router');
const { DATABASE_URL, PORT } = require('./config');
const passport = require('passport');

const { localStrategy } = require('./auth/strategies');
const { User } = require("./models/user")
const app = express();

mongoose.Promise = global.Promise;

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


app.use(jsonParser);
app.use(express.static("public"));

passport.use(localStrategy);
// passport.use(jwtStrategy);
passport.serializeUser(function (user, cb) {
    console.log(user)
    cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
    console.log(id)
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
const localAuth = passport.authenticate('local', { session: true });

app.use(passport.initialize());
app.use(passport.session());
app.use('/', userRoutes);
app.use('/challenges', challengesRoutes);
app.use('/auth', authRoutes);
app.use(function (err, req, res, next) {
    console.log(err);
})


function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, { useNewUrlParser: true }, err => {
            if (err) {
                return reject(err);
            }
            server = app
                .listen(PORT, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
