var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var UserStorageSchema = new mongoose.Schema({
  uid: String,
  key: String,
  value: mongoose.Schema.Types.Mixed,
  updated_at: { type: Date, default: Date.now },
});

UserStorageSchema.plugin(findOrCreate);

module.exports = mongoose.model('UserStorage', UserStorageSchema);
