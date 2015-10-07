'use strict';

angular.module('musicappApp')
  .directive('available', function ($http) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.available = value =>
          $http.get('api/users/available?field=' + attrs.name + '&value=' + value);
      }
    };
  });
