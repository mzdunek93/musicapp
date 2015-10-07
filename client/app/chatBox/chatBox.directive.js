'use strict';

angular.module('musicappApp')
  .directive('chatBox', function () {
    return {
      templateUrl: 'app/chatBox/chatBox.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });