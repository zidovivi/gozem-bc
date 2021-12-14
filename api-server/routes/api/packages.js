const express = require('express');
const router = express.Router();
const Package = require('../../models/packages');
const {body, validationResult} = require('express-validator');

router.get('/package', function (req, res, next) {
    Package.find({})
        .select('-_id')
        .exec((error, packages) => {
            if (error) {
                res
                    .status(404)
                    .json(error);
                return;
            }

            res
                .status(200)
                .json(packages);
        })
})

router.post('/package',
    body('description').notEmpty().trim().escape(),
    body('weight').isNumeric(),
    body('width').isNumeric(),
    body('height').isNumeric(),
    body('depth').isNumeric(),
    body('from_name').notEmpty().trim().escape(),
    body('from_address').notEmpty(),
    body('from_location_lat').isNumeric(),
    body('from_location_lng').isNumeric(),
    body('to_name').notEmpty().trim().escape(),
    body('to_address').notEmpty().trim().escape(),
    body('to_location_lat').isNumeric(),
    body('to_location_lng').isNumeric(),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        Package.create({
            description: req.body.description,
            weight: req.body.weight,
            width: req.body.width,
            height: req.body.height,
            depth: req.body.depth,
            from_name: req.body.from_name,
            from_address: req.body.from_address,
            from_location: {lat: parseFloat(req.body.from_location_lat), lng: parseFloat(req.body.from_location_lng)},
            to_name: req.body.to_name,
            to_address: req.body.to_address,
            to_location: {lat: parseFloat(req.body.to_location_lat), lng: parseFloat(req.body.to_location_lng)},
        }, (err, pkg) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(pkg);
            }
        })

    })

router.get('/package/:id', function (req, res, next) {
    if (req.params && req.params.id) {
        Package
            .findOne({package_id: req.params.id})
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
                res
                    .status(200)
                    .json(pkg);
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No packageid in request url"
            });
    }
})

router.put('/package/:id',
    body('description').notEmpty().trim().escape(),
    body('delivery_id').optional().isAlphanumeric().trim(),
    body('weight').isNumeric(),
    body('width').isNumeric(),
    body('height').isNumeric(),
    body('depth').isNumeric(),
    body('from_name').notEmpty().trim().escape(),
    body('from_address').notEmpty(),
    body('from_location_lat').isNumeric(),
    body('from_location_lng').isNumeric(),
    body('to_name').notEmpty().trim().escape(),
    body('to_address').notEmpty().trim().escape(),
    body('to_location_lat').isNumeric(),
    body('to_location_lng').isNumeric(),
    function (req, res, next) {
    if (!req.params.id) {
        res
            .status(404)
            .json({
                "message": "Not found, packageid is required"
            });
        return;
    }
    Package
        .findOne({package_id: req.params.id})
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
                        .status(400)
                        .json(err);
                    return;
                }
                if(req.body.delivery_id) {
                    pkg.delivery_id = req.body.delivery_id;
                }
                pkg.description = req.body.description;
                pkg.weight = req.body.weight;
                pkg.width = req.body.width;
                pkg.height = req.body.height;
                pkg.depth = req.body.depth;
                pkg.from_name = req.body.from_name;
                pkg.from_address = req.body.from_address;
                pkg.from_location = {
                    lat: parseFloat(req.body.from_location_lat),
                    lng: parseFloat(req.body.from_location_lng)
                };
                pkg.to_name = req.body.to_name;
                pkg.to_address = req.body.to_address;
                pkg.to_location = {
                    lat: parseFloat(req.body.to_location_lat),
                    lng: parseFloat(req.body.to_location_lng)
                };

                pkg.save().then((savedPkg) => {
                    res
                        .status(200)
                        .json(savedPkg);
                }).catch(err => {
                    res
                        .status(404)
                        .json(err);
                });
            }
        );
})

router.delete('/package/:id', function (req, res, next) {
    const packageid = req.params.id;
    if (packageid) {
        Package
            .findOneAndRemove({package_id: packageid})
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
                "message": "No packageid in request url"
            });
    }
})

module.exports = router;