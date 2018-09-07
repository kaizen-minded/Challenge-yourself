const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const Todo = require("./models/todo");
const jsonParser = bodyParser.json();
const challengesRoutes = require('./routes/challengesRouter');
const userRoutes = require ('./routes/userRouter');
const { DATABASE_URL, PORT } = require('./config');
const app = express();

mongoose.Promise = global.Promise;

// app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(jsonParser);
app.use(express.static("public"));

app.use('/', userRoutes);
app.use('/challenges', challengesRoutes);

let db = mongoose.connection;

// app.get('/api/todos', (req, res) => {
//     Todo.getTodos(function(err, todos){
//         if(err){
//             throw err;
//         }
//         res.json({todos});
//     })
// });

function runServer(){
    return new Promise((resolve, reject) =>{
        mongoose.connect(DATABASE_URL, { useNewUrlParser: true}, err =>{
            if(err){
                return reject(err);
            }
            server = app
            .listen(PORT, () =>{
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
    return mongoose.disconnect().then(()=> {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if(err) {
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

module.exports = { app, runServer, closeServer};
