'use strict';

describe('User', function() {
  var main, user, signup, login;

  beforeEach(function() {
    main = require('./main.po');
    user = require('./user.po');
    signup = require('./signup.po');
    login = require('./login.po');
    login.login(signup.user1);
  });

  it('should be able to send and withdraw an invitation', function() {
    user.goToUser(signup.user2);

    user.addToFriends.click();
    expect(user.cancelInvitation.isPresent()).toBe(true);

    user.cancelInvitation.click();
    expect(user.addToFriends.isPresent()).toBe(true);
  });

  it('should be able to accept an invitation', function() {
    user.goToUser(signup.user2);

    user.addToFriends.click();
    main.logout.click();

    login.login(signup.user2);
    user.goToUser(signup.user1);

    expect(user.acceptInvitation.isPresent()).toBe(true);
    user.acceptInvitation.click();

    expect(user.unfriend.isPresent()).toBe(true);
    user.unfriend.click();
  });

  it('should be able to reject an invitation', function() {
    user.goToUser(signup.user2);

    browser.sleep(2000);

    user.addToFriends.click();
    main.logout.click();

    login.login(signup.user2);
    user.goToUser(signup.user1);

    expect(user.rejectInvitation.isPresent()).toBe(true);
    user.rejectInvitation.click();

    expect(user.addToFriends.isPresent()).toBe(true);
  });
});
