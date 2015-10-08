'use strict';

var express = require('express');
var controller = require('./search.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:query', auth.isAuthenticated(), controller.search);

module.exports = router;
