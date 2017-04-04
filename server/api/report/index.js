'use strict';

var express = require('express');
var controller = require('./report.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/students', auth.hasRole('admin'), controller.students);
router.get('/volunteers', auth.hasRole('admin'), controller.volunteers);

module.exports = router;
