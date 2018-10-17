const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

var MongoClient = require('mongodb').MongoClient;

var uri = "replace with connection string";

const connect = mongoose.connect(uri);

connect.then((db) =>{
    console.log('Connected to the mongo server');

    var newDish = Dishes({
        name: 'Uthappizza',
        description: 'test description'
    });

    newDish.save()
        .then((dish) => {
            console.log(dish);

            Dishes.findOne({});
        })
        .then((dishes) => {
            console.log(dishes);

            return Dishes.remove({});
        })
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err);
        });

});
