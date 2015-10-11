'use strict';

var SignupPage = function() {
  this.username = element(by.model('user.username'));
  this.email = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.passwordConfirmation = element(by.model('user.passwordConfirmation'));
  this.submit = element(by.buttonText('Sign up'));

  this.user1 = {username: 'User1', email: 'user1@example.com', password: 'password'}
  this.user2 = {username: 'User2', email: 'user2@example.com', password: 'password'}

  this.signup = function(user) {
    browser.get('/signup');
    this.username.sendKeys(user.username);
    this.email.sendKeys(user.email);
    this.password.sendKeys(user.password);
    this.passwordConfirmation.sendKeys(user.password);
    this.submit.click();
  };
};

module.exports = new SignupPage();
