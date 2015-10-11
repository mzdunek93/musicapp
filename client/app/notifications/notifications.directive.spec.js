'use strict';

describe('Directive: notifications', function () {

  // load the directive's module and view
  beforeEach(module('musicappApp'));
  beforeEach(module('app/notifications/notifications.html'));

  var element, scope;

  beforeEach(module('stateMock'));

  beforeEach(inject(function ($rootScope, $state, Auth) {
    scope = $rootScope.$new();
    Auth.setCurrentUser({notifications: []});
    $state.expectTransitionTo('login');
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<notifications></notifications>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('No notifications');
  }));
});
