'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
import config from '../../config/environment';

var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: 'http://'+config.domain+'/signup',
    session: false
  }),setTokenCookie)
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://'+config.domain+'/signup',
    session: false
  }), setTokenCookie);

export default router;
