var express = require('express');
var request = require('request');        // For making API requests
var router = express.Router();

/* Authentication Routes */
router.all(/(.*)/, function(req, res) {
  var url = req.url.substring(1);       // Remove leading slash
  req.pipe(request(url)).pipe(res);     // make request and return results
});

module.exports = router;
