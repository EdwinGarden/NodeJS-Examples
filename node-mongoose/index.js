const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

//var MongoClient = require('mongodb').MongoClient;

var uri = "";

const connect = mongoose.connect(uri);

connect.then((db) =>{
    console.log('Connected to the mongo server');

    //var newDish = Dishes({
    Dishes.create({
        name: 'Uthappizza_09',
        description: 'test description'
    })
    .then((dish) => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: {description: 'Updated the dish..'}
        },{
            new: true
        });
    })
    .then((dish) => {
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling',
            author: 'Leonardo di Carpaccio'
        });

        return dish.save();
    })
    .then((dish) => {
        console.log(dish);
        
        Dishes.collection.drop();
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

});
