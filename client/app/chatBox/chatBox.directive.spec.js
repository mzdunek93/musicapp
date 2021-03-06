'use strict';

describe('Directive: chatBox', function () {

  // load the directive's module and view
  beforeEach(module('musicappApp'));
  beforeEach(module('app/chatBox/chatBox.html'));

  var element, scope;

  beforeEach(module('stateMock'));

  beforeEach(inject(function ($rootScope, $state, Auth) {
    scope = $rootScope.$new();
    Auth.setCurrentUser({role: true});
    $state.expectTransitionTo('login');
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-box></chat-box>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatBox directive');
  }));
});
