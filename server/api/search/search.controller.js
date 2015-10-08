'use strict';

var User = require('./../user/user.model');

// Get list of searchs
exports.search = function(req, res) {
  var query = req.params.query;
  var category = req.query.category;
  var results = { length: 0 };
  if (!category || category === 'users') {
    User.find({ username: new RegExp(query, 'i') }, 'username').limit(3).exec(function (err, users) {
      if(err) { return handleError(res, err); }
      results.users = users.map(function(user) { return user.searchResult; });
      results.length += users.length;
      res.status(200).json(results);
    });
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
