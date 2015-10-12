'use strict';

describe('Filter: online', function () {

  // load the filter's module
  beforeEach(module('musicappApp'));

  // initialize a new instance of the filter before each test
  var online;
  beforeEach(inject(function ($filter) {
    online = $filter('online');
  }));

  it('should return the input prefixed with "online filter:"', function () {
    var text = 'angularjs';
    expect(online(text)).toBe('online filter: ' + text);
  });

});
