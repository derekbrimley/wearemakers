'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './routes';

export class VolunteerController {

  constructor(Auth, $state, $http) {
      'ngInject';
    //   Array of sample data
      this.data = [{attribute1:"A value",attribute2:"Another value"},{attribute1:"a value for the second object",attribute2:"Another value for the second object"}]

    }
}

export default angular.module('refugeeApp.volunteer', [uiRouter])
  .config(routes)
  .component('volunteer', {
    template: require('./index.html'),
    controller: VolunteerController,
    controllerAs: 'ctrl'
  })
  .name;
