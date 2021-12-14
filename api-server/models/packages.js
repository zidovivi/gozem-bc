const mongoose = require('mongoose');
const uuid = require('node-uuid');
const locationSchema = require('./locationSchema');

const packageSchema = new mongoose.Schema({
    package_id: {type: String, default: uuid.v4},
    active_delivery_id: String,
    description: {type: String, required:true},
    weight: {type: Number, required: true},
    width: {type: Number, required: true},
    height: {type: Number, required: true},
    depth: {type: Number, required: true},
    from_name: {type: String, required: true},
    from_address: {type: String, required: true},
    from_location: {type: locationSchema, required: true},
    to_name: {type: String, required: true},
    to_address: {type: String, required: true},
    to_location: {type: locationSchema, required: true}

}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);