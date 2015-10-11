/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.heroEl = element(by.css('.hero-unit'));
  this.h1El = this.heroEl.element(by.css('h1'));
  this.imgEl = this.heroEl.element(by.css('img'));
  this.navbar = element(by.className('navbar'));
  this.searchBar = this.navbar.element(by.model('search.query'));
  this.searchResults = this.navbar.element(by.className('search-results'));
  this.logout = this.navbar.element(by.linkText('Logout'));
};

module.exports = new MainPage();

