'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import scheduling from './scheduling';
import classes from './classes';
import students from './students';
import volunteers from './volunteers';
import reports from './reports';
import users from './users';
import admins from './admins';
import classEditor from '../../components/classEditor';
export default angular.module('refugeeApp.admin', ['refugeeApp.auth', 'ui.router', classes, classEditor, volunteers, students, scheduling, reports, users, admins])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
