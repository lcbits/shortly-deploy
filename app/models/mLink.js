var mongoose = require('mongoose');
var crypto = require('crypto');

var linkSchema = new mongoose.Schema({ 
  id: mongoose.Schema.Types.ObjectId,
  url: { type: String, unique: true },
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createTableAt: {type: Date, default: Date.now}
});

linkSchema.pre('save', function(next) {
  var link = this;
  var shasum = crypto.createHash('sha1')
    .update(link.url)
    .digest('hex')
    .slice(0, 5);
  link.code = shasum;
  next();
});

var Link = mongoose.model('urls', linkSchema);

module.exports = Link;

