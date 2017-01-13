'use strict';

var express = require('express');
var controller = require('./pre_signup.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/', controller.index);

module.exports = router;
