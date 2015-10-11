'use strict';

describe('Directive: searchBox', function () {

  // load the directive's module and view
  beforeEach(module('musicappApp'));
  beforeEach(module('app/searchBox/searchBox.html'));

  var element, scope;

  beforeEach(module('stateMock'));

  beforeEach(inject(function ($rootScope, $state) {
    scope = $rootScope.$new();
    $state.expectTransitionTo('login');
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-box></search-box>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toMatch('No results');
  }));
});
