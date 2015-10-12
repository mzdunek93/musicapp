'use strict';

angular.module('musicappApp')
  .filter('online', function () {
    return function (user) {
      return user.connections > 0 ? 'online' : 'offline';
    };
  });
