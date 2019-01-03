const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

//** This doesn't seem to be a full implementation..
//** Maybe check this out.. https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b */

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true};
    } 
    else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);