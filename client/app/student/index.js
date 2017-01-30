'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './routes';

export class StudentController {

  constructor(Auth, $state, $http) {
      'ngInject';
    //   Array of sample data
      this.data = [{attribute1:"A value",attribute2:"Another value"},{attribute1:"a value for the second object",attribute2:"Another value for the second object"}]

    }
}

export default angular.module('refugeeApp.student', [uiRouter])
  .config(routes)
  .component('student', {
    template: require('./index.html'),
    controller: StudentController,
    controllerAs: 'ctrl'
  })
  .name;
