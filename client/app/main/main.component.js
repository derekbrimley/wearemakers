import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor() {

  }
}

export default angular.module('refugeeApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
