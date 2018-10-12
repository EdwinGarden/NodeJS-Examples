// handle endpoints for /leaders and /leaders/leaderId

const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// set up the routes
// leaders
leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // starts here and passes on to the other call. Next could only be requires here.. 
})
.get((req, res, next) => {
    res.end('(Get) Will and send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('(Post) Will add a new leader: ' + req.body.name +
    ' with details: ' + req.body.description); // <- defining the parameter name
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /leaders'); // <- defining the parameter name
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete all the leaders!');
});

// leaderId
leaderRouter.route('/:leaderId/')
.get((req, res, next) => {
    res.end('(Get) Will and send details for leader ' + req.params.leaderId + ' to you!');
})
.post((req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /leaders/' + req.params.leaderId); 
})
.put((req, res, next) => { // PUT = modify
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('(Put) Will update leader ' + req.params.leaderId + 
        ', with details:' + req.body.description + ', for you!');
})
.delete((req, res, next) => {
    res.end('(Delete) Will delete leader ' + req.params.leaderId + '!');
});

module.exports = leaderRouter;
