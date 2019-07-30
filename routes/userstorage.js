var express = require('express');
var router = express.Router();

var UserStorage = require('../models/UserStorage.js');

/* GET /userstorage listing. */
router.get('/', function(req, res, next) {
  UserStorage.find({uid: req.user.uid}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* GET /userstorage/:key listing. */
router.get('/:key', function(req, res, next) {
  UserStorage.findOne({uid: req.user.uid, key: req.params.key}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* PUT /userstorage/:key */
router.put('/:key', function(req, res, next) {
  UserStorage.update({uid: req.user.uid, key: req.params.key}, {key: req.params.key, value: req.body.value}, {upsert: true, new: true}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* DELETE /userstorage/:key */
router.delete('/:key', function(req, res, next) {
  UserStorage.findOneAndRemove({uid: req.user.uid, key: req.params.key}, req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;

