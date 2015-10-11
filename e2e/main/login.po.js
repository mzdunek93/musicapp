'use strict';

var LoginPage = function() {
  this.email = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.submit = element(by.buttonText('Login'));

  this.login = function(user) {
    browser.get('/login');
    this.email.sendKeys(user.email);
    this.password.sendKeys(user.password);
    this.submit.click();
  };
};

module.exports = new LoginPage();
