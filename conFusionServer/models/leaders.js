const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const leaderSchema = new Schema({
    "name": "Peter Pan",
    "image":"images/alberto.png",
    "designation": "Chief Epicurious Officer",
    "abbr": "CEO",
    "description": "Our CEO, Peter, ...",
    "featured": false
});