const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostName = 'localhost';
const port = 3000;

const app = express();

app.use(bodyParser.json());

app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // starts here and passes on to the other call. Next could only be requires here.. 
});

// handle operations on /dishes
app.get('/dishes', (req, res, next) => {
    res.end('(Get) Will and send all the dishes to you!');
});

app.post('/dishes', (req, res, next) => {
    res.end('(Post) Will add the new dish: ' + req.body.name +
    ' with details: ' + req.body.description); // <- defining the parameter name
});

app.put('/dishes', (req, res, next) => {
    res.statusCode = 403;
    res.end('(Put) operation not supported on /dishes'); // <- defining the parameter name
});

app.delete('/dishes', (req, res, next) => {
    res.end('(Delete) Will delete all the dishes!');
});

// handle operations on /dishes/:dishId
app.get('/dishes/:dishId', (req, res, next) => {
    res.end('(Get) Will and send details for dish ' + req.params.dishId + ' to you!');
    // '/dishes/:dishId' <--- req.params.dishId. Parameter names need to match
});

app.post('/dishes/:dishId', (req, res, next) => {  // POST = new 
    res.statusCode = 403;
    res.end('(Post) operation not supported on /dishes/' + req.params.dishId); 
});

app.put('/dishes/:dishId', (req, res, next) => { // PUT = modify
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('(Put) Will update dish ' + req.params.dishId + 
        ' with details:' + req.body.description + ', for you!');
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('(Delete) Will delete dish' + req.params.dishId + '!');
});


app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    console.log(req.header);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostName, () => {
    console.log('Server running at http://${hostName}:${port}/');
});