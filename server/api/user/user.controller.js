'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Checks if a username/email address is not taken
 */
exports.available = function (req, res, next) {
  var query = {};
  query[req.query.field] = req.query.value;

  User.findOne(query, function(err, user) {
    if (err) return next(err);
    var status = user ? 400 : 200;
    res.status(status).json({available: !user});
  });
};

exports.friends = function (req, res, next) {
  User.find({_id: {$in: req.user.friends}}, function(err, users) {
    if (err) return next(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var username = req.params.username;

  User.findOne({username: username}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

exports.invite = function(req, res, next) {
  var userId = req.user._id;

  User.findById(req.params.id, function(err, user) {
    if(err) return next(err);
    var invited = user;

    if(!invited) {
      return res.status(400).send('User doesn\'t exist');
    }

    if(invited.invited.indexOf(userId) >= 0) {
      return res.status(400).send('User already invited you');
    }

    User.findById(userId, function (err, user) {
      if(user.invited.indexOf(invited._id) === -1) {
        user.invited.push(invited._id);
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(user);
        });
        invited.inviting.push(userId);
        invited.notifications.push({userId: userId, username: user.username, type: 'invitation'});
        invited.save(function(err) {
          if (err) return validationError(res, err);
        });
      } else {
        res.status(400).send('User is already invited');
      }
    });
  });
};

exports.uninvite = function(req, res, next) {
  var userId = req.user._id;

  User.findOne({_id: req.params.id, 'notifications.userId': userId},
    {'notifications.$': 1, 'inviting': 1}, function(err, user) {
    if(err) return next(err);
    var invited = user;

    if(!invited) {
      return res.status(400).send('User doesn\'t exist');
    }

    User.findById(userId, function (err, user) {
      var index = user.invited.indexOf(invited._id);
      if(index >= 0) {
        user.invited.splice(index, 1);
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(user);
        });
        index = invited.inviting.indexOf(userId);
        invited.inviting.splice(index, 1);
        invited.notifications[0].remove();
        invited.update(invited, function(err) {
          if (err) return validationError(res, err);
        });
      } else {
        res.status(400).send('User is not invited');
      }
    });
  });
};

exports.unfriend = function(req, res, next) {
  var userId = req.user._id;

  User.findById(req.params.id, function(err, user) {
    if(err) return next(err);
    var friend = user;

    if(!friend) {
      return res.status(400).send('User doesn\'t exist');
    }

    if(friend.friends.indexOf(userId) === -1) {
      return res.status(400).send('User is not your friend');
    }

    User.findById(userId, function (err, user) {
      var index = user.friends.indexOf(friend._id);
      if(index >= 0) {
        user.friends.splice(index, 1);
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(user);
        });
        index = friend.friends.indexOf(userId);
        friend.friends.splice(index, 1);
        friend.save(function(err) {
          if (err) return validationError(res, err);
        });
      } else {
        res.status(400).send('User is not your friend');
      }
    });
  });
};

exports.accept = function(req, res, next) {
  var userId = req.user._id;
  var inviting = req.params.id;

  User.findById(req.params.id, function(err, user) {
    if(err) return next(err);
    var inviting = user;

    if(!inviting) {
      return res.status(400).send('User doesn\'t exist');
    }

    User.findOne({_id: userId}, function (err, user) {
      var index = user.inviting.indexOf(inviting._id);
      if(index >= 0) {
        user.inviting.splice(index, 1);
        _.find(user.notifications, 'userId', inviting._id).remove();
        user.friends.push(inviting._id);
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(user);
        });
        index = inviting.invited.indexOf(userId);
        inviting.invited.splice(index, 1);
        inviting.friends.push(user._id);
        inviting.save(function(err) {
          if (err) return validationError(res, err);
        });
      } else {
        res.status(400).send('User is not inviting you');
      }
    });
  });
};

exports.reject = function(req, res, next) {
  var userId = req.user._id;
  var inviting = req.params.id;

  User.findById(req.params.id, function(err, user) {
    if(err) return next(err);
    var inviting = user;

    if(!inviting) {
      return res.status(400).send('User doesn\'t exist');
    }

    User.findOne({_id: userId}, function (err, user) {
      var index = user.inviting.indexOf(inviting._id);
      if(index >= 0) {
        user.inviting.splice(index, 1);
        _.find(user.notifications, 'userId', inviting._id).remove();
        user.friends.splice(user.friends.indexOf(inviting._id), 1);
        user.save(function(err) {
          if (err) return validationError(res, err);
          res.json(user);
        });
        index = inviting.invited.indexOf(userId);
        inviting.invited.splice(inviting.invited.indexOf(userId), 1);
        inviting.friends.splice(inviting.friends.indexOf(userId), 1);
        inviting.save(inviting, function(err) {
          if (err) return validationError(res, err);
        });
      } else {
        res.status(400).send('User is not inviting you');
      }
    });
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
