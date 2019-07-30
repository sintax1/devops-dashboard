var mongoose = require('mongoose');

var UserWidgetsSchema = new mongoose.Schema({
  uid: String,
  data: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserWidgets', UserWidgetsSchema);
