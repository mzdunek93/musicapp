'use strict';

var main = require('./main.po');

var UserPage = function() {
  this.addToFriends = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.addToFriends = element(by.buttonText('Add to friends'));
  this.cancelInvitation = element(by.buttonText('Cancel invitation'));
  this.unfriend = element(by.buttonText('Remove from friends'));
  this.acceptInvitation = element(by.buttonText('Accept invitation'));
  this.rejectInvitation = element(by.buttonText('Reject invitation'));

  this.goToUser = function(user) {
    main.searchBar.sendKeys(user.username);
    browser.driver.sleep(500);
    main.searchResults.element(by.linkText(user.username)).click();
  };
};

module.exports = new UserPage();
