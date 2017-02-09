'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import scheduling from './scheduling';
import classes from './classes';
import students from './students';
import volunteers from './volunteers';
import classEditor from '../../components/classEditor';
export default angular.module('refugeeApp.admin', ['refugeeApp.auth', 'ui.router',classes, classEditor, volunteers, students, scheduling])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
