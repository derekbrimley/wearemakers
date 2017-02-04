import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './front.routes';

export class FrontController {

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor() {
      'use strict'

  }

}

export default angular.module('refugeeApp.front', [uiRouter])
  .config(routing)
  .component('front', {
    template: require('./front.html'),
    controller: FrontController
  })
  .name;
