// handle endpoint for /dashes and /dishId 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// can chain all of the operations to the route
// I guess that you can do it all separately as well
dishRouter.route('/')
.get((req, res, next) => { // open for all
    // return all of the dishes 
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        console.log('(Get) Find dishes ', dishes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err)); // errors are passed on to the overall error handler
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // check auth
    if (req.user.admin) {
        Dishes.create(req.body)
        .then((dish) => {
            console.log('(Post) Dish created ', dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
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
        res.end('(Put) operation not supported on /dishes'); // <- defining the parameter name
    }
    else {
        res.statusCode = 403;
        res.end('(Put) You are not authorized to perform this operation!'); // <- defining the parameter name
    }
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Dishes.remove({})
        .then((resp) => {
            console.log('(Delete) Deleting all the dishes');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))    
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Delete) You are not authorized to perform this operation!'); // <- defining the parameter name
    }
});


// // handle operations on /dishes/:dishId
dishRouter.route('/:dishId/')
.get((req, res, next) => { // open for all
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        console.log('(Get) Will and send details for dish ' + req.params.dishId + ' to you!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))    
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {  // POST = new
    if (req.user.admin) {
        res.statusCode = 403;
        res.end('(Post) operation not supported on /dishes/' + req.params.dishId); 
    }
    else {
        res.statusCode = 403;
        res.end('(Post) You are not authorized to perform this operation!'); 
    }
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // PUT = modify
    if (req.user.admin) {
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
    }
    else {
        res.statusCode = 403;
        res.end('(Put) You are not authorized to perform this operation!'); 
    }
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Dishes.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            console.log('(Delete) Will delete dish ' + req.params.dishId + '!');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))    
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Delete) You are not authorized to perform this operation!'); 
    }
});

// handle comments endpoint
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    // return all of the comments
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {

        if (dish != null) {
            console.log('(Get) Find comments for dish ', req.params.dishId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }

    }, (err) => next(err))
    .catch((err) => next(err)); // errors are passed on to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    //Dishes.findById(req.params.dishId)
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new : true})
    .then((dish) => {

        // Dishes.findByIdAndUpdate(req.params.dishId, {
        //     $set: req.body
        // }, {new : true})


        if (dish != null) {
            console.log('(Post) Comments created for dish ', req.params.dishId);
            console.log(req.body.comment + ' ' + req.body.rating);
            console.log(req.body);
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);        
                    })
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))    
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /dishes/' + req.params.dishId + '/comments'); // <- defining the parameter name
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    if (req.user.admin) {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                console.log('(Delete) Deleting comments for dish ', req.params.dishId);
                for (var i = (dish.comments.length - 1); i >= 0; i--) {
                    console.log('Deleting comment ' + dish.comments[i]._id);
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found.');
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))    
        .catch((err) => next(err));
    }
    else {
        res.statusCode = 403;
        res.end('(Delete) You are not authorized to perform this operation!'); 
    }
});


// // handle operations on /dishes/:dishId  
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
       
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            console.log('(Get) Find comment for dish ', req.params.commentId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }

    }, (err) => next(err))    
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId); 
})
.put(authenticate.verifyUser, (req, res, next) => { // PUT = modify
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                console.log('(Put) Modify comment for dish ', req.params.commentId);
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=> {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
                }, (err) => next(err));
            }
            else {
                res.statusCode = 403;
                res.end('(Put) You are not authorized to perform this operation!'); 
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }

    }, (err) => next(err))    
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                console.log('(Delete) Deleting comment for dish ' + req.params.dishId);
                console.log('Deleting comment ' + req.params.commentId);
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=> {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
                }, (err) => next(err));
            }
            else {
                res.statusCode = 403;
                res.end('(Put) You are not authorized to perform this operation!'); 
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found.');
            res.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))    
    .catch((err) => next(err));
});


module.exports = dishRouter;