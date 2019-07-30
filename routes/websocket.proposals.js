/* Websocket - BizOps proposalss */

var db = require('../models/ProposalModels.js');

module.exports = function(io) {

  // Create msgcenter namespace
  var wsproposalss = io.of('/proposals');

  wsproposalss.on('connection', function(socket){

    socket.on('search', function(params) {
      /*
      * Create index within mongodb: schema.index({"$**":"text"})
      *
      * db.sections.find({$text: {$search: "smart birds who cook"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})
      */
      db.sections.find(
        {$text: {$search: params.string, $language: 'en'}},
        {score: {$meta: "textScore"}})
        .sort({score:{$meta:"textScore"}})
        .limit(params.limit)
        .exec(function(err, sections) {
          if (err) {
            console.error('Error:', err);
            socket.emit('error', err);
            return;
          }
          console.log(sections);
          socket.emit('sections', sections);
        });
    });

    socket.on('save', function(proposal) {
      db.proposals.findOneAndUpdate(
        {title: proposal.title}, 
        {
          $set: {updatedBy: socket.request.user.uid, updatedAt: new Date(), body: proposal.body},
          $setOnInsert: {createdBy: socket.request.user.uid, createdAt: new Date(), title: proposal.title}
        },
        {new: true, upsert: true}, 
        function(err, result) {
          if (err) {
            console.error('Error:', err);
            socket.emit('error', err);
            return;
          }
          socket.emit('saved');
        }
      );
    });
 
    socket.on('gettitles', function(fn) {
      db.proposals.find({})
        .select('title -_id')
        .exec(function(err, titles) {
          if (err) {
            console.error('Error:', err);
            socket.emit('error', err);
            return;
          }
          
          var titlesArr = titles.map(function (element) {
            return element.title;
          });

          fn(titlesArr);
        })
    });

    socket.on('getproposal', function(title, fn) {

      db.proposals.findOne({title:title}, function(err, proposal) {
        if (err) {
          console.error('Error:', err);
          socket.emit('error', err);
          return;
        }
        fn(proposal);
      })
    });

  });
}
