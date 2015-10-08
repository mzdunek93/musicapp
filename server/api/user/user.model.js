'use strict';

var mongoose = require('mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    validate: validator.isEmail
  },
  role: {
    type: String,
    default: 'user'
  },
  friends : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  hashedPassword: { type: String, required: true },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

UserSchema
  .virtual('passwordConfirmation')
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  })
  .get(function() {
    return this._passwordConfirmation;
  });

UserSchema
  .virtual('searchResult')
  .get(function() {
    return {
      'username': this.username
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'username': this.username,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate password confirmation and length
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (this._password || this._passwordConfirmation) {
      if (this.password.length < 6) {
        this.invalidate('password', 'must be at least 6 characters long.');
      }
      if (this._password !== this._passwordConfirmation) {
        this.invalidate('passwordConfirmation', 'passwords don\'t match.');
      }
    }

    if (this.isNew && !this._password) {
      this.invalidate('password', 'required');
    }
  }, null);

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
