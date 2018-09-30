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
    res.end('(Post) Will add the new dish: ' + req.body.name +
    ' with details: ' + req.body.description); // <- defining the parameter name
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /dishes'); // <- defining the parameter name
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete all the dishes!');
});

module.exports = dishRouter;