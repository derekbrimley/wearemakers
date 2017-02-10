/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/classes', require('./api/class'));
    app.use('/api/classes/:class/students', require('./api/class/student'));
    app.use('/api/classes/:class/volunteers', require('./api/class/volunteer'));
    app.use('/api/classes/:class/sessions', require('./api/class/session'));
        app.use('/api/classes/:class/sessions/:session/volunteers', require('./api/class/session/sessionVolunteer'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/volunteers', require('./api/volunteer'));
  app.use('/api/preSignup', require('./api/pre_signup'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
