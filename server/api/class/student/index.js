'use strict';

var express = require('express');
var controller = require('./student.controller');
import * as auth from '../../../auth/auth.service';

var router = express.Router();

router.get('/',auth.hasRole('admin'), controller.index);
router.get('/register', auth.isType('student'), controller.register);
router.post('/registerforadmin', auth.hasRole('admin'), controller.registerforadmin);
router.get('/:id',auth.hasRole('admin'), controller.show);
//router.get('/:id',auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
