const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    
    // check that the error is not null
    assert.equal(err,null);

    // connection is good
    console.log('Connected to server');

    const db = client.db(dbname);
    const collection = db.collection("dishes");

    collection.insertOne({"name": "Uthappizza", "description": "Node test description"},
    (err, result) => {
        // nested insersion check in the callback
        assert.equal(err, null);

        console.log('New item was inserted:\n');
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => {
            // nested find in the insersion callback
            assert.equal(err, null);

            console.log('Found:\n');
            console.log(docs);

            db.dropCollection('dishes', (err, result) => {
                // nested drop db in the find callback, so depends on success of all callback parents
                assert.equal(err, null);

                console.log('Closing the database');
                client.close();
            });
        });

    });
});