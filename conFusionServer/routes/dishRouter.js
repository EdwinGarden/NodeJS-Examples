// handle endpoint for /dashes and /dishId 

const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// can chain all of the operations to the route
// I guess that you can do it all separately as well
dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // starts here and passes on to the other call. Next could only be requires here.. 
})
.get((req, res, next) => {
    res.end('(Get) Will and send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('(Post) Will add a new dish: ' + req.body.name +
    ' with details: ' + req.body.description); // <- defining the parameter name
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /dishes'); // <- defining the parameter name
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete all the dishes!');
});


// // handle operations on /dishes/:dishId
dishRouter.route('/:dishId/')
.get((req, res, next) => {
    res.end('(Get) Will and send details for dish ' + req.params.dishId + ' to you!');
    // '/dishes/:dishId' <--- req.params.dishId. Parameter names need to match
})
.post((req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /dishes/' + req.params.dishId); 
})
.put((req, res, next) => { // PUT = modify
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('(Put) Will update dish ' + req.params.dishId + 
        ', with details: ' + req.body.description + ', for you!');
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete dish ' + req.params.dishId + '!');
});

module.exports = dishRouter;