'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/available', controller.available);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id/invite', auth.isAuthenticated(), controller.invite);
router.get('/:id/uninvite', auth.isAuthenticated(), controller.uninvite);
router.get('/:id/unfriend', auth.isAuthenticated(), controller.unfriend);
router.get('/:username/show', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
