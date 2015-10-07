'use strict';

describe('Directive: confirmation', function () {

  // load the directive's module
  beforeEach(module('musicappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<confirmation></confirmation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the confirmation directive');
  }));
});