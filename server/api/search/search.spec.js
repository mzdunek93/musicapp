'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');

var user = new User({
  provider: 'local',
  username: 'Fake_User',
  email: 'test@test.com',
  password: 'password',
  passwordConfirmation: 'password'
});

var token;

describe('GET /api/search', function() {
  beforeEach(function(done) {
    user.save(function(err, user) {
      request(app)
        .post('/auth/local')
        .send({email: user.email, password: user.password})
        .end(function(err, res) {
          token = res.body.token;
          res.should.have.status(200);
          done();
        });
    });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/search/test?access_token=' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.users.should.be.instanceof(Array);
        res.body.length.should.be.instanceof(Number);
        done();
      });
  });
});
