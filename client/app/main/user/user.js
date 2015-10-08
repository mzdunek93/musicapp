'use strict';

angular.module('musicappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.user', {
        url: 'user/:username',
        templateUrl: 'app/main/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve: {
          displayedUser: function(User, $stateParams) {
            return User.getUser({id: $stateParams.username}).$promise;
          }
        }
      });
  });
