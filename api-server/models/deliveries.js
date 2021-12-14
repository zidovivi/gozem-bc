const mongoose = require('mongoose');
const uuid = require('node-uuid');

const locationSchema = require('./locationSchema');

const deliverySchema = new mongoose.Schema({
    delivery_id: {type: String, default: uuid.v4},
    package_id: {type: String, required: true},
    pickup_time: {type: Date},
    start_time: {type: Date},
    end_time: {type: Date},
    location: {type: locationSchema, default: {lat:0, lng: 0}},
    status: {type: String, enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'], default: 'open'}
}, {timestamps: true})


module.exports = mongoose.model('Delivery', deliverySchema);