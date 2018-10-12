// handle endpoints for /promotions and promotions/promotionId

const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// set up the routes
// promotions
promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // starts here and passes on to the other call. Next could only be requires here.. 
})
.get((req, res, next) => {
    res.end('(Get) Will and send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('(Post) Will add a new promotion: ' + req.body.name +
    ' with details: ' + req.body.description); // <- defining the parameter name
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /promotions'); // <- defining the parameter name
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete all the promotions!');
});

// promotionId
promoRouter.route('/:promotionId/')
.get((req, res, next) => {
    res.end('(Get) Will and send details for promotion ' + req.params.promotionId + ' to you!');
})
.post((req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /promotions/' + req.params.promotionId); 
})
.put((req, res, next) => { // PUT = modify
    res.write('Updating the promotion: ' + req.params.promotionId + '\n');
    res.end('(Put) Will update promotion ' + req.params.promotionId + 
        ', with details: ' + req.body.description + ', for you!');
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete promotion ' + req.params.promotionId + '!');
});

module.exports = promoRouter;