'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';
import config from '../../config/environment';

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    successRedirect: 'http://'+config.domain,
    session: false
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: 'http://'+config.domain+'/signup',
    successRedirect: 'http://'+config.domain,
    session: false
  }), setTokenCookie);

export default router;
