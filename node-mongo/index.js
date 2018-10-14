const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbOperations = require('./operations.js');
const url = 'mongodb://localhost:27017/conFusion';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    
    // check that the error is not null
    assert.equal(err,null);

    // connection is good
    console.log('Connected to server');

    const db = client.db(dbname);

    dbOperations.insertDocument(db, {name: "Vadonut", description:"Test description"}
        , "dishes", (result) => {
            console.log('Insert document:\n', result.ops);

            dbOperations.findDocuments(db, "dishes", (docs) => {
                console.log('Found documents ', docs);

                dbOperations.updateDocument(db, {name: "Vadonut"}, 
                { description: "Updated test description"}, "dishes",
                (result) => {

                    console.log('Updated document:\n ', result.result);

                    dbOperations.findDocuments(db, "dishes", (docs) => {
                        console.log('Found documents:\n ', docs);
                        db.dropCollection("dishes", (result) => {
                            console.log('Dropped collection ', result);

                            client.close();
                        });
                    });
                });
            });
        });




    // const collection = db.collection("dishes");

    // collection.insertOne({"name": "Uthappizza", "description": "Node test description"},
    // (err, result) => {
    //     // nested insersion check in the callback
    //     assert.equal(err, null);

    //     console.log('New item was inserted:\n');
    //     console.log(result.ops);

    //     collection.find({}).toArray((err, docs) => {
    //         // nested find in the insersion callback
    //         assert.equal(err, null);

    //         console.log('Found:\n');
    //         console.log(docs);

    //         db.dropCollection('dishes', (err, result) => {
    //             // nested drop db in the find callback, so depends on success of all callback parents
    //             assert.equal(err, null);

    //             console.log('Closing the database');
    //             client.close();
    //         });
    //     });

    // });
});