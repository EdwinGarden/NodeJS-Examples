// handle endpoints for /leaders and /leaders/leaderId

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// set up the routes
// leaders
leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        console.log('(Get) Find all Leaders ', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Leaders.create(req.body)
        .then((leader) => {
            console.log('(Post) Leader created ', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Post) You are not authorized to perform this operation!');    
    }
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        res.statusCode = 403;
        res.end('(Put) operation not supported on /leaders');
    }
    else {
        res.statusCode = 403;
        res.end('(Post) You are not authorized to perform this operation!');    
    }
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Leaders.remove({})
        .then((resp) => {
            console.log('(Delete) Deleting all Leaders');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Post) You are not authorized to perform this operation!');    
    }
});


// leaderId
leaderRouter.route('/:leaderId/')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        console.log('(Get) Getting details for leader ' + req.params.leaderId + 'to you!' );
        res = setRequest(res, 200);
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=> {
    if (req.user.admin) {
        res.statusCode = 403;
        res.end('(Post) operation not supported on /leaders/' + req.params.leaderId );       
    }
    else {
        res.statusCode = 403;
        res.end('(Post) You are not authorized to perform this operation!');    
    }
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, {new : true})
        .then((leader) => {
            console.log('(Put) Will update leader ' + req.params.leaderId + ', for you!');
            res = setRequest(res, 200);
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Put) You are not authorized to perform this operation!');    
    }
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            console.log('(Delete) Will delete leader ' + req.params.leaderId + '!');
            res = setRequest(res, 200);
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Delete) You are not authorized to perform this operation!');    
    }
});

module.exports = leaderRouter;

function setRequest(res, code) {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    return res;
}
