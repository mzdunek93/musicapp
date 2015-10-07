'use strict';

angular.module('musicappApp')
  .directive('chatBox', function () {
    return {
      templateUrl: 'app/chatBox/chatBox.html',
      restrict: 'E',
      link: function (scope, element, attrs) {

      },
      controller: function(Auth) {
        var chat = this;
        chat.isLoggedIn = Auth.isLoggedIn;
      },
      controllerAs: 'chat'
    };
  });
