'use strict';

angular.module('musicappApp')
  .filter('username', function () {
    return function (users, query) {
      return query ? users.filter(user => user.username.toLowerCase().indexOf(query) >= 0) : users;
    };
  });
