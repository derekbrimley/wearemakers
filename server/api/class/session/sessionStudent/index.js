'use strict';

var express = require('express');
var controller = require('./sessionStudent.controller');
import * as auth from '../../../../auth/auth.service';

var router = express.Router();

router.get('/',auth.hasRole('admin'), controller.index);
router.post('/reports/individualStudentAttendance',auth.hasRole('admin'), controller.individualStudentAttendance);
router.post('/register', auth.hasRole('admin'), controller.register);
router.get('/:id',auth.hasRole('admin'), controller.show);
//router.get('/:id',auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
