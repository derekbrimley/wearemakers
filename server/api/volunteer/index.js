'use strict';

var express = require('express');
var controller = require('./volunteer.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.get('/:id/getClasses', auth.hasRole('admin'), controller.getClasses)
// router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/:id/getByUserId', auth.isAuthenticated(), controller.getByUserId);

module.exports = router;
