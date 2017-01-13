'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
import config from '../../config/environment';
var router = express.Router();

router
  .get('/', passport.authenticate('google', {
    failureRedirect: 'http://'+config.domain+'/signup',
    scope: [
      'profile',
      'email'
    ],
    session: false
  }))

  .get('/callback', passport.authenticate('google', {
    failureRedirect: 'http://'+config.domain+'/signup',
    session: false
  }), setTokenCookie);

export default router;
