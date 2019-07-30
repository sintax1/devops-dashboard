var express = require('express');
var router = express.Router();

var UserDashboard = require('../models/UserDashboard.js');

/* GET /dashboards
*
*  List all dashboards
*/
router.get('/', function(req, res, next) {
  UserDashboard.find({uid: req.user.uid}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* GET /dashboards/:name
*
*  Get a name/value
*/
router.get('/:name', function(req, res, next) {
  UserDashboard.findOne({uid: req.user.uid, name: req.params.name}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* PUT /dashboards
*
*  Update a Dashboard
*/
router.put('/', function(req, res, next) {
  UserDashboard.findOneAndUpdate({uid: req.user.uid, name: req.body.name}, {name: req.body.name, model: req.body.model}, {new: true, upsert: true}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* DELETE /dashboards/:name 
*
*  Remove a Dashboard
*/
router.delete('/:name', function(req, res, next) {
  UserDashboard.findOneAndRemove({uid: req.user.uid, name: req.params.name}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;

