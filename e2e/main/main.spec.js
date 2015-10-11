'use strict';

describe('Main View', function() {
  var page, signup, login;

  beforeEach(function() {
    page = require('./main.po');
    signup = require('./signup.po');
    login = require('./login.po');
    login.login(signup.user1);
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });
});
