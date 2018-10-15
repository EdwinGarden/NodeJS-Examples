const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbOperations = require('./operations.js');
const url = 'mongodb://localhost:27017/conFusion';
const dbname = 'conFusion';

MongoClient.connect(url).then((client) => {    
    // connection is good
    console.log('Connected to server');

    const db = client.db(dbname);

    dbOperations.insertDocument(db, {name: "Vadonut", description:"Test description"}
        ,"dishes")
        .then((result) => {
            console.log('Insert document:\n', result.ops);
            return dbOperations.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log('Found documents: ');
            return dbOperations.updateDocument(db, {name: "Vadonut"}, {description: "Updated test"}, "dishes");
        })
        .then((result) => {
            console.log("Updated document:\n", result.result);
            return dbOperations.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log('Found updated documents:\n', docs);
            return db.dropCollection("dishes");
        })
        .then((result) => {
            console.log('Dropped collection: ', result);
            return client.close();
        })
        .catch((err) => console.log(err));

    })
    .catch((err) => console.log(err));


