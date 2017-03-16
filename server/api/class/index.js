'use strict';

var express = require('express');
var controller = require('./class.controller');
var materials = require('./materialsHandler');
import * as auth from '../../auth/auth.service';

var router = express.Router();

require('../../params').default(router)
router.get('/', controller.index);
router.get('/:user/mine', auth.isAuthenticated(), controller.showMine);
//router.get('/notmine', auth.isAuthenticated(), controller.showNotMine);
router.get('/:id', controller.show);
router.get('/reports/classStudentCount/:classid', controller.classStudentCount);
router.get('/reports/attendance/:classid', controller.attendance);
router.get('/getStudentsFromClass/:id', auth.hasRole('admin'),controller.getStudentsFromClass);
router.get('/showStudents/:id', auth.hasRole('admin'),controller.showStudents);
router.get('/showVolunteers/:id', auth.hasRole('admin'),controller.showVolunteers);
router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:class/materials', auth.isAuthenticated(), materials.list);
router.post('/new/materials', auth.hasRole('admin'), materials.uploadMaterial);
router.post('/:class/materials', auth.hasRole('admin'), materials.uploadMaterial);
router.delete('/:class/materials', auth.hasRole('admin'), materials.remove);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.delete('/:id', auth.hasRole('admin'),controller.destroy);

module.exports = router;
