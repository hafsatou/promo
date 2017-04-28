/**
 * Created by hafsatou on 27/04/2017.
 */
var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/user');

/* GET Dashboard. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        User.find({_id: req.session.passport.user}, function (err, currentUser) {
            res.render('admin/dashboard', {products: docs, notif: currentUser[0].notif});
        });
    });
});

router.post('/', function (req, res, next) {
    if (req.body.promo_price == 0) {
        Product.findOneAndUpdate({_id: req.body._id}, {$set: {promo: false, promo_price: 0}}, function (err) {
            Product.find(function (err, docs) {
                res.render('admin/dashboard', {products: docs});
            });
        });
    } else {
        Product.findOneAndUpdate({_id: req.body._id}, {
            $set: {
                promo: true,
                promo_price: req.body.promo_price
            }
        }, function (err) {
            Product.find(function (err, docs) {
                res.render('admin/dashboard', {products: docs});
            });
        });
    }

});


router.post('/clear', function (req, res, next) {
    User.find({_id: req.session.passport.user}, function (err, currentUser) {
        currentUser[0].notif = new Array();
        User.findOneAndUpdate({_id: currentUser[0]._id}, currentUser[0], function (err) {
            res.redirect('/admin');
        });
    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
