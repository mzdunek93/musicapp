'use strict';

angular.module('musicappApp')
  .directive('chatWindow', function () {
    return {
      templateUrl: 'app/chatBox/chatWindow/chatWindow.html',
      restrict: 'E',
      scope: {
        data: '='
      },
      controllerAs: 'window',
      controller: function ($scope) {
        var window = this;

        $scope.$watch('data', function(data) {
          window.username = data.username;
          window.messages = data.messages;
        });
      }
    };
  });
