// handle endpoints for /promotions and promotions/promotionId

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// set up the routes
// promotions
promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        console.log('(Get) find all promotions ' + promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('(Post) Promotion created ' + promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        console.log('(Delete) Deleting all the promotions');
        res = setResponse(res, 200);
        res.json(resp);
    }, (err) => next(err))    
    .catch((err) => next(err));
});


// promotionId
promoRouter.route('/:promotionId/')
.get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        console.log('(Get) Will send details for promotion ' + req.params.promotionId + ' to you!');
        res = setResponse(res, 200);
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('(Post) operation not supported on /promotions/' + req.params.promotionId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, {new : true})
    .then((promotion) => {
        console.log('(Put) Updating promotion ' + req.params.promotionId + ', for you!');
        res = setResponse(res, 200);
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
    .then((resp) => {
        console.log('(Delete) Will delete promotion ' + req.params.promotionId + '!');
        res = setResponse(res, 200);
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;

function setResponse(res, code) {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    return res;
}