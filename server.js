const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Todo = require("./models/todo");
const jsonParser = bodyParser.json();
const routes = require('./routes/challengesRouter')
const { DATABASE_URL, PORT } = require('./config');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(jsonParser);
app.use(express.static("public"));

app.use('/', routes);

let db = mongoose.connection;

// app.post('/addtask', (req, res) => {
//     let newTask = req.body.newTask;
//     task.push(newTask);
//     res.redirect('/');
// });
 
// app.post("/removetask", (req, res) => {
//     let completeTask = req.body.check;
//     if (typeof completeTask === 'string'){
//         complete.push(completeTask);
//         task.splice(task.indexOf(completeTask), 1);
//     } else if (typeof completeTask === "object"){
//         for (let i = 0; i < completeTask.length; i++){
//             complete.push(completeTask[i]);
//             task.splice(task.indexOf(completeTask[i]), 1);
//         }
//     }
//     res.redirect('/');
// });

app.get('/api/todos', (req, res) => {
    Todo.getTodos(function(err, todos){
        if(err){
            throw err;
        }
        res.json({todos});
    })
});

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
