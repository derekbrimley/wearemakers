'use strict';

var express = require('express');
var controller = require('./sessionVolunteer.controller');
import * as auth from '../../../../auth/auth.service';

var router = express.Router();

router.get('/',auth.hasRole('admin'), controller.index);
router.get('/register', auth.isType('sessionVolunteer'), controller.register);
router.get('/:id',auth.hasRole('admin'), controller.show);
//router.get('/:id',auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
