'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import classes from './classes';
import classEditor from '../../components/classEditor';
export default angular.module('refugeeApp.admin', ['refugeeApp.auth', 'ui.router',classes, classEditor])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
