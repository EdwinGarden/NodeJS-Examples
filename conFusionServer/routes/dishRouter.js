// handle endpoint for /dashes and /dishId 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// can chain all of the operations to the route
// I guess that you can do it all separately as well
dishRouter.route('/')
.get((req, res, next) => {
    // return all of the dishes
    Dishes.find({})
    .then((dishes) => {
        console.log('(Get) Find dishes ', dishes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err)); // errors are passed on to the overall error handler
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('(Post) Dish created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))    
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /dishes'); // <- defining the parameter name
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        console.log('(Delete) Deleting all the dishes');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))    
    .catch((err) => next(err));
});


// // handle operations on /dishes/:dishId
dishRouter.route('/:dishId/')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        console.log('(Get) Will and send details for dish ' + req.params.dishId + ' to you!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))    
    .catch((err) => next(err));
    //res.end('(Get) Will and send details for dish ' + req.params.dishId + ' to you!');
    // '/dishes/:dishId' <--- req.params.dishId. Parameter names need to match
})
.post((req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /dishes/' + req.params.dishId); 
})
.put((req, res, next) => { // PUT = modify
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new : true})
    .then((dish) => {
        console.log('(Put) Will update dish ' + req.params.dishId + ', for you!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))    
    .catch((err) => next(err));

    // res.write('Updating the dish: ' + req.params.dishId + '\n');
    // res.end('(Put) Will update dish ' + req.params.dishId + 
    //     ', with details: ' + req.body.description + ', for you!');
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        console.log('(Delete) Will delete dish ' + req.params.dishId + '!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))    
    .catch((err) => next(err));
});

module.exports = dishRouter;