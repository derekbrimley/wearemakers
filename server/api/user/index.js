'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/countallusers', auth.hasRole('admin'), controller.countallusers);
router.get('/countusersbytype/:type', auth.hasRole('admin'), controller.countusersbytype);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id/promote', auth.hasRole('admin'), controller.promote);
router.get('/:id/revoke', auth.hasRole('admin'), controller.revoke);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/me', auth.isAuthenticated(), controller.upsert);
router.put('/:userID/upsert', auth.hasRole('admin'), controller.upsert);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
