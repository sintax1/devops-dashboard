var express = require('express');
var router = express.Router();
var config = require('../server/config/config.js');
var client = require('node-impala').createClient(); 

/* POST /impala { query: 'QUERY STRING' } */
router.post('/', function(req, res, next) {
  client.connect({
    host: config.impala.server,
    port: config.impala.port,
    resultType: 'json-array'
  });

  console.log(req.body.query);

  client.query(req.body.query)
    .then(result => function(result) {
      res.json(result);
    })
    .catch(err => console.error(err))
    .done(() => client.close().catch(err => console.error(err)));
});

module.exports = router;
