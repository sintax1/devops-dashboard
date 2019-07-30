var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
  uid: String,
  type: String,
  widget: String,
  command: String,
  output: mongoose.Schema.Types.Mixed,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);
