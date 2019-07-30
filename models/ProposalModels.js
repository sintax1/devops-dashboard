var mongoose = require('mongoose');
var config = require('../server/config/config.js');
var conn = mongoose.createConnection('mongodb://' + config.mongoproposals.server + '/' + config.mongoproposals.database, { config: { autoIndex: true } });

var section = new mongoose.Schema({
  date: { type: Date, default: Date.now },    // When this text was added
  filename: String,                           // filename
  title:  String,                             // Title (optional)
  body:   String,                             // The text itself
  hash:   { type: String, unique: true }      // hash of the text
 }, {collection: 'section'});
 
var file = new mongoose.Schema({
  date: { type: Date, default: Date.now },            // when file was uploaded
  uploaded_by:    String,                             // uploaded by
  created_time:   String,                             // file create time
  modified_time:  String,                             // file mod time
  modified_by:    String,                             // who mod last
  file_size:      String                              // file size 
 }, {collection: 'file'});

section.index({'$**': 'text'});

//sections.index({'hash': 1}, {unique: true});

var Proposal = conn.model('proposal', file);
var ProposalSection = conn.model('section', section);

module.exports = {
  proposals: Proposal,
  sections: ProposalSection
}
