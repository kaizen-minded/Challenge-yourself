'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const request = require('supertest');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { Challenge } = require('../models/challenge');
const { User } = require('../models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedUserData() {
    console.info('seeding User data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    // this will return a promise
    return User.insertMany(seedData);
}


// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data

function generateUserData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "password123"
    }
}

function generateChallengeData() {
    return {

    }
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('User API resource', function () {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedRestaurantData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        // return seedUserData();

    });

    afterEach(function () {
        // return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    // note the use of nested `describe` blocks.
    // this allows us to make clearer, more discrete tests that focus
    // on proving something small

    describe('GET login endpoint', function () {
        it('should get an ok status', function () {
            let res;
            return chai.request(app)
                .get('/login')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200)
                })
        })
    })

    describe("POST to register", function () {
        it("should create a new User", function (done) {
            const newUser = generateUserData();

            console.log(newUser)
            request(app)
            .post('/register')
            .type('form')
            .send(newUser)
            .expect(201)
            .end(done)
        })
    })
    
    describe("User Login", function () {
        it("should allow the user to login", function (done) {
            
            User.findOne()
            .then((user) =>{
                console.log(user);
                request(app)
                .post('/auth/login')
                .type('form')
                .send({username: user.username, password:"password123"})
                .expect(200)
                .end(done)
            })
        })
    })
})
describe("Challenge API resources", function(){
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        // return seedUserData();
        User.findOne()
        .then((user) =>{
            console.log(user);
            request(app)
            .post('/auth/login')
            .type('form')
            .send({username: user.username, password:"password123"})
            .expect(200)
            .end(done)
        })

    });

    afterEach(function () {
        // return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

})