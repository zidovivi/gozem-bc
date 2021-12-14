const express = require('express');
const router = express.Router();

const Delivery = require('../../models/deliveries');
const Package = require('../../models/packages');
const {body, param,validationResult} = require('express-validator');

router.get('/delivery', function (req, res, next) {
    Delivery.find({})
        .select('-_id')
        .exec((error, deliveries) => {
            if (error) {
                res
                    .status(404)
                    .json(error);
                return;
            }

            res
                .status(200)
                .json(deliveries);
        })
})

router.post('/delivery',
    body('package_id').notEmpty().trim(),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        Package
            .findOne({package_id: req.body.package_id})
            .exec((err, pkg) => {
                if (!pkg) {
                    res
                        .status(404)
                        .json({
                            "message": "packageid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }

                console.log('package to attach to delivery: ' + pkg);
                Delivery.create({
                    package_id: req.body.package_id,
                }, (err, delivery) => {
                    if (err) {
                        res
                            .status(400)
                            .json(err);
                    } else {
                        pkg.active_delivery_id = delivery.delivery_id;
                        pkg.save().then((savedPkg) => {
                            console.log('Updated package after delivery creation: ' + savedPkg)
                            res
                                .status(201)
                                .json(delivery);
                        }).catch(err => {
                            res
                                .status(400)
                                .json(err);
                        });

                    }
                })
            });


    })

router.get('/delivery/:id', function (req, res, next) {
    if (req.params && req.params.id) {
        Delivery
            .findOne({delivery_id: req.params.id})
            .exec((err, delivery) => {
                if (!delivery) {
                    res
                        .status(404)
                        .json({
                            "message": "deliveryid not found"
                        });
                    return;
                } else if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }
                res
                    .status(200)
                    .json(delivery);
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No deliveryid in request url"
            });
    }
})

router.put('/delivery/:id',
    param('id').notEmpty().isAlphanumeric(),
    body('package_id').notEmpty().trim(),
    body('status').notEmpty().trim().escape().isIn(['open', 'picked-up', 'in-transit', 'delivered', 'failed']),
    body('location_lat').isNumeric(),
    body('location_lng').isNumeric(),
    body('pickup_time').if(body('status').isIn(['picked-up', 'in-transit', 'delivered', 'failed'])).isDate(),
    body('start_time').if(body('status').isIn(['in-transit', 'delivered', 'failed'])).isDate(),
    body('end_time').if(body('status').isIn(['delivered', 'failed'])).isDate(),
    function (req, res, next) {
        if (!req.params.id) {
            res
                .status(404)
                .json({
                    "message": "Not found, delivery is required"
                });
            return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        Delivery
            .findOne({delivery_id: req.params.id}) // updateOne
            .exec((err, delivery) => {
                    if (!delivery) {
                        res
                            .status(404)
                            .json({
                                "message": "deliveryid not found"
                            });
                        return;
                    } else if (err) {
                        res
                            .status(400)
                            .json(err);
                        return;
                    }
                    delivery.package_id = req.body.package_id;
                    delivery.location = {
                        lat: parseFloat(req.body.location_lat),
                        lng: parseFloat(req.body.location_lng)
                    };
                    delivery.status = req.body.status;

                    if (req.body.pickup_time) {
                        delivery.pickup_time = req.body.pickup_time;
                    }
                    if (req.body.start_time) {
                        delivery.start_time = req.body.start_time;
                    }
                    if (req.body.end_time) {
                        delivery.end_time = req.body.end_time;
                    }


                    delivery.save().then((savedDelivery) => {
                        res
                            .status(200)
                            .json(savedDelivery);
                    }).catch(err => {
                        res
                            .status(400)
                            .json(err);
                    });
                }
            );
    })

router.delete('/delivery/:id', function (req, res, next) {
    const deliveryId = req.params.id;
    if (deliveryId) {
        Delivery
            .findOneAndRemove({delivery_id: deliveryId})
            .exec((err) => {
                    if (err) {
                        res
                            .status(404)
                            .json(err);
                        return;
                    }
                    res
                        .status(204)
                        .json(null);
                }
            );
    } else {
        res
            .status(400)
            .json({
                "message": "No deliveryid in request url"
            });
    }
})

module.exports = router;