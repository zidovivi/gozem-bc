const mongoose = require('mongoose');

/*to_location: {
    type: [Number],
        index: '2dsphere'
}*/

const locationSchema = new mongoose.Schema({
    lat: {type: Number, required: true},
    lng: {type: Number, required: true}
}, { _id : false });

module.exports = locationSchema;