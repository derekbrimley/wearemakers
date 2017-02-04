'use strict';
import {FrontController} from './front.component'
export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('front', {
    url: '/',
    template: require('./front.html'),
    controller: FrontController,
    controllerAs: 'ctrl',
    abstract: true
  })
  .state('front.home', {
    url: '',
    template: require('./home.html'),
    parent:'front'
  })
  .state('front.who-we-work-with', {
    url: 'who-we-work-with',
    template: require('./who-we-work-with.html'),
    parent:'front'
  })
  .state('front.courses', {
    url: 'courses',
    template: require('./courses.html'),
    parent:'front'
  })
  .state('front.how-you-can-help', {
    url: 'how-you-can-help',
    template: require('./how-you-can-help.html'),
    parent:'front'
  })
  .state('front.students', {
    url: 'students',
    template: require('./students.html'),
    parent:'front'
  })
}
