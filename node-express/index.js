const express = require('express');
const http = require('http');

const hostName = 'localhost';
const port = 3000;

const app = express();

app.use((req, res, next) => {
    console.log(req.header);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostName, () => {
    console.log('Server running at http://${hostName}:${port}');
});