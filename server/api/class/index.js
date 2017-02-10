'use strict';

var express = require('express');
var controller = require('./class.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/mine', auth.isAuthenticated(), controller.showMine);
//router.get('/notmine', auth.isAuthenticated(), controller.showNotMine);
router.get('/:id', controller.show);
router.get('/showStudents/:id', auth.hasRole('admin'),controller.showStudents);
router.get('/showVolunteers/:id', auth.hasRole('admin'),controller.showVolunteers);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.delete('/:id', auth.hasRole('admin'),controller.destroy);

module.exports = router;
