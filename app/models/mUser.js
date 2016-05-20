var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({ 
  username: {
    type: String,
    unique: true
  },
  password: String,
  createTableAt: {type: Date, default: Date.now}
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

userSchema.pre('save', function(next) {
  var user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

var User = mongoose.model('user', userSchema);




module.exports = User;