'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('musicappApp'));

  var UserCtrl, scope;

  beforeEach(module(function($provide) {
    $provide.value('displayedUser', { username: 'testuser', _id: 2});
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserCtrl = $controller('UserCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
