var express = require('express');
var router = express.Router();

var Log = require('../models/Log.js');

/* POST /logger */
router.post('/', function(req, res, next) {
  var new_log = Log(req.body);
  new_log.uid = req.user.uid;

  new_log.save(function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* GET /logger listing. */
router.get('/', function(req, res, next) {
  Log.find({uid: req.user.uid}, function (err, data) {
    if (err) return next(err);
    
    res.json(data);
  });
});

/* GET /logger/:id listing. */
router.get('/:id', function(req, res, next) {
  Log.findOrCreate({uid: req.user.uid, id: req.params.id}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* PUT /logger */
router.put('/', function(req, res, next) {
  Log.findOneAndUpdate({uid: req.user.uid, type: req.body.type, widget: req.body.widget, command: req.body.command, output: req.body.output}, {upsert: true, new: true}, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

/* DELETE /logger/:id */
router.delete('/:id', function(req, res, next) {
  Log.findOneAndRemove({uid: req.user.uid, id: req.params.id}, req.body, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;

