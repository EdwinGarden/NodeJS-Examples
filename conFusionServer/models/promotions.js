const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const promotionsSchema = new Schema({
    "name": "Weekend Grand Buffet",
    "image": "images/buffet.jpg",
    "label": "New",
    "price": "19.99",
    "description": "Featuring...",
    "featured": false
});