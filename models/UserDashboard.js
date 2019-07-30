var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var UserDashboardSchema = new mongoose.Schema({
  uid: String,
  name: String,
  model: mongoose.Schema.Types.Mixed,
  updated_at: { type: Date, default: Date.now },
});

UserDashboardSchema.plugin(findOrCreate);

module.exports = mongoose.model('UserDashboard', UserDashboardSchema);
