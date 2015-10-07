'use strict';

angular.module('musicappApp')
  .directive('confirmation', function () {
    return {
      require: ['ngModel', '^form'],
      restrict: 'A',
      link: function (scope, element, attrs, ctrls) {
        var ngModel = ctrls[0], form = ctrls[1];
        var attrName = attrs.name.slice(0, -12);
        var otherModel = form[attrName];
        scope.$watch(() => otherModel.$modelValue, function(value) {
          ngModel.$validate();
        });
        ngModel.$validators.confirmation = value =>
          value === form[attrName].$modelValue;
      }
    };
  });
