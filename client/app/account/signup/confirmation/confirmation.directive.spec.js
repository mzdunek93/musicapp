'use strict';

describe('Directive: confirmation', function () {

  // load the directive's module
  beforeEach(module('musicappApp'));

  var form,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should validate the model when the inputs match', inject(function ($compile) {
    form = angular.element('<form name="form">' +
      '<input name="password" ng-model="password"></input>' +
      '<input name="passwordConfirmation" ng-model="passwordConfirmation" confirmation></input>' +
      '</form>');
    scope.password = "mypass";
    scope.passwordConfirmation = "mypass";
    form = $compile(form)(scope);
    expect(scope.form.$valid).toBe(true);
  }));

  it('should invalidate the model when the inputs don\'t match', inject(function ($compile) {
    form = angular.element('<form name="form">' +
      '<input name="password" ng-model="password"></input>' +
      '<input name="passwordConfirmation" ng-model="passwordConfirmation" confirmation></input>' +
      '</form>');
    scope.password = "mypass";
    scope.passwordConfirmation = "notmypass";
    form = $compile(form)(scope);
    expect(scope.form.$valid).toBe(true);
  }));
});
